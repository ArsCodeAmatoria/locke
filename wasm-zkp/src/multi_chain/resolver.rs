use crate::utils::get_error_message;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::future_to_promise;

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum ChainType {
    Substrate,
    Ethereum,
    Solana,
    Cosmos,
    Near,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ChainIdentity {
    pub chain_type: ChainType,
    pub chain_id: String,
    pub address: String,
    pub did: String,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CrossChainIdentity {
    pub id: String,
    pub controller: String,
    pub linked_dids: js_sys::Map,
    pub linked_accounts: js_sys::Map,
    pub verification_methods: js_sys::Array,
    pub services: js_sys::Array,
    pub created: String,
    pub updated: String,
}

impl CrossChainIdentity {
    pub fn new(id: String) -> Self {
        Self {
            id,
            controller: String::new(),
            linked_dids: js_sys::Map::new(),
            linked_accounts: js_sys::Map::new(),
            verification_methods: js_sys::Array::new(),
            services: js_sys::Array::new(),
            created: String::new(),
            updated: String::new(),
        }
    }
}

/// Parse a multi-chain DID string
/// Format: did:multi:<chain-type>:<chain-id>:<address>
pub fn parse_multi_chain_did(did: &str) -> Result<(String, ChainType, String, String), JsValue> {
    // Split the DID string
    let parts: Vec<&str> = did.split(':').collect();
    
    if parts.len() < 5 || parts[0] != "did" || parts[1] != "multi" {
        return Err(JsValue::from_str("Invalid multi-chain DID format"));
    }
    
    // Parse chain type
    let chain_type = match parts[2] {
        "substrate" => ChainType::Substrate,
        "ethereum" => ChainType::Ethereum,
        "solana" => ChainType::Solana,
        "cosmos" => ChainType::Cosmos,
        "near" => ChainType::Near,
        _ => return Err(JsValue::from_str(&format!("Unsupported chain type: {}", parts[2]))),
    };
    
    let chain_id = parts[3].to_string();
    let address = parts[4].to_string();
    
    Ok((did.to_string(), chain_type, chain_id, address))
}

/// Resolve a multi-chain DID to a CrossChainIdentity
#[wasm_bindgen]
pub fn resolve_multi_chain_did(did: &str) -> js_sys::Promise {
    let did_str = did.to_string();
    
    future_to_promise(async move {
        // Parse the DID
        let (did_string, chain_type, chain_id, address) = match parse_multi_chain_did(&did_str) {
            Ok(result) => result,
            Err(e) => return Err(e),
        };
        
        // In a real implementation, we would query multiple chains in parallel
        // For demo, just create a mock CrossChainIdentity
        
        let identity = CrossChainIdentity::new(did_string.clone());
        
        // Mock linked DIDs on different chains
        let linked_dids = js_sys::Map::new();
        linked_dids.set(&JsValue::from_str("substrate:1"), &JsValue::from_str("did:multi:substrate:1:5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"));
        linked_dids.set(&JsValue::from_str("ethereum:1"), &JsValue::from_str("did:multi:ethereum:1:0x123456789abcdef"));
        
        // Mock linked accounts
        let linked_accounts = js_sys::Map::new();
        let substrate_accounts = js_sys::Array::new();
        substrate_accounts.push(&JsValue::from_str("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"));
        substrate_accounts.push(&JsValue::from_str("5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"));
        linked_accounts.set(&JsValue::from_str("substrate:1"), &substrate_accounts);
        
        let ethereum_accounts = js_sys::Array::new();
        ethereum_accounts.push(&JsValue::from_str("0x123456789abcdef"));
        linked_accounts.set(&JsValue::from_str("ethereum:1"), &ethereum_accounts);
        
        // Create mock verification methods
        let verification_methods = js_sys::Array::new();
        let vm1 = js_sys::Object::new();
        js_sys::Reflect::set(&vm1, &JsValue::from_str("id"), &JsValue::from_str(&format!("{}#keys-1", did_string)))?;
        js_sys::Reflect::set(&vm1, &JsValue::from_str("type"), &JsValue::from_str("Ed25519VerificationKey2020"))?;
        js_sys::Reflect::set(&vm1, &JsValue::from_str("controller"), &JsValue::from_str(&did_string))?;
        js_sys::Reflect::set(&vm1, &JsValue::from_str("publicKeyMultibase"), &JsValue::from_str("zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"))?;
        verification_methods.push(&vm1);
        
        // Create mock services
        let services = js_sys::Array::new();
        let service1 = js_sys::Object::new();
        js_sys::Reflect::set(&service1, &JsValue::from_str("id"), &JsValue::from_str(&format!("{}#linked-domain", did_string)))?;
        js_sys::Reflect::set(&service1, &JsValue::from_str("type"), &JsValue::from_str("LinkedDomains"))?;
        js_sys::Reflect::set(&service1, &JsValue::from_str("serviceEndpoint"), &JsValue::from_str("https://example.com"))?;
        services.push(&service1);
        
        // Build the final identity object
        let result = js_sys::Object::new();
        js_sys::Reflect::set(&result, &JsValue::from_str("id"), &JsValue::from_str(&did_string))?;
        js_sys::Reflect::set(&result, &JsValue::from_str("controller"), &JsValue::from_str(&did_string))?;
        js_sys::Reflect::set(&result, &JsValue::from_str("linkedDids"), &linked_dids)?;
        js_sys::Reflect::set(&result, &JsValue::from_str("linkedAccounts"), &linked_accounts)?;
        js_sys::Reflect::set(&result, &JsValue::from_str("verificationMethods"), &verification_methods)?;
        js_sys::Reflect::set(&result, &JsValue::from_str("services"), &services)?;
        js_sys::Reflect::set(&result, &JsValue::from_str("created"), &JsValue::from_str("2023-01-01T00:00:00Z"))?;
        js_sys::Reflect::set(&result, &JsValue::from_str("updated"), &JsValue::from_str("2023-01-01T00:00:00Z"))?;
        
        Ok(result)
    })
}

/// Search for DIDs across multiple chains
#[wasm_bindgen]
pub fn search_dids_by_address(
    address: &str,
    chain_types: js_sys::Array,
) -> js_sys::Promise {
    let address_str = address.to_string();
    
    future_to_promise(async move {
        // Convert the JS array to a Vec of ChainTypes
        let mut chains = Vec::new();
        for i in 0..chain_types.length() {
            if let Some(chain_type_js) = chain_types.get(i).as_string() {
                let chain_type = match chain_type_js.as_str() {
                    "substrate" => ChainType::Substrate,
                    "ethereum" => ChainType::Ethereum,
                    "solana" => ChainType::Solana,
                    "cosmos" => ChainType::Cosmos,
                    "near" => ChainType::Near,
                    _ => continue,
                };
                chains.push(chain_type);
            }
        }
        
        // In a real implementation, we would search multiple chains in parallel
        // For demo, just create mock results
        
        let results = js_sys::Array::new();
        
        // Mock Substrate DID
        if chains.is_empty() || chains.contains(&ChainType::Substrate) {
            let substrate_did = js_sys::Object::new();
            js_sys::Reflect::set(&substrate_did, &JsValue::from_str("chainType"), &JsValue::from_str("substrate"))?;
            js_sys::Reflect::set(&substrate_did, &JsValue::from_str("chainId"), &JsValue::from_str("1"))?;
            js_sys::Reflect::set(&substrate_did, &JsValue::from_str("address"), &JsValue::from_str(&address_str))?;
            js_sys::Reflect::set(&substrate_did, &JsValue::from_str("did"), &JsValue::from_str(&format!("did:multi:substrate:1:{}", address_str)))?;
            results.push(&substrate_did);
        }
        
        // Mock Ethereum DID
        if chains.is_empty() || chains.contains(&ChainType::Ethereum) {
            let ethereum_did = js_sys::Object::new();
            js_sys::Reflect::set(&ethereum_did, &JsValue::from_str("chainType"), &JsValue::from_str("ethereum"))?;
            js_sys::Reflect::set(&ethereum_did, &JsValue::from_str("chainId"), &JsValue::from_str("1"))?;
            js_sys::Reflect::set(&ethereum_did, &JsValue::from_str("address"), &JsValue::from_str("0x123456789abcdef"))?;
            js_sys::Reflect::set(&ethereum_did, &JsValue::from_str("did"), &JsValue::from_str("did:multi:ethereum:1:0x123456789abcdef"))?;
            results.push(&ethereum_did);
        }
        
        // Return the results
        Ok(results.into())
    })
}

/// Get all linked identities for a DID
#[wasm_bindgen]
pub fn get_linked_identities(did: &str) -> js_sys::Promise {
    let did_str = did.to_string();
    
    future_to_promise(async move {
        // In a real implementation, we would resolve the DID and find all linked DIDs
        // For demo, just create mock results
        
        let results = js_sys::Array::new();
        
        // Mock Substrate DID
        let substrate_did = js_sys::Object::new();
        js_sys::Reflect::set(&substrate_did, &JsValue::from_str("chainType"), &JsValue::from_str("substrate"))?;
        js_sys::Reflect::set(&substrate_did, &JsValue::from_str("chainId"), &JsValue::from_str("1"))?;
        js_sys::Reflect::set(&substrate_did, &JsValue::from_str("address"), &JsValue::from_str("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"))?;
        js_sys::Reflect::set(&substrate_did, &JsValue::from_str("did"), &JsValue::from_str("did:multi:substrate:1:5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"))?;
        results.push(&substrate_did);
        
        // Mock Ethereum DID
        let ethereum_did = js_sys::Object::new();
        js_sys::Reflect::set(&ethereum_did, &JsValue::from_str("chainType"), &JsValue::from_str("ethereum"))?;
        js_sys::Reflect::set(&ethereum_did, &JsValue::from_str("chainId"), &JsValue::from_str("1"))?;
        js_sys::Reflect::set(&ethereum_did, &JsValue::from_str("address"), &JsValue::from_str("0x123456789abcdef"))?;
        js_sys::Reflect::set(&ethereum_did, &JsValue::from_str("did"), &JsValue::from_str("did:multi:ethereum:1:0x123456789abcdef"))?;
        results.push(&ethereum_did);
        
        // Return the results
        Ok(results.into())
    })
} 