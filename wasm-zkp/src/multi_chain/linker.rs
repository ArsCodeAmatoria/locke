use crate::{
    multi_chain::resolver::{parse_multi_chain_did, ChainType},
    utils::get_error_message,
};
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::future_to_promise;

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct LinkRequest {
    pub source_did: String,
    pub target_did: String,
    pub signature: String,
    pub nonce: String,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct LinkResult {
    pub success: bool,
    pub message: String,
    pub source_did: String,
    pub target_did: String,
    pub transaction_hash: Option<String>,
}

/// Link two DIDs across different chains
#[wasm_bindgen]
pub fn link_identities(
    source_did: &str,
    target_did: &str,
    signature: &str,
    nonce: &str,
) -> js_sys::Promise {
    let source_did_str = source_did.to_string();
    let target_did_str = target_did.to_string();
    let signature_str = signature.to_string();
    let nonce_str = nonce.to_string();
    
    future_to_promise(async move {
        // Parse the DIDs
        let (source_did_string, source_chain_type, source_chain_id, source_address) = match parse_multi_chain_did(&source_did_str) {
            Ok(result) => result,
            Err(e) => return Err(e),
        };
        
        let (target_did_string, target_chain_type, target_chain_id, target_address) = match parse_multi_chain_did(&target_did_str) {
            Ok(result) => result,
            Err(e) => return Err(e),
        };
        
        // In a real implementation, we would verify the signature and create on-chain links
        // For demo, just create a mock link result
        
        // Mock tx hash
        let tx_hash = match target_chain_type {
            ChainType::Substrate => Some("0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef".to_string()),
            ChainType::Ethereum => Some("0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890".to_string()),
            _ => None,
        };
        
        // Create the result
        let result = LinkResult {
            success: true,
            message: "DIDs linked successfully".to_string(),
            source_did: source_did_string,
            target_did: target_did_string,
            transaction_hash: tx_hash,
        };
        
        // Serialize to JS value
        let js_result = match serde_wasm_bindgen::to_value(&result) {
            Ok(val) => val,
            Err(e) => return Err(JsValue::from_str(&get_error_message("Serialization error", &e))),
        };
        
        Ok(js_result)
    })
}

/// Verify a link between two DIDs
#[wasm_bindgen]
pub fn verify_link(
    source_did: &str,
    target_did: &str,
) -> js_sys::Promise {
    let source_did_str = source_did.to_string();
    let target_did_str = target_did.to_string();
    
    future_to_promise(async move {
        // Parse the DIDs
        let (source_did_string, source_chain_type, source_chain_id, source_address) = match parse_multi_chain_did(&source_did_str) {
            Ok(result) => result,
            Err(e) => return Err(e),
        };
        
        let (target_did_string, target_chain_type, target_chain_id, target_address) = match parse_multi_chain_did(&target_did_str) {
            Ok(result) => result,
            Err(e) => return Err(e),
        };
        
        // In a real implementation, we would verify the link on-chain
        // For demo, just return a mock result
        
        // Create the result object
        let result = js_sys::Object::new();
        js_sys::Reflect::set(&result, &JsValue::from_str("verified"), &JsValue::from_bool(true))?;
        js_sys::Reflect::set(&result, &JsValue::from_str("sourceDid"), &JsValue::from_str(&source_did_string))?;
        js_sys::Reflect::set(&result, &JsValue::from_str("targetDid"), &JsValue::from_str(&target_did_string))?;
        js_sys::Reflect::set(&result, &JsValue::from_str("verifiedAt"), &JsValue::from_str("2023-01-01T00:00:00Z"))?;
        
        // Add chain-specific details
        let details = js_sys::Object::new();
        js_sys::Reflect::set(&details, &JsValue::from_str("sourceChain"), &JsValue::from_str(&format!("{:?}", source_chain_type)))?;
        js_sys::Reflect::set(&details, &JsValue::from_str("targetChain"), &JsValue::from_str(&format!("{:?}", target_chain_type)))?;
        js_sys::Reflect::set(&details, &JsValue::from_str("sourceChainId"), &JsValue::from_str(&source_chain_id))?;
        js_sys::Reflect::set(&details, &JsValue::from_str("targetChainId"), &JsValue::from_str(&target_chain_id))?;
        
        js_sys::Reflect::set(&result, &JsValue::from_str("details"), &details)?;
        
        Ok(result)
    })
}

/// Unlink two DIDs
#[wasm_bindgen]
pub fn unlink_identities(
    source_did: &str,
    target_did: &str,
    signature: &str,
) -> js_sys::Promise {
    let source_did_str = source_did.to_string();
    let target_did_str = target_did.to_string();
    let signature_str = signature.to_string();
    
    future_to_promise(async move {
        // Parse the DIDs
        let (source_did_string, _, _, _) = match parse_multi_chain_did(&source_did_str) {
            Ok(result) => result,
            Err(e) => return Err(e),
        };
        
        let (target_did_string, _, _, _) = match parse_multi_chain_did(&target_did_str) {
            Ok(result) => result,
            Err(e) => return Err(e),
        };
        
        // In a real implementation, we would verify the signature and remove on-chain links
        // For demo, just create a mock result
        
        // Create the result object
        let result = js_sys::Object::new();
        js_sys::Reflect::set(&result, &JsValue::from_str("success"), &JsValue::from_bool(true))?;
        js_sys::Reflect::set(&result, &JsValue::from_str("message"), &JsValue::from_str("DIDs unlinked successfully"))?;
        js_sys::Reflect::set(&result, &JsValue::from_str("sourceDid"), &JsValue::from_str(&source_did_string))?;
        js_sys::Reflect::set(&result, &JsValue::from_str("targetDid"), &JsValue::from_str(&target_did_string))?;
        
        Ok(result)
    })
} 