pub mod resolver;
pub mod linker;

// Re-export main types and functions
pub use resolver::{
    ChainType,
    ChainIdentity,
    CrossChainIdentity,
    parse_multi_chain_did,
    resolve_multi_chain_did,
    search_dids_by_address,
    get_linked_identities
};

pub use linker::{
    LinkRequest,
    LinkResult,
    link_identities,
    verify_link,
    unlink_identities
}; 