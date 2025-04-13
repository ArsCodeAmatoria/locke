//! The Substrate runtime for zkID Login.

// Standard includes
#![cfg_attr(not(feature = "std"), no_std)]

// Substrate Runtime Module Library
pub use frame_support::{
    construct_runtime, parameter_types,
    traits::{ConstU128, ConstU32, ConstU64, ConstU8, KeyOwnerProofSystem},
    weights::{
        constants::{BlockExecutionWeight, ExtrinsicBaseWeight, RocksDbWeight, WEIGHT_REF_TIME_PER_SECOND},
        IdentityFee, Weight,
    },
    StorageValue,
};
pub use frame_system::Call as SystemCall;
pub use pallet_balances::Call as BalancesCall;
pub use pallet_timestamp::Call as TimestampCall;
pub use sp_api::impl_runtime_apis;
pub use sp_runtime::{
    create_runtime_str, generic, impl_opaque_keys,
    traits::{AccountIdLookup, BlakeTwo256, Block as BlockT, NumberFor},
    transaction_validity::{TransactionSource, TransactionValidity},
    ApplyExtrinsicResult,
};
pub use sp_std::prelude::*;
pub use sp_version::RuntimeVersion;

// Import pallets
pub use pallet_did;
pub use pallet_sbt;

// Define the runtime version.
pub const VERSION: RuntimeVersion = RuntimeVersion {
    spec_name: create_runtime_str!("zkid-login"),
    impl_name: create_runtime_str!("zkid-login"),
    authoring_version: 1,
    spec_version: 1,
    impl_version: 1,
    apis: RUNTIME_API_VERSIONS,
    transaction_version: 1,
    state_version: 1,
};

// Opaque types for handling blocks and extrinsics
pub mod opaque {
    pub use sp_runtime::OpaqueExtrinsic as UncheckedExtrinsic;
    pub use sp_runtime::generic::UncheckedExtrinsic as UncheckedExtrinsicOf;
    pub use sp_runtime::traits::BlakeTwo256;
    pub use sp_runtime::traits::Hash as HashT;
}

// Base constants and types
impl_opaque_keys! {
    pub struct SessionKeys {}
}

pub type BlockNumber = u32;
pub type Signature = sp_runtime::MultiSignature;
pub type AccountId = sp_runtime::AccountId32;
pub type Balance = u128;
pub type SbtId = u32;
pub type Index = u32;
pub type Hash = sp_core::H256;
pub type Hashing = BlakeTwo256;

pub type Block = generic::Block<Header, UncheckedExtrinsic>;
pub type Header = generic::Header<BlockNumber, BlakeTwo256>;
pub type UncheckedExtrinsic = generic::UncheckedExtrinsic<u32, RuntimeCall, Signature, ()>;

// Runtime Configuration
parameter_types! {
    pub const BlockHashCount: BlockNumber = 2400;
    pub const Version: RuntimeVersion = VERSION;
    pub const DbWeight: RuntimeDbWeight = RuntimeDbWeight {
        read: 25,
        write: 100,
    };
    pub const MaxMetadataLength: u32 = 4096;
}

// Configure the FRAME System pallet
impl frame_system::Config for Runtime {
    type BaseCallFilter = frame_support::traits::Everything;
    type BlockWeights = ();
    type BlockLength = ();
    type DbWeight = RocksDbWeight;
    type RuntimeOrigin = RuntimeOrigin;
    type RuntimeCall = RuntimeCall;
    type Index = Index;
    type BlockNumber = BlockNumber;
    type Hash = Hash;
    type Hashing = Hashing;
    type AccountId = AccountId;
    type Lookup = AccountIdLookup<AccountId, ()>;
    type Header = Header;
    type RuntimeEvent = RuntimeEvent;
    type BlockHashCount = BlockHashCount;
    type Version = Version;
    type PalletInfo = PalletInfo;
    type AccountData = pallet_balances::AccountData<Balance>;
    type OnNewAccount = ();
    type OnKilledAccount = ();
    type SystemWeightInfo = ();
    type SS58Prefix = ConstU16<42>;
    type OnSetCode = ();
    type MaxConsumers = ConstU32<16>;
}

