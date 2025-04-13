#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
    use frame_support::{
        dispatch::{DispatchResult, DispatchResultWithPostInfo},
        pallet_prelude::*,
        traits::{Currency, ReservableCurrency},
    };
    use frame_system::pallet_prelude::*;
    use sp_std::prelude::*;

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
        type Currency: Currency<Self::AccountId> + ReservableCurrency<Self::AccountId>;
    }

    #[pallet::pallet]
    pub struct Pallet<T>(_);

    // DID structure
    #[pallet::storage]
    #[pallet::getter(fn dids)]
    pub type DIDs<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        T::AccountId,
        Did<T::AccountId, T::BlockNumber>,
        OptionQuery,
    >;

    // DID data structure
    #[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
    #[scale_info(skip_type_params(T))]
    pub struct Did<AccountId, BlockNumber> {
        pub controller: AccountId,
        pub created: BlockNumber,
        pub updated: BlockNumber,
        pub metadata: Vec<u8>,
    }

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        // DID was created
        DidCreated(T::AccountId),
        // DID was updated
        DidUpdated(T::AccountId),
        // DID was deactivated
        DidDeactivated(T::AccountId),
    }

    #[pallet::error]
    pub enum Error<T> {
        // DID already exists
        DidAlreadyExists,
        // DID does not exist
        DidNotFound,
        // Only the controller can update the DID
        NotController,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        // Create a new DID
        #[pallet::call_index(0)]
        #[pallet::weight(10_000)]
        pub fn create_did(
            origin: OriginFor<T>,
            metadata: Vec<u8>,
        ) -> DispatchResultWithPostInfo {
            let who = ensure_signed(origin)?;

            ensure!(!<DIDs<T>>::contains_key(&who), Error::<T>::DidAlreadyExists);

            let current_block = <frame_system::Pallet<T>>::block_number();

            let did = Did {
                controller: who.clone(),
                created: current_block,
                updated: current_block,
                metadata,
            };

            <DIDs<T>>::insert(&who, did);

            Self::deposit_event(Event::DidCreated(who));

            Ok(().into())
        }

        // Update DID metadata
        #[pallet::call_index(1)]
        #[pallet::weight(10_000)]
        pub fn update_did(
            origin: OriginFor<T>,
            metadata: Vec<u8>,
        ) -> DispatchResultWithPostInfo {
            let who = ensure_signed(origin)?;

            let mut did = Self::dids(&who).ok_or(Error::<T>::DidNotFound)?;

            ensure!(did.controller == who, Error::<T>::NotController);

            did.metadata = metadata;
            did.updated = <frame_system::Pallet<T>>::block_number();

            <DIDs<T>>::insert(&who, did);

            Self::deposit_event(Event::DidUpdated(who));

            Ok(().into())
        }

        // Deactivate a DID
        #[pallet::call_index(2)]
        #[pallet::weight(10_000)]
        pub fn deactivate_did(origin: OriginFor<T>) -> DispatchResultWithPostInfo {
            let who = ensure_signed(origin)?;

            let did = Self::dids(&who).ok_or(Error::<T>::DidNotFound)?;

            ensure!(did.controller == who, Error::<T>::NotController);

            <DIDs<T>>::remove(&who);

            Self::deposit_event(Event::DidDeactivated(who));

            Ok(().into())
        }
    }
}

// Add JSON-RPC endpoint for querying DID
#[cfg(feature = "runtime-apis")]
pub mod api {
    use super::*;
    use sp_api::decl_runtime_apis;

    decl_runtime_apis! {
        pub trait DidApi<AccountId, BlockNumber> {
            fn get_did(account: AccountId) -> Option<Did<AccountId, BlockNumber>>;
        }
    }
} 