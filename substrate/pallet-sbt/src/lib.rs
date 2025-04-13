#![cfg_attr(not(feature = "std"), no_std)]

pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
    use frame_support::{dispatch::DispatchResult, pallet_prelude::*};
    use frame_system::pallet_prelude::*;
    use pallet_did::{self, Config as DidConfig};
    use sp_std::prelude::*;

    #[pallet::pallet]
    #[pallet::generate_store(pub(super) trait Store)]
    pub struct Pallet<T>(_);

    /// Configuration trait for this pallet.
    #[pallet::config]
    pub trait Config: frame_system::Config + pallet_did::Config {
        /// The overarching event type.
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
        
        /// Maximum size of credential metadata
        #[pallet::constant]
        type MaxCredentialSize: Get<u32>;
    }

    /// Type for credential ID
    pub type CredentialId = u64;

    /// Structure for storing credential metadata
    #[derive(Clone, Encode, Decode, Eq, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
    pub struct Credential<T: Config> {
        /// ID of the credential
        pub id: CredentialId,
        /// Account that issued the credential
        pub issuer: T::AccountId,
        /// Account that owns the credential (subject)
        pub owner: T::AccountId,
        /// Credential type (e.g., "KycCredential", "AgeCredential", etc.)
        pub credential_type: BoundedVec<u8, T::MaxCredentialSize>,
        /// Metadata stored as serialized JSON or similar format
        pub metadata: BoundedVec<u8, T::MaxCredentialSize>,
        /// When the credential was issued
        pub issued_at: BlockNumberFor<T>,
        /// Whether the credential has been revoked
        pub revoked: bool,
    }

    /// Counter for credential IDs
    #[pallet::storage]
    #[pallet::getter(fn next_credential_id)]
    pub type NextCredentialId<T: Config> = StorageValue<_, CredentialId, ValueQuery>;

    /// Storage mapping from account ID to credential IDs they own
    #[pallet::storage]
    #[pallet::getter(fn credentials_by_owner)]
    pub type CredentialsByOwner<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        T::AccountId,
        BoundedVec<CredentialId, T::MaxCredentialSize>,
        ValueQuery,
    >;

    /// Storage mapping from credential ID to credential data
    #[pallet::storage]
    #[pallet::getter(fn credential_details)]
    pub type CredentialDetails<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        CredentialId,
        Credential<T>,
        OptionQuery,
    >;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        /// A new credential was issued
        /// [credential_id, issuer, owner]
        CredentialIssued(CredentialId, T::AccountId, T::AccountId),
        
        /// A credential was revoked
        /// [credential_id, issuer]
        CredentialRevoked(CredentialId, T::AccountId),
    }

    #[pallet::error]
    pub enum Error<T> {
        /// Owner must have a DID first
        OwnerDidNotFound,
        /// Credential data is too large
        CredentialTooLarge,
        /// Credential not found
        CredentialNotFound,
        /// Not authorized to modify this credential
        NotAuthorized,
        /// Owner already has too many credentials
        TooManyCredentials,
        /// Credential already revoked
        AlreadyRevoked,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        /// Issue a new SBT credential to an account
        #[pallet::call_index(0)]
        #[pallet::weight(10_000)]
        pub fn issue_credential(
            origin: OriginFor<T>, 
            owner: T::AccountId,
            credential_type: Vec<u8>,
            metadata: Vec<u8>,
        ) -> DispatchResult {
            let issuer = ensure_signed(origin)?;
            
            // Ensure owner has a DID
            ensure!(<pallet_did::Pallet<T>>::identities(&owner).is_some(), Error::<T>::OwnerDidNotFound);
            
            // Convert type and metadata to BoundedVec
            let bounded_type = BoundedVec::<u8, T::MaxCredentialSize>::try_from(credential_type)
                .map_err(|_| Error::<T>::CredentialTooLarge)?;
                
            let bounded_metadata = BoundedVec::<u8, T::MaxCredentialSize>::try_from(metadata)
                .map_err(|_| Error::<T>::CredentialTooLarge)?;
            
            // Get the next credential ID
            let credential_id = Self::next_credential_id();
            
            // Create the credential
            let credential = Credential {
                id: credential_id,
                issuer: issuer.clone(),
                owner: owner.clone(),
                credential_type: bounded_type,
                metadata: bounded_metadata,
                issued_at: <frame_system::Pallet<T>>::block_number(),
                revoked: false,
            };
            
            // Store the credential
            CredentialDetails::<T>::insert(credential_id, credential);
            
            // Update the owner's credentials list
            CredentialsByOwner::<T>::try_mutate(&owner, |credentials| {
                credentials.try_push(credential_id).map_err(|_| Error::<T>::TooManyCredentials)
            })?;
            
            // Increment the next credential ID
            NextCredentialId::<T>::put(credential_id.saturating_add(1));
            
            // Emit event
            Self::deposit_event(Event::CredentialIssued(credential_id, issuer, owner));
            
            Ok(())
        }
        
        /// Revoke a credential
        #[pallet::call_index(1)]
        #[pallet::weight(10_000)]
        pub fn revoke_credential(
            origin: OriginFor<T>,
            credential_id: CredentialId,
        ) -> DispatchResult {
            let issuer = ensure_signed(origin)?;
            
            // Ensure credential exists
            let mut credential = CredentialDetails::<T>::get(credential_id)
                .ok_or(Error::<T>::CredentialNotFound)?;
            
            // Ensure caller is the issuer
            ensure!(credential.issuer == issuer, Error::<T>::NotAuthorized);
            
            // Ensure credential is not already revoked
            ensure!(!credential.revoked, Error::<T>::AlreadyRevoked);
            
            // Mark as revoked
            credential.revoked = true;
            CredentialDetails::<T>::insert(credential_id, credential);
            
            // Emit event
            Self::deposit_event(Event::CredentialRevoked(credential_id, issuer));
            
            Ok(())
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate as pallet_sbt;
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
            PalletSbt: pallet_sbt,
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

    impl pallet_did::Config for Test {
        type RuntimeEvent = RuntimeEvent;
        type MaxDidLength = MaxDidLength;
    }

    parameter_types! {
        pub const MaxCredentialSize: u32 = 1000;
    }

    impl Config for Test {
        type RuntimeEvent = RuntimeEvent;
        type MaxCredentialSize = MaxCredentialSize;
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
    fn issue_credential_works() {
        new_test_ext().execute_with(|| {
            let issuer = 1;
            let owner = 2;
            let did = b"did:substrate:0x12345".to_vec();
            
            // First, register a DID for the owner
            assert_ok!(PalletDid::register_did(RuntimeOrigin::signed(owner), did));
            
            // Now issue a credential
            assert_ok!(PalletSbt::issue_credential(
                RuntimeOrigin::signed(issuer),
                owner,
                b"KycCredential".to_vec(),
                b"{\"age\":\"over18\",\"country\":\"US\"}".to_vec(),
            ));
            
            // Check storage
            let credential_id = 0; // First credential
            let credential = PalletSbt::credential_details(credential_id).unwrap();
            
            assert_eq!(credential.issuer, issuer);
            assert_eq!(credential.owner, owner);
            assert_eq!(credential.credential_type.to_vec(), b"KycCredential".to_vec());
            assert_eq!(credential.revoked, false);
            
            // Check owner's credentials list
            let owner_credentials = PalletSbt::credentials_by_owner(owner);
            assert_eq!(owner_credentials.len(), 1);
            assert_eq!(owner_credentials[0], credential_id);
        });
    }

    #[test]
    fn revoke_credential_works() {
        new_test_ext().execute_with(|| {
            let issuer = 1;
            let owner = 2;
            let did = b"did:substrate:0x12345".to_vec();
            
            // First, register a DID for the owner
            assert_ok!(PalletDid::register_did(RuntimeOrigin::signed(owner), did));
            
            // Issue a credential
            assert_ok!(PalletSbt::issue_credential(
                RuntimeOrigin::signed(issuer),
                owner,
                b"KycCredential".to_vec(),
                b"{\"age\":\"over18\",\"country\":\"US\"}".to_vec(),
            ));
            
            // Revoke the credential
            let credential_id = 0;
            assert_ok!(PalletSbt::revoke_credential(
                RuntimeOrigin::signed(issuer),
                credential_id,
            ));
            
            // Check that the credential is now revoked
            let credential = PalletSbt::credential_details(credential_id).unwrap();
            assert_eq!(credential.revoked, true);
            
            // Try to revoke again (should fail)
            assert_noop!(
                PalletSbt::revoke_credential(RuntimeOrigin::signed(issuer), credential_id),
                Error::<Test>::AlreadyRevoked
            );
        });
    }

    #[test]
    fn requires_did_first() {
        new_test_ext().execute_with(|| {
            let issuer = 1;
            let owner = 2;
            
            // Try to issue a credential without a DID (should fail)
            assert_noop!(
                PalletSbt::issue_credential(
                    RuntimeOrigin::signed(issuer),
                    owner,
                    b"KycCredential".to_vec(),
                    b"{\"age\":\"over18\",\"country\":\"US\"}".to_vec(),
                ),
                Error::<Test>::OwnerDidNotFound
            );
        });
    }
} 