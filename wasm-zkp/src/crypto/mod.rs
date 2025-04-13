pub mod did_resolver;
pub mod credential;
pub mod zk_proofs;

// Re-export main types and functions
pub use did_resolver::{
    DIDDocument,
    VerificationMethod,
    Service,
    DIDOwnershipCircuit,
    parse_did,
    generate_did_ownership_proof,
    verify_did_ownership_proof,
    resolve_did
};

pub use credential::{
    CredentialType,
    CredentialAttribute,
    Credential,
    CredentialCircuit,
    prepare_credential_proof,
    verify_credential_proof
};

pub use zk_proofs::{
    ProofType,
    ProofResult,
    SquareDemo,
    scalar_from_u64,
    setup_square_circuit,
    create_square_proof,
    verify_square_proof
}; 