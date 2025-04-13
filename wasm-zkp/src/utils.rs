use sha2::{Digest, Sha256};
use std::fmt::Debug;
use wasm_bindgen::prelude::*;

/// Formats an error message for JavaScript consumption
pub fn get_error_message<T: Debug>(prefix: &str, error: &T) -> String {
    format!("{}: {:?}", prefix, error)
}

/// Computes a SHA-256 hash of a string
pub fn hash_string(input: &str) -> Vec<u8> {
    let mut hasher = Sha256::new();
    hasher.update(input.as_bytes());
    hasher.finalize().to_vec()
}

/// Compute a hash and return as hex string
#[wasm_bindgen]
pub fn hash_to_hex(input: &str) -> String {
    let hash = hash_string(input);
    hex::encode(hash)
}

/// Generate a cryptographically secure random string
#[wasm_bindgen]
pub fn generate_random_nonce() -> String {
    // Generate 32 random bytes
    let mut bytes = [0u8; 32];
    getrandom::getrandom(&mut bytes).expect("Failed to generate random bytes");
    
    // Convert to hex
    hex::encode(bytes)
}

/// Convert bytes to a base64 string
#[wasm_bindgen]
pub fn bytes_to_base64(bytes: &[u8]) -> String {
    base64::encode(bytes)
}

/// Convert a base64 string to bytes
#[wasm_bindgen]
pub fn base64_to_bytes(base64_str: &str) -> Result<Vec<u8>, JsValue> {
    base64::decode(base64_str)
        .map_err(|e| JsValue::from_str(&get_error_message("Base64 decoding error", &e)))
}

/// Convert bytes to a hex string
#[wasm_bindgen]
pub fn bytes_to_hex(bytes: &[u8]) -> String {
    hex::encode(bytes)
}

/// Convert a hex string to bytes
#[wasm_bindgen]
pub fn hex_to_bytes(hex_str: &str) -> Result<Vec<u8>, JsValue> {
    hex::decode(hex_str)
        .map_err(|e| JsValue::from_str(&get_error_message("Hex decoding error", &e)))
}

/// Parse a serialized JSON string to a JsValue
#[wasm_bindgen]
pub fn parse_json(json_str: &str) -> Result<JsValue, JsValue> {
    let parsed: serde_json::Value = serde_json::from_str(json_str)
        .map_err(|e| JsValue::from_str(&get_error_message("JSON parsing error", &e)))?;
    
    serde_wasm_bindgen::to_value(&parsed)
        .map_err(|e| JsValue::from_str(&get_error_message("JSON conversion error", &e)))
}

/// Serialize a JsValue to a JSON string
#[wasm_bindgen]
pub fn serialize_to_json(value: &JsValue) -> Result<String, JsValue> {
    let parsed: serde_json::Value = serde_wasm_bindgen::from_value(value.clone())
        .map_err(|e| JsValue::from_str(&get_error_message("JS value conversion error", &e)))?;
    
    serde_json::to_string(&parsed)
        .map_err(|e| JsValue::from_str(&get_error_message("JSON serialization error", &e)))
} 