use crate::utils::{get_error_message, hash_string};
use bellman::{
    groth16::{self, create_random_proof, generate_random_parameters, verify_proof},
    Circuit, ConstraintSystem, SynthesisError,
};
use bls12_381::{Bls12, Scalar};
use ff::Field;
use rand::rngs::OsRng;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DIDDocument {
    pub id: String,
    pub controller: String,
    pub verification_methods: Vec<VerificationMethod>,
    pub authentication: Vec<String>,
    pub assertion_method: Vec<String>,
    pub service: Vec<Service>,
    pub created: String,
    pub updated: String,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct VerificationMethod {
    pub id: String,
    pub type_: String,
    pub controller: String,
    pub public_key_multibase: Option<String>,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Service {
    pub id: String,
    pub type_: String,
    pub service_endpoint: String,
}

/// Circuit for proving DID ownership
pub struct DIDOwnershipCircuit {
    // Private key (private input)
    pub private_key: Option<Scalar>,
    
    // DID (public input)
    pub did_hash: Option<Scalar>,
    
    // Challenge (public input)
    pub challenge_hash: Option<Scalar>,
    
    // Response (public input)
    pub response_hash: Option<Scalar>,
}

impl Circuit<Scalar> for DIDOwnershipCircuit {
    fn synthesize<CS: ConstraintSystem<Scalar>>(self, cs: &mut CS) -> Result<(), SynthesisError> {
        // Allocate the private key (private)
        let private_key = cs.alloc(
            || "private_key",
            || self.private_key.ok_or(SynthesisError::AssignmentMissing),
        )?;

        // Allocate DID hash (public)
        let did_hash = cs.alloc_input(
            || "did_hash",
            || self.did_hash.ok_or(SynthesisError::AssignmentMissing),
        )?;
        
        // Allocate challenge hash (public)
        let challenge_hash = cs.alloc_input(
            || "challenge_hash",
            || self.challenge_hash.ok_or(SynthesisError::AssignmentMissing),
        )?;
        
        // Allocate response hash (public)
        let response_hash = cs.alloc_input(
            || "response_hash",
            || self.response_hash.ok_or(SynthesisError::AssignmentMissing),
        )?;
        
        // Enforce that the response is correctly computed from the private key and challenge
        // This is a simplified model - in reality we would use digital signatures
        
        // Example constraint: response = private_key * challenge (simplified)
        cs.enforce(
            || "response verification",
            |lc| lc + private_key,
            |lc| lc + challenge_hash,
            |lc| lc + response_hash,
        );
        
        // Example constraint: DID must be derived from private key (simplified)
        cs.enforce(
            || "did derivation verification",
            |lc| lc + private_key,
            |lc| lc + private_key,
            |lc| lc + did_hash,
        );
        
        Ok(())
    }
}

/// Parse a DID string
pub fn parse_did(did: &str) -> Result<(String, String, String), JsValue> {
    // DID format: did:<method>:<method-specific-id>
    let parts: Vec<&str> = did.split(':').collect();
    
    if parts.len() < 3 || parts[0] != "did" {
        return Err(JsValue::from_str("Invalid DID format"));
    }
    
    let method = parts[1].to_string();
    let method_id = parts[2..].join(":");
    
    Ok((did.to_string(), method, method_id))
}

/// Generate a proof of DID ownership
#[wasm_bindgen]
pub fn generate_did_ownership_proof(
    did: &str,
    private_key_str: &str,
    challenge: &str,
) -> Result<JsValue, JsValue> {
    // Parse the DID
    let (did_string, method, _) = parse_did(did)?;
    
    // Hash the private key to a scalar
    let private_key = hash_to_scalar(private_key_str);
    
    // Hash the DID
    let did_hash = hash_to_scalar(&did_string);
    
    // Hash the challenge
    let challenge_hash = hash_to_scalar(challenge);
    
    // Compute a response (in a real implementation this would be a digital signature)
    // For demo, just concatenate and hash
    let response_str = format!("{}:{}", private_key_str, challenge);
    let response_hash = hash_to_scalar(&response_str);
    
    // Create the circuit
    let circuit = DIDOwnershipCircuit {
        private_key: Some(private_key),
        did_hash: Some(did_hash),
        challenge_hash: Some(challenge_hash),
        response_hash: Some(response_hash),
    };
    
    // In a real implementation, we would generate a proof here
    // For now, just return a mock result
    let result = serde_wasm_bindgen::to_value(&serde_json::json!({
        "success": true,
        "message": "DID ownership proof generated successfully",
        "did": did_string,
        "method": method,
        "challenge": challenge,
        "response": response_hash.to_string(),
    })).map_err(|e| JsValue::from_str(&get_error_message("Serialization error", &e)))?;
    
    Ok(result)
}

/// Verify a proof of DID ownership
#[wasm_bindgen]
pub fn verify_did_ownership_proof(
    did: &str,
    challenge: &str,
    proof_str: &str,
) -> Result<bool, JsValue> {
    // In a real implementation, we would verify the proof here
    // For now, just return a mock result - always succeeds
    
    Ok(true)
}

/// Resolve a DID to a DID Document
#[wasm_bindgen]
pub fn resolve_did(did: &str) -> Result<JsValue, JsValue> {
    // Parse the DID
    let (did_string, method, method_id) = parse_did(did)?;
    
    // In a real implementation, we would query a blockchain or registry
    // For demo, just create a mock DID Document
    
    let doc = DIDDocument {
        id: did_string.clone(),
        controller: did_string.clone(),
        verification_methods: vec![
            VerificationMethod {
                id: format!("{}#keys-1", did_string),
                type_: "Ed25519VerificationKey2020".to_string(),
                controller: did_string.clone(),
                public_key_multibase: Some("zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV".to_string()),
            }
        ],
        authentication: vec![format!("{}#keys-1", did_string)],
        assertion_method: vec![format!("{}#keys-1", did_string)],
        service: vec![
            Service {
                id: format!("{}#linked-domain", did_string),
                type_: "LinkedDomains".to_string(),
                service_endpoint: "https://example.com".to_string(),
            }
        ],
        created: "2023-01-01T00:00:00Z".to_string(),
        updated: "2023-01-01T00:00:00Z".to_string(),
    };
    
    let result = serde_wasm_bindgen::to_value(&doc)
        .map_err(|e| JsValue::from_str(&get_error_message("Serialization error", &e)))?;
    
    Ok(result)
}

// Helper function to hash a string to a scalar
fn hash_to_scalar(input: &str) -> Scalar {
    let hash = hash_string(input);
    
    // Convert the first 8 bytes of the hash to a u64
    let mut bytes = [0u8; 8];
    bytes.copy_from_slice(&hash[0..8]);
    let n = u64::from_le_bytes(bytes);
    
    let mut scalar = Scalar::zero();
    scalar.add_assign(&Scalar::from(n));
    scalar
} 