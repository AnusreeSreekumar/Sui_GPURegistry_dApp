module 0x0::model_execution {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::TxContext;
    use sui::event;
    use std::string;

    /// Struct representing a model execution
    public struct ModelExecution has key, store {
        id: UID,
        model_hash: string::String,
        gpu_id: ID,
        status: string::String,
        executor: address,
        input_size: u64,
        output_size: u64,
    }

    /// Event emitted when a model execution is created
    public struct ExecutionCreated has copy, drop {
        execution_id: ID,
        model_hash: string::String,
        gpu_id: ID,
        executor: address,
    }

    /// Event emitted when a model execution is completed
    public struct ExecutionCompleted has copy, drop {
        execution_id: ID,
        status: string::String,
    }

    /// Create a new model execution
    public entry fun create_execution(
        model_hash: string::String,
        gpu_id: ID,
        input_size: u64,
        output_size: u64,
        ctx: &mut TxContext
    ) {
        let uid = object::new(ctx);
        let executor = tx_context::sender(ctx);

        let execution = ModelExecution {
            id: uid,
            model_hash: model_hash,
            gpu_id,
            status: string::utf8(b"pending"),
            executor,
            input_size,
            output_size,
        };

        event::emit(ExecutionCreated {
            execution_id: object::id(&execution),
            model_hash: execution.model_hash,
            gpu_id: execution.gpu_id,
            executor: execution.executor,
        });

        transfer::share_object(execution);
    }

    /// Update the status of a model execution
    public entry fun update_execution_status(
        execution: &mut ModelExecution,
        status: string::String,
        _ctx: &mut TxContext
    ) {
        execution.status = status;

        event::emit(ExecutionCompleted {
            execution_id: object::id(execution),
            status: execution.status,
        });
    }
}