// Configure the Balances pallet
impl pallet_balances::Config for Runtime {
    type Balance = Balance;
    type DustRemoval = ();
    type RuntimeEvent = RuntimeEvent;
    type ExistentialDeposit = ConstU128<500>;
    type AccountStore = System;
    type WeightInfo = pallet_balances::weights::SubstrateWeight<Runtime>;
    type MaxLocks = ConstU32<50>;
    type MaxReserves = ();
    type ReserveIdentifier = [u8; 8];
    type HoldIdentifier = ();
    type FreezeIdentifier = ();
    type MaxHolds = ConstU32<0>;
    type MaxFreezes = ConstU32<0>;
}

// Configure the Timestamp pallet
impl pallet_timestamp::Config for Runtime {
    type Moment = u64;
    type OnTimestampSet = ();
    type MinimumPeriod = ConstU64<5000>;
    type WeightInfo = ();
}

// Configure our DID pallet
impl pallet_did::Config for Runtime {
    type RuntimeEvent = RuntimeEvent;
    type Currency = Balances;
}

// Configure our SBT pallet
impl pallet_sbt::Config for Runtime {
    type RuntimeEvent = RuntimeEvent;
    type Currency = Balances;
    type SbtId = SbtId;
    type MaxMetadataLength = MaxMetadataLength;
}

// Create the runtime by composing the pallets
construct_runtime!(
    pub struct Runtime
    where
        Block = Block,
        NodeBlock = Block,
        UncheckedExtrinsic = UncheckedExtrinsic,
    {
        System: frame_system = 0,
        Timestamp: pallet_timestamp = 1,
        Balances: pallet_balances = 2,
        Did: pallet_did = 3,
        Sbt: pallet_sbt = 4,
    }
);

// Implement runtime API endpoints
impl_runtime_apis! {
    impl sp_api::Core<Block> for Runtime {
        fn version() -> RuntimeVersion {
            VERSION
        }

        fn execute_block(block: Block) {
            Executive::execute_block(block)
        }

        fn initialize_block(header: &<Block as BlockT>::Header) {
            Executive::initialize_block(header)
        }
    }

    impl sp_api::Metadata<Block> for Runtime {
        fn metadata() -> OpaqueMetadata {
            OpaqueMetadata::new(Runtime::metadata().into())
        }
    }

    impl sp_block_builder::BlockBuilder<Block> for Runtime {
        fn apply_extrinsic(extrinsic: <Block as BlockT>::Extrinsic) -> ApplyExtrinsicResult {
            Executive::apply_extrinsic(extrinsic)
        }

        fn finalize_block() -> <Block as BlockT>::Header {
            Executive::finalize_block()
        }

        fn inherent_extrinsics(data: sp_inherents::InherentData) -> Vec<<Block as BlockT>::Extrinsic> {
            data.create_extrinsics()
        }

        fn check_inherents(
            block: Block,
            data: sp_inherents::InherentData,
        ) -> sp_inherents::CheckInherentsResult {
            data.check_extrinsics(&block)
        }
    }

    impl sp_transaction_pool::runtime_api::TaggedTransactionQueue<Block> for Runtime {
        fn validate_transaction(
            source: TransactionSource,
            tx: <Block as BlockT>::Extrinsic,
            block_hash: <Block as BlockT>::Hash,
        ) -> TransactionValidity {
            Executive::validate_transaction(source, tx, block_hash)
        }
    }

    // Add the DID API
    impl pallet_did::api::DidApi<Block, AccountId, BlockNumber> for Runtime {
        fn get_did(account: AccountId) -> Option<pallet_did::Did<AccountId, BlockNumber>> {
            Did::dids(&account)
        }
    }

    // Add the SBT API
    impl pallet_sbt::api::SbtApi<Block, AccountId, SbtId, BlockNumber> for Runtime {
        fn get_sbt(id: SbtId) -> Option<pallet_sbt::SbtInfo<AccountId, BlockNumber>> {
            Sbt::sbts(id)
        }

        fn get_sbts_by_owner(owner: AccountId) -> Vec<SbtId> {
            Sbt::sbts_by_owner(&owner).to_vec()
        }
    }
} 