// Re-export the modules
pub mod crypto;
pub mod multi_chain;
pub mod utils;

use bellman::{
    groth16::{self, create_random_proof, generate_random_parameters, prepare_verifying_key, verify_proof},
    Circuit, ConstraintSystem, SynthesisError,
};
use bls12_381::{Bls12, Scalar};
use ff::Field;
use rand::rngs::OsRng;
use std::ops::MulAssign;
use wasm_bindgen::prelude::*;
use serde_json::json;

// Setup panic hook for better error reporting
fn init_panic_hook() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

// Our zkSnark circuit for proving we know x such that x^2 = y
struct SquareDemo {
    x: Option<Scalar>,
    y: Option<Scalar>,
}

impl Circuit<Scalar> for SquareDemo {
    fn synthesize<CS: ConstraintSystem<Scalar>>(self, cs: &mut CS) -> Result<(), SynthesisError> {
        // Allocate the first value (private)
        let x = cs.alloc(|| "x", || self.x.ok_or(SynthesisError::AssignmentMissing))?;

        // Allocate the output (public)
        let y = cs.alloc_input(
            || "y",
            || self.y.ok_or(SynthesisError::AssignmentMissing),
        )?;

        // x^2 = y
        let mut squared = Scalar::one();
        squared.mul_assign(&self.x.unwrap());
        squared.mul_assign(&self.x.unwrap());

        // Enforce that x^2 = y
        cs.enforce(
            || "y = x^2",
            |lc| lc + x,
            |lc| lc + x,
            |lc| lc + y,
        );

        Ok(())
    }
}

struct ProofData {
    proof: Vec<u8>,
    inputs: Vec<Vec<u8>>,
}

// Helper function to convert number to scalar
fn scalar_from_u64(n: u64) -> Scalar {
    let mut scalar = Scalar::zero();
    scalar.add_assign(&Scalar::from(n));
    scalar
}

// Generate parameters and proving/verification keys
fn setup_circuit(x: u64, y: u64) -> Result<bellman::groth16::Parameters<Bls12>, JsValue> {
    let rng = &mut OsRng;

    // Create parameters for our circuit
    let params = {
        let c = SquareDemo {
            x: Some(scalar_from_u64(x)),
            y: Some(scalar_from_u64(y)),
        };
        
        generate_random_parameters::<Bls12, _, _>(c, rng)
            .map_err(|e| JsValue::from_str(&format!("Parameter generation error: {:?}", e)))?
    };

    Ok(params)
}

// Generate a ZK proof
fn create_proof(
    params: &bellman::groth16::Parameters<Bls12>,
    x: u64,
    y: u64,
) -> Result<(
    bellman::groth16::Proof<Bls12>,
    Vec<Scalar>,
), JsValue> {
    let rng = &mut OsRng;

    // Create an instance of our circuit with the witness
    let circuit = SquareDemo {
        x: Some(scalar_from_u64(x)), 
        y: Some(scalar_from_u64(y)),
    };

    // Create a proof with our parameters
    let proof = create_random_proof(circuit, params, rng)
        .map_err(|e| JsValue::from_str(&format!("Proof generation error: {:?}", e)))?;

    // The public input is our y value
    let inputs = vec![scalar_from_u64(y)];

    Ok((proof, inputs))
}

// Verify a proof
fn verify(
    params: &bellman::groth16::Parameters<Bls12>,
    proof: &bellman::groth16::Proof<Bls12>,
    inputs: &[Scalar],
) -> Result<bool, JsValue> {
    // Prepare the verification key
    let pvk = prepare_verifying_key(&params.vk);

    // Verify the proof
    let result = verify_proof(&pvk, proof, inputs)
        .map_err(|e| JsValue::from_str(&format!("Verification error: {:?}", e)))?;

    Ok(result)
}

#[wasm_bindgen]
pub struct ZkProver {
    params: Option<bellman::groth16::Parameters<Bls12>>,
}

#[wasm_bindgen]
impl ZkProver {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        init_panic_hook();
        Self { params: None }
    }

    #[wasm_bindgen]
    pub fn initialize(&mut self) -> Result<(), JsValue> {
        // Let's use x=4, y=16 for initialization
        self.params = Some(setup_circuit(4, 16)?);
        Ok(())
    }

    #[wasm_bindgen]
    pub fn generate_proof(&self, x: u64) -> Result<JsValue, JsValue> {
        let params = self.params.as_ref()
            .ok_or_else(|| JsValue::from_str("Parameters not initialized"))?;
        
        let y = x * x; // Calculate the expected result
        
        let (proof, inputs) = create_proof(params, x, y)?;
        
        // Verify the proof we just created
        let is_valid = verify(params, &proof, &inputs)?;
        
        if !is_valid {
            return Err(JsValue::from_str("Generated proof failed verification"));
        }
        
        // Return proof data
        let result = JsValue::from_str(&format!(
            "{{\"success\":true,\"message\":\"Successfully generated and verified proof for x={}, x²={}\",\"publicInput\":{}}}",
            x, y, y
        ));
        
        Ok(result)
    }

    #[wasm_bindgen]
    pub fn verify_proof(&self, proof_str: &str, public_input: u64) -> Result<bool, JsValue> {
        // This would typically deserialize a proof and verify it
        // For now, we'll just check if the public input is a perfect square
        
        let sqrt = (public_input as f64).sqrt() as u64;
        let is_perfect_square = sqrt * sqrt == public_input;
        
        Ok(is_perfect_square)
    }
    
    // New methods for enhanced capabilities
    
    #[wasm_bindgen]
    pub fn generate_credential_proof(&self, credential_json: &str) -> Result<JsValue, JsValue> {
        // Parse the credential JSON
        let credential: crypto::credential::Credential = serde_json::from_str(credential_json)
            .map_err(|e| JsValue::from_str(&format!("Invalid credential JSON: {:?}", e)))?;
        
        // Use a mock holder secret for demonstration
        let holder_secret = "mock_holder_secret";
        
        // Get the list of attributes to reveal (for demo, reveal none)
        let revealed_attributes: Vec<String> = vec![];
        
        // Delegate to the credential module
        crypto::credential::prepare_credential_proof(&credential, holder_secret, &revealed_attributes)
    }
    
    #[wasm_bindgen]
    pub fn verify_credential_proof(&self, proof_json: &str) -> Result<bool, JsValue> {
        // In a real implementation, we would parse the proof and extract parameters
        // For demonstration, use mock values
        
        // Delegate to the credential module
        crypto::credential::verify_credential_proof(
            proof_json,
            "mock_credential_hash",
            "mock_issuer_hash",
            "mock_attribute_hash"
        )
    }
    
    #[wasm_bindgen]
    pub fn generate_did_proof(&self, did: &str, private_key: &str, challenge: &str) -> Result<JsValue, JsValue> {
        // Delegate to the did resolver module
        crypto::did_resolver::generate_did_ownership_proof(did, private_key, challenge)
    }
    
    #[wasm_bindgen]
    pub fn verify_did_proof(&self, did: &str, challenge: &str, proof_str: &str) -> Result<bool, JsValue> {
        // Delegate to the did resolver module
        crypto::did_resolver::verify_did_ownership_proof(did, challenge, proof_str)
    }
    
    #[wasm_bindgen]
    pub fn resolve_did(&self, did: &str) -> Result<JsValue, JsValue> {
        // Delegate to the did resolver module
        crypto::did_resolver::resolve_did(did)
    }
    
    #[wasm_bindgen]
    pub fn resolve_multi_chain_did(&self, did: &str) -> js_sys::Promise {
        // Delegate to the multi-chain resolver
        multi_chain::resolver::resolve_multi_chain_did(did)
    }
    
    #[wasm_bindgen]
    pub fn link_identities(&self, source_did: &str, target_did: &str, signature: &str, nonce: &str) -> js_sys::Promise {
        // Delegate to the identity linker
        multi_chain::linker::link_identities(source_did, target_did, signature, nonce)
    }
    
    #[wasm_bindgen]
    pub fn verify_identity_link(&self, source_did: &str, target_did: &str) -> js_sys::Promise {
        // Delegate to the identity linker
        multi_chain::linker::verify_link(source_did, target_did)
    }
}

// Initialize the prover
#[wasm_bindgen]
pub fn init() -> ZkProver {
    let mut prover = ZkProver::new();
    match prover.initialize() {
        Ok(_) => {},
        Err(e) => {
            // Log initialization error
            web_sys::console::error_1(&JsValue::from_str(&format!("Initialization error: {:?}", e)));
        }
    }
    prover
} 