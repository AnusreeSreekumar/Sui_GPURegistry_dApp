module 0x0::gpu_registry {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;
    use sui::event;

    /// Struct representing a GPU
    public struct GPU has key, store {
        id: UID,
        owner: address,
        model: vector<u8>,
        compute_capability: vector<u8>,
        available: bool,
    }

    /// Event emitted when a GPU is registered
    public struct GPURegistered has copy, drop {
        owner: address,
        model: vector<u8>,
        compute_capability: vector<u8>,
    }

    /// Event emitted when GPU availability is updated
    public struct GPUAvailabilityChanged has copy, drop {
        gpu_address: address,
        available: bool,
    }

    /// Register a new GPU
    public entry fun register_gpu(
        model: vector<u8>,
        compute_capability: vector<u8>,
        ctx: &mut TxContext
    ) {
        let uid = object::new(ctx);
        let owner = tx_context::sender(ctx);

        let gpu = GPU {
            id: uid,
            owner,
            model,
            compute_capability,
            available: true,
        };

        event::emit(GPURegistered {
            owner,
            model,
            compute_capability,
        });

        transfer::share_object(gpu);
    }

    /// Update the availability of a GPU
    public entry fun set_availability(
        gpu: &mut GPU,
        available: bool,
        _ctx: &mut TxContext
    ) {
        gpu.available = available;

        event::emit(GPUAvailabilityChanged {
            gpu_address: gpu.owner,
            available,
        });
    }
}