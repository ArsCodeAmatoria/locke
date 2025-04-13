use crate::utils::get_error_message;
use bellman::{
    groth16::{self, create_random_proof, generate_random_parameters, prepare_verifying_key, verify_proof},
    Circuit, ConstraintSystem, SynthesisError,
};
use bls12_381::{Bls12, Scalar};
use ff::Field;
use rand::rngs::OsRng;
use serde::{Deserialize, Serialize};
use std::ops::MulAssign;
use wasm_bindgen::prelude::*;

/// Types of supported zero-knowledge proofs
#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum ProofType {
    /// Simple testing ZKP (x^2 = y)
    SquareRoot,
    /// Membership proof (element belongs to a set)
    SetMembership,
    /// DID ownership proof
    DIDOwnership,
    /// Credential verification without revealing attributes
    CredentialVerification,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ProofResult {
    pub success: bool,
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub proof: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub public_inputs: Option<Vec<String>>,
}

impl ProofResult {
    pub fn success(message: &str, proof: Option<String>, public_inputs: Option<Vec<String>>) -> Self {
        Self {
            success: true,
            message: message.to_string(),
            proof,
            public_inputs,
        }
    }

    pub fn error(message: &str) -> Self {
        Self {
            success: false,
            message: message.to_string(),
            proof: None,
            public_inputs: None,
        }
    }
}

// Our basic zkSnark circuit for proving we know x such that x^2 = y
pub struct SquareDemo {
    pub x: Option<Scalar>,
    pub y: Option<Scalar>,
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

// Helper function to convert number to scalar
pub fn scalar_from_u64(n: u64) -> Scalar {
    let mut scalar = Scalar::zero();
    scalar.add_assign(&Scalar::from(n));
    scalar
}

// Generate parameters and proving/verification keys for the SquareDemo circuit
pub fn setup_square_circuit(x: u64, y: u64) -> Result<bellman::groth16::Parameters<Bls12>, JsValue> {
    let rng = &mut OsRng;

    // Create parameters for our circuit
    let params = {
        let c = SquareDemo {
            x: Some(scalar_from_u64(x)),
            y: Some(scalar_from_u64(y)),
        };
        
        generate_random_parameters::<Bls12, _, _>(c, rng)
            .map_err(|e| JsValue::from_str(&get_error_message("Parameter generation error", &e)))?
    };

    Ok(params)
}

// Generate a ZK proof for the SquareDemo circuit
pub fn create_square_proof(
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
        .map_err(|e| JsValue::from_str(&get_error_message("Proof generation error", &e)))?;

    // The public input is our y value
    let inputs = vec![scalar_from_u64(y)];

    Ok((proof, inputs))
}

// Verify a proof for the SquareDemo circuit
pub fn verify_square_proof(
    params: &bellman::groth16::Parameters<Bls12>,
    proof: &bellman::groth16::Proof<Bls12>,
    inputs: &[Scalar],
) -> Result<bool, JsValue> {
    // Prepare the verification key
    let pvk = prepare_verifying_key(&params.vk);

    // Verify the proof
    let result = verify_proof(&pvk, proof, inputs)
        .map_err(|e| JsValue::from_str(&get_error_message("Verification error", &e)))?;

    Ok(result)
} 