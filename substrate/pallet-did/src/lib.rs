#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
    use frame_support::{dispatch::DispatchResult, pallet_prelude::*};
    use frame_system::pallet_prelude::*;
    use sp_std::prelude::*;

    #[pallet::pallet]
    #[pallet::generate_store(pub(super) trait Store)]
    pub struct Pallet<T>(_);

    /// Configuration trait for this pallet.
    #[pallet::config]
    pub trait Config: frame_system::Config {
        /// The overarching event type.
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
        
        /// Maximum length of a DID string
        #[pallet::constant]
        type MaxDidLength: Get<u32>;
    }

    /// Storage for DIDs associated with account IDs
    #[pallet::storage]
    #[pallet::getter(fn identities)]
    pub type Identities<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        T::AccountId,
        BoundedVec<u8, T::MaxDidLength>,
        OptionQuery,
    >;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        /// A DID was registered for an account 
        /// [account, did]
        DidRegistered(T::AccountId, BoundedVec<u8, T::MaxDidLength>),
        
        /// A DID was updated for an account
        /// [account, did]
        DidUpdated(T::AccountId, BoundedVec<u8, T::MaxDidLength>),
        
        /// A DID was removed
        /// [account]
        DidRemoved(T::AccountId),
    }

    #[pallet::error]
    pub enum Error<T> {
        /// DID already exists for this account
        DidAlreadyExists,
        /// DID is too long
        DidTooLong,
        /// DID does not exist
        DidNotFound,
        /// Not authorized to modify this DID
        NotAuthorized,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        /// Register a new DID for the caller's account
        #[pallet::call_index(0)]
        #[pallet::weight(10_000)]
        pub fn register_did(origin: OriginFor<T>, did: Vec<u8>) -> DispatchResult {
            let who = ensure_signed(origin)?;
            
            // Check if this account already has a DID
            ensure!(!Identities::<T>::contains_key(&who), Error::<T>::DidAlreadyExists);
            
            // Convert did to BoundedVec
            let bounded_did = BoundedVec::<u8, T::MaxDidLength>::try_from(did)
                .map_err(|_| Error::<T>::DidTooLong)?;
            
            // Store the DID
            Identities::<T>::insert(&who, bounded_did.clone());
            
            // Emit event
            Self::deposit_event(Event::DidRegistered(who, bounded_did));
            
            Ok(())
        }
        
        /// Update an existing DID
        #[pallet::call_index(1)]
        #[pallet::weight(10_000)]
        pub fn update_did(origin: OriginFor<T>, new_did: Vec<u8>) -> DispatchResult {
            let who = ensure_signed(origin)?;
            
            // Check if this account has a DID
            ensure!(Identities::<T>::contains_key(&who), Error::<T>::DidNotFound);
            
            // Convert new did to BoundedVec
            let bounded_did = BoundedVec::<u8, T::MaxDidLength>::try_from(new_did)
                .map_err(|_| Error::<T>::DidTooLong)?;
            
            // Update the DID
            Identities::<T>::insert(&who, bounded_did.clone());
            
            // Emit event
            Self::deposit_event(Event::DidUpdated(who, bounded_did));
            
            Ok(())
        }
        
        /// Remove a DID
        #[pallet::call_index(2)]
        #[pallet::weight(10_000)]
        pub fn remove_did(origin: OriginFor<T>) -> DispatchResult {
            let who = ensure_signed(origin)?;
            
            // Check if this account has a DID
            ensure!(Identities::<T>::contains_key(&who), Error::<T>::DidNotFound);
            
            // Remove the DID
            Identities::<T>::remove(&who);
            
            // Emit event
            Self::deposit_event(Event::DidRemoved(who));
            
            Ok(())
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate as pallet_did;
    use frame_support::{assert_noop, assert_ok, parameter_types};
    use sp_core::H256;
    use sp_runtime::{
        traits::{BlakeTwo256, IdentityLookup},
        BuildStorage,
    };

    type Block = frame_system::mocking::MockBlock<Test>;

    // Configure a mock runtime to test the pallet
    frame_support::construct_runtime!(
        pub enum Test
        {
            System: frame_system,
            PalletDid: pallet_did,
        }
    );

    parameter_types! {
        pub const BlockHashCount: u64 = 250;
        pub const SS58Prefix: u8 = 42;
    }

    impl frame_system::Config for Test {
        type BaseCallFilter = frame_support::traits::Everything;
        type BlockWeights = ();
        type BlockLength = ();
        type DbWeight = ();
        type RuntimeOrigin = RuntimeOrigin;
        type RuntimeCall = RuntimeCall;
        type Nonce = u64;
        type Hash = H256;
        type Hashing = BlakeTwo256;
        type AccountId = u64;
        type Lookup = IdentityLookup<Self::AccountId>;
        type Block = Block;
        type RuntimeEvent = RuntimeEvent;
        type BlockHashCount = BlockHashCount;
        type Version = ();
        type PalletInfo = PalletInfo;
        type AccountData = ();
        type OnNewAccount = ();
        type OnKilledAccount = ();
        type SystemWeightInfo = ();
        type SS58Prefix = SS58Prefix;
        type OnSetCode = ();
        type MaxConsumers = frame_support::traits::ConstU32<16>;
    }

    parameter_types! {
        pub const MaxDidLength: u32 = 100;
    }

    impl Config for Test {
        type RuntimeEvent = RuntimeEvent;
        type MaxDidLength = MaxDidLength;
    }

    // Build genesis storage according to the mock runtime
    pub fn new_test_ext() -> sp_io::TestExternalities {
        let t = frame_system::GenesisConfig::<Test>::default()
            .build_storage()
            .unwrap();
        
        let mut ext = sp_io::TestExternalities::new(t);
        ext.execute_with(|| System::set_block_number(1));
        ext
    }

    #[test]
    fn register_did_works() {
        new_test_ext().execute_with(|| {
            let account_id = 1;
            let did = b"did:substrate:0x12345".to_vec();
            
            // Register a DID
            assert_ok!(PalletDid::register_did(RuntimeOrigin::signed(account_id), did.clone()));
            
            // Check storage
            let stored_did = PalletDid::identities(account_id).unwrap();
            assert_eq!(stored_did.to_vec(), did);
            
            // Try to register again for the same account
            assert_noop!(
                PalletDid::register_did(RuntimeOrigin::signed(account_id), b"did:substrate:0xABCDE".to_vec()),
                Error::<Test>::DidAlreadyExists
            );
        });
    }

    #[test]
    fn update_did_works() {
        new_test_ext().execute_with(|| {
            let account_id = 1;
            let did = b"did:substrate:0x12345".to_vec();
            let new_did = b"did:substrate:0xABCDE".to_vec();
            
            // Register a DID
            assert_ok!(PalletDid::register_did(RuntimeOrigin::signed(account_id), did.clone()));
            
            // Update the DID
            assert_ok!(PalletDid::update_did(RuntimeOrigin::signed(account_id), new_did.clone()));
            
            // Check storage
            let stored_did = PalletDid::identities(account_id).unwrap();
            assert_eq!(stored_did.to_vec(), new_did);
        });
    }

    #[test]
    fn remove_did_works() {
        new_test_ext().execute_with(|| {
            let account_id = 1;
            let did = b"did:substrate:0x12345".to_vec();
            
            // Register a DID
            assert_ok!(PalletDid::register_did(RuntimeOrigin::signed(account_id), did.clone()));
            
            // Remove the DID
            assert_ok!(PalletDid::remove_did(RuntimeOrigin::signed(account_id)));
            
            // Check storage
            assert!(PalletDid::identities(account_id).is_none());
        });
    }
} 