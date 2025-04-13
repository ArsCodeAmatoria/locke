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
pub enum CredentialType {
    Identity,
    Kyc,
    Membership,
    Professional,
    Education,
    Custom,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CredentialAttribute {
    pub name: String,
    pub value: String,
    pub reveal: bool,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Credential {
    pub id: String,
    pub issuer: String,
    pub subject: String,
    pub type_: CredentialType,
    pub attributes: Vec<CredentialAttribute>,
    pub issued_at: String,
    pub expires_at: Option<String>,
    pub revoked: bool,
}

/// Circuit for proving credential attributes
pub struct CredentialCircuit {
    // Credential holder secret (private)
    pub holder_secret: Option<Scalar>,
    
    // Credential public parameters
    pub credential_hash: Option<Scalar>,
    pub issuer_hash: Option<Scalar>,
    
    // Selected attributes to reveal
    pub selected_attributes: Vec<(String, Option<Scalar>)>,
    
    // Attribute hash (public input)
    pub attribute_hash: Option<Scalar>,
}

impl Circuit<Scalar> for CredentialCircuit {
    fn synthesize<CS: ConstraintSystem<Scalar>>(self, cs: &mut CS) -> Result<(), SynthesisError> {
        // Allocate the holder secret (private)
        let holder_secret = cs.alloc(
            || "holder_secret",
            || self.holder_secret.ok_or(SynthesisError::AssignmentMissing),
        )?;

        // Allocate credential hash (public)
        let credential_hash = cs.alloc_input(
            || "credential_hash",
            || self.credential_hash.ok_or(SynthesisError::AssignmentMissing),
        )?;
        
        // Allocate issuer hash (public)
        let issuer_hash = cs.alloc_input(
            || "issuer_hash",
            || self.issuer_hash.ok_or(SynthesisError::AssignmentMissing),
        )?;
        
        // Allocate attribute hash (public)
        let attribute_hash = cs.alloc_input(
            || "attribute_hash",
            || self.attribute_hash.ok_or(SynthesisError::AssignmentMissing),
        )?;
        
        // Enforce constraints for credential verification
        // This is simplified for demonstration - in reality we would need more complex constraints
        
        // Example constraint: credential must be signed by issuer
        cs.enforce(
            || "issuer signature verification",
            |lc| lc + credential_hash,
            |lc| lc + issuer_hash,
            |lc| lc + attribute_hash,
        );
        
        // Additional constraints would go here in a real implementation
        
        Ok(())
    }
}

/// Prepare a credential for zero-knowledge proof
pub fn prepare_credential_proof(
    credential: &Credential,
    holder_secret_str: &str,
    revealed_attributes: &[String],
) -> Result<JsValue, JsValue> {
    // Hash the holder secret to a scalar
    let holder_secret = hash_to_scalar(holder_secret_str);
    
    // Hash the credential ID
    let credential_hash = hash_to_scalar(&credential.id);
    
    // Hash the issuer
    let issuer_hash = hash_to_scalar(&credential.issuer);
    
    // Create attribute vector and compute hash of selected attributes
    let mut selected_attributes = Vec::new();
    let mut attribute_hash_input = String::new();
    
    for attr_name in revealed_attributes {
        if let Some(attr) = credential.attributes.iter().find(|a| &a.name == attr_name) {
            let attr_value_hash = hash_to_scalar(&attr.value);
            selected_attributes.push((attr.name.clone(), Some(attr_value_hash)));
            attribute_hash_input.push_str(&format!("{}:{},", attr.name, attr.value));
        } else {
            return Err(JsValue::from_str(&format!("Attribute not found: {}", attr_name)));
        }
    }
    
    // Hash the attribute string
    let attribute_hash = hash_to_scalar(&attribute_hash_input);
    
    // Create the circuit
    let circuit = CredentialCircuit {
        holder_secret: Some(holder_secret),
        credential_hash: Some(credential_hash),
        issuer_hash: Some(issuer_hash),
        selected_attributes,
        attribute_hash: Some(attribute_hash),
    };
    
    // In a real implementation, we would generate a proof here
    // For now, just return a mock result
    let result = serde_wasm_bindgen::to_value(&serde_json::json!({
        "success": true,
        "message": "Credential proof prepared successfully",
        "credentialHash": credential_hash.to_string(),
        "issuerHash": issuer_hash.to_string(),
        "attributeHash": attribute_hash.to_string(),
    })).map_err(|e| JsValue::from_str(&get_error_message("Serialization error", &e)))?;
    
    Ok(result)
}

/// Verify a credential proof
pub fn verify_credential_proof(
    proof_str: &str,
    credential_hash_str: &str,
    issuer_hash_str: &str,
    attribute_hash_str: &str,
) -> Result<bool, JsValue> {
    // In a real implementation, we would verify the proof here
    // For now, just return a mock result
    
    // Mock verification logic - always succeeds in this demo
    // In a real implementation, we would deserialize the proof and verify it
    
    Ok(true)
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