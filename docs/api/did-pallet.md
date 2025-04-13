# DID Pallet API

The Decentralized Identity (DID) pallet provides on-chain identity management for the zkID Login system.

## Overview

This pallet manages the creation, updating, and deletion of decentralized identifiers (DIDs) on the Substrate blockchain. DIDs serve as the foundation for the zkID Login system, providing a persistent identity that can be linked to verifiable credentials.

## Pallet Structure

The DID pallet consists of:

- **Storage**: Maps accounts to DID records
- **Events**: Emitted when DIDs are created, updated, or deleted
- **Extrinsics**: Functions that can be called to interact with the pallet
- **Errors**: Custom error types specific to the pallet

## Storage

### DIDs

Maps an account ID to a DID record.

```rust
#[pallet::storage]
#[pallet::getter(fn dids)]
pub type Dids<T: Config> = StorageMap<_, Blake2_128Concat, T::AccountId, DidRecord<T::AccountId, T::Moment>>;
```

### DidRecord Structure

```rust
#[derive(Clone, Encode, Decode, Eq, PartialEq, RuntimeDebug, TypeInfo)]
#[scale_info(skip_type_params(T))]
pub struct DidRecord<AccountId, Moment> {
    /// The controller of this DID
    pub controller: AccountId,
    /// When this DID was created
    pub created: Moment,
    /// When this DID was last updated
    pub updated: Moment,
}
```

## Events

### DidCreated

Emitted when a new DID is created.

```rust
#[pallet::event]
#[pallet::generate_deposit(pub(super) fn deposit_event)]
pub enum Event<T: Config> {
    /// A new DID has been created
    /// [account, did_id]
    DidCreated(T::AccountId, DidId),
    // ...
}
```

### DidUpdated

Emitted when a DID is updated.

```rust
/// A DID has been updated
/// [account, did_id]
DidUpdated(T::AccountId, DidId),
```

### DidDeleted

Emitted when a DID is deleted.

```rust
/// A DID has been deleted
/// [account, did_id]
DidDeleted(T::AccountId, DidId),
```

## Extrinsics

### createDid

Creates a new DID for the caller.

```rust
pub fn create_did(origin: OriginFor<T>) -> DispatchResult {
    let who = ensure_signed(origin)?;
    
    // Ensure DID doesn't already exist
    ensure!(!Dids::<T>::contains_key(&who), Error::<T>::DidAlreadyExists);
    
    let now = <frame_system::Pallet<T>>::block_number();
    
    // Create new DID record
    let did_record = DidRecord {
        controller: who.clone(),
        created: now,
        updated: now,
    };
    
    // Store the DID
    Dids::<T>::insert(&who, did_record);
    
    // Create DID identifier
    let did_id = T::DidFormat::create_did_identifier(&who);
    
    // Emit event
    Self::deposit_event(Event::DidCreated(who, did_id));
    
    Ok(())
}
```

**Parameters**:
- `origin`: The transaction origin (must be signed)

**Returns**: `DispatchResult` indicating success or failure

### updateDid

Updates the controller of a DID.

```rust
pub fn update_did(
    origin: OriginFor<T>,
    new_controller: T::AccountId
) -> DispatchResult {
    let who = ensure_signed(origin)?;
    
    // Ensure DID exists
    ensure!(Dids::<T>::contains_key(&who), Error::<T>::DidNotFound);
    
    // Get current DID record
    let mut did_record = Dids::<T>::get(&who).unwrap();
    
    // Update controller and timestamp
    did_record.controller = new_controller;
    did_record.updated = <frame_system::Pallet<T>>::block_number();
    
    // Update storage
    Dids::<T>::insert(&who, did_record);
    
    // Get DID identifier
    let did_id = T::DidFormat::create_did_identifier(&who);
    
    // Emit event
    Self::deposit_event(Event::DidUpdated(who, did_id));
    
    Ok(())
}
```

**Parameters**:
- `origin`: The transaction origin (must be signed)
- `new_controller`: The new controller account for the DID

**Returns**: `DispatchResult` indicating success or failure

### deleteDid

Deletes a DID.

```rust
pub fn delete_did(origin: OriginFor<T>) -> DispatchResult {
    let who = ensure_signed(origin)?;
    
    // Ensure DID exists
    ensure!(Dids::<T>::contains_key(&who), Error::<T>::DidNotFound);
    
    // Get DID identifier before removal
    let did_id = T::DidFormat::create_did_identifier(&who);
    
    // Remove DID
    Dids::<T>::remove(&who);
    
    // Emit event
    Self::deposit_event(Event::DidDeleted(who, did_id));
    
    Ok(())
}
```

**Parameters**:
- `origin`: The transaction origin (must be signed)

**Returns**: `DispatchResult` indicating success or failure

## Errors

```rust
#[pallet::error]
pub enum Error<T> {
    /// DID already exists for this account
    DidAlreadyExists,
    /// DID not found
    DidNotFound,
    /// DID maximum length exceeded
    DidMaxLengthExceeded,
}
```

## Configuration

The DID pallet can be configured with the following traits:

```rust
#[pallet::config]
pub trait Config: frame_system::Config {
    /// The overarching event type
    type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
    
    /// Maximum length of a DID identifier
    #[pallet::constant]
    type MaxDidLength: Get<u32>;
    
    /// Format for DID identifiers (default is "did:substrate:{account}")
    type DidFormat: DidIdentifierFormat<Self::AccountId>;
}
```

## Integration Example

### Runtime Configuration

Add the DID pallet to your runtime:

```rust
parameter_types! {
    pub const MaxDidLength: u32 = 100;
}

impl pallet_did::Config for Runtime {
    type RuntimeEvent = RuntimeEvent;
    type MaxDidLength = MaxDidLength;
}

// Add to construct_runtime macro
construct_runtime!(
    pub enum Runtime
    {
        System: frame_system,
        Did: pallet_did,
        // other pallets...
    }
);
```

### JavaScript/TypeScript API

Using the Polkadot.js API to interact with the DID pallet:

```typescript
// Create a DID
const createDid = async (api, account) => {
  const tx = api.tx.did.createDid();
  return new Promise((resolve, reject) => {
    tx.signAndSend(account, ({ status, events, dispatchError }) => {
      if (dispatchError) {
        reject(dispatchError.toString());
      }
      
      if (status.isFinalized) {
        for (const { event } of events) {
          if (api.events.did.DidCreated.is(event)) {
            const [accountId, didId] = event.data;
            resolve({ accountId: accountId.toString(), didId: didId.toString() });
            return;
          }
        }
        resolve(null);
      }
    });
  });
};

// Query a DID
const getDid = async (api, accountId) => {
  const didRecord = await api.query.did.dids(accountId);
  if (didRecord.isEmpty) return null;
  
  const { controller, created, updated } = didRecord.unwrap();
  return {
    controller: controller.toString(),
    created: created.toString(),
    updated: updated.toString(),
  };
};
```

## Best Practices

When working with the DID pallet:

1. **Always check existence**: Verify that a DID exists before attempting to update it
2. **Handle errors gracefully**: Implement proper error handling for all pallet extrinsics
3. **Keep DIDs minimal**: Only store essential information on-chain
4. **Use events**: Listen for pallet events to track DID status changes
5. **Integrate with SBTs**: Link DIDs with Soul-Bound Tokens for a complete identity solution

## Related Resources

- [SBT Pallet Documentation](sbt-pallet.md)
- [ZK Proof Integration](zk-proof.md)
- [DID Format Specifications](../guides/did-format.md) 