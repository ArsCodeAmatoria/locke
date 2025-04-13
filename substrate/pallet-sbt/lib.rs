#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
    use frame_support::{
        dispatch::{DispatchResult, DispatchResultWithPostInfo},
        pallet_prelude::*,
        traits::{Currency, ReservableCurrency, Get},
    };
    use frame_system::pallet_prelude::*;
    use sp_std::prelude::*;
    use sp_runtime::traits::StaticLookup;

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
        type Currency: Currency<Self::AccountId> + ReservableCurrency<Self::AccountId>;
        type SbtId: Member + Parameter + MaxEncodedLen + Copy + From<u32>;
        type MaxMetadataLength: Get<u32>;
    }

    #[pallet::pallet]
    pub struct Pallet<T>(_);

    // SBT structure
    #[pallet::storage]
    #[pallet::getter(fn sbts)]
    pub type Sbts<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        T::SbtId,
        SbtInfo<T::AccountId, T::BlockNumber>,
        OptionQuery,
    >;

    // Owning SBTs for an account
    #[pallet::storage]
    #[pallet::getter(fn sbts_by_owner)]
    pub type SbtsByOwner<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        T::AccountId,
        BoundedVec<T::SbtId, ConstU32<100>>,
        ValueQuery,
    >;

    // Counter for SBT IDs
    #[pallet::storage]
    #[pallet::getter(fn next_sbt_id)]
    pub type NextSbtId<T: Config> = StorageValue<_, T::SbtId, ValueQuery>;

    // Approved issuers
    #[pallet::storage]
    #[pallet::getter(fn approved_issuers)]
    pub type ApprovedIssuers<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        T::AccountId,
        bool,
        ValueQuery,
    >;

    // SBT data structure
    #[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
    #[scale_info(skip_type_params(T))]
    pub struct SbtInfo<AccountId, BlockNumber> {
        pub owner: AccountId,
        pub issuer: AccountId,
        pub issued_at: BlockNumber,
        pub name: BoundedVec<u8, ConstU32<64>>,
        pub metadata: BoundedVec<u8, ConstU32<1024>>,
    }

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        // SBT was minted
        SbtMinted(T::SbtId, T::AccountId, T::AccountId), // id, owner, issuer
        // Issuer was approved
        IssuerApproved(T::AccountId),
        // Issuer was revoked
        IssuerRevoked(T::AccountId),
    }

    #[pallet::error]
    pub enum Error<T> {
        // SBT does not exist
        SbtNotFound,
        // SBT already exists
        SbtAlreadyExists,
        // Account is not an approved issuer
        NotApprovedIssuer,
        // Metadata too long
        MetadataTooLong,
        // No permission to perform action
        NoPermission,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        // Approve an account as an SBT issuer
        #[pallet::call_index(0)]
        #[pallet::weight(10_000)]
        pub fn approve_issuer(
            origin: OriginFor<T>,
            issuer: <T::Lookup as StaticLookup>::Source,
        ) -> DispatchResultWithPostInfo {
            ensure_root(origin)?;

            let issuer = T::Lookup::lookup(issuer)?;

            <ApprovedIssuers<T>>::insert(&issuer, true);

            Self::deposit_event(Event::IssuerApproved(issuer));

            Ok(().into())
        }

        // Revoke an issuer
        #[pallet::call_index(1)]
        #[pallet::weight(10_000)]
        pub fn revoke_issuer(
            origin: OriginFor<T>,
            issuer: <T::Lookup as StaticLookup>::Source,
        ) -> DispatchResultWithPostInfo {
            ensure_root(origin)?;

            let issuer = T::Lookup::lookup(issuer)?;

            <ApprovedIssuers<T>>::remove(&issuer);

            Self::deposit_event(Event::IssuerRevoked(issuer));

            Ok(().into())
        }

        // Mint a new SBT
        #[pallet::call_index(2)]
        #[pallet::weight(10_000)]
        pub fn mint_sbt(
            origin: OriginFor<T>,
            recipient: <T::Lookup as StaticLookup>::Source,
            name: Vec<u8>,
            metadata: Vec<u8>,
        ) -> DispatchResultWithPostInfo {
            let issuer = ensure_signed(origin)?;

            // Check if the caller is an approved issuer
            ensure!(<ApprovedIssuers<T>>::get(&issuer), Error::<T>::NotApprovedIssuer);

            let recipient = T::Lookup::lookup(recipient)?;

            // Validate metadata length
            ensure!(
                metadata.len() as u32 <= T::MaxMetadataLength::get(),
                Error::<T>::MetadataTooLong
            );

            let bounded_name: BoundedVec<u8, ConstU32<64>> = name
                .try_into()
                .map_err(|_| Error::<T>::MetadataTooLong)?;

            let bounded_metadata: BoundedVec<u8, ConstU32<1024>> = metadata
                .try_into()
                .map_err(|_| Error::<T>::MetadataTooLong)?;

            let sbt_id = Self::get_next_sbt_id();

            let current_block = <frame_system::Pallet<T>>::block_number();

            let sbt_info = SbtInfo {
                owner: recipient.clone(),
                issuer: issuer.clone(),
                issued_at: current_block,
                name: bounded_name,
                metadata: bounded_metadata,
            };

            <Sbts<T>>::insert(sbt_id, sbt_info);

            // Add to owner's SBTs
            <SbtsByOwner<T>>::try_mutate(&recipient, |sbt_ids| {
                sbt_ids.try_push(sbt_id)
            }).map_err(|_| Error::<T>::NoPermission)?;

            Self::deposit_event(Event::SbtMinted(sbt_id, recipient, issuer));

            Ok(().into())
        }
    }

    impl<T: Config> Pallet<T> {
        // Get the next SBT ID
        pub fn get_next_sbt_id() -> T::SbtId {
            let id = <NextSbtId<T>>::get();
            let next_id = id.checked_add(&1.into()).unwrap_or_default();
            <NextSbtId<T>>::put(next_id);
            id
        }
    }
}

// Add JSON-RPC endpoint for querying SBTs
#[cfg(feature = "runtime-apis")]
pub mod api {
    use super::*;
    use sp_api::decl_runtime_apis;

    decl_runtime_apis! {
        pub trait SbtApi<AccountId, SbtId, BlockNumber> {
            fn get_sbt(id: SbtId) -> Option<SbtInfo<AccountId, BlockNumber>>;
            fn get_sbts_by_owner(owner: AccountId) -> Vec<SbtId>;
        }
    }
} 