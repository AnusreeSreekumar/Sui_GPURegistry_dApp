import { useState } from "react";
import { useWalletKit } from "@mysten/wallet-kit";
import { JsonRpcProvider, TransactionBlock } from "@mysten/sui.js";

const provider = new JsonRpcProvider();

export default function RegisterGPU() {
  const { currentAccount, signAndExecuteTransactionBlock } = useWalletKit();

  const [showForm, setShowForm] = useState(false);
  const [model, setModel] = useState("");
  const [computeCapability, setComputeCapability] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function registerGPU() {
    if (!currentAccount) {
      alert("Please connect your wallet first");
      return;
    }

    if (!model || !computeCapability) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    setMessage("");

    const modelBytes = new TextEncoder().encode(model);
    const computeBytes = new TextEncoder().encode(computeCapability);

    const tx = new TransactionBlock();
    tx.moveCall({
      target: "0xYOUR_MODULE_ADDRESS::gpu_registry::register_gpu",
      arguments: [
        tx.pure(modelBytes),
        tx.pure(computeBytes),
      ],
    });

    try {
      const result = await signAndExecuteTransactionBlock({
        transactionBlock: tx,
        account: currentAccount.address,
      });
      setMessage("GPU registered successfully!");
      setModel("");
      setComputeCapability("");
      setShowForm(false);
      console.log("Transaction Result:", result);
    } catch (error) {
      console.error("Error registering GPU:", error);
      setMessage("Failed to register GPU.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {!showForm ? (
        <div
          onClick={() => setShowForm(true)}
          className="cursor-pointer p-6 bg-white rounded shadow-md w-full max-w-md text-center hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-bold mb-2">Register GPU</h2>
          <p className="text-gray-600">Click here to add a new GPU</p>
        </div>
      ) : (
        <div className="bg-white rounded shadow-md p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">New GPU Registration</h2>

          <label className="block mb-2 font-semibold">Model</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
            placeholder="GPU Model"
            disabled={loading}
          />

          <label className="block mb-2 font-semibold">Compute Capability</label>
          <input
            type="text"
            value={computeCapability}
            onChange={(e) => setComputeCapability(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
            placeholder="Compute Capability"
            disabled={loading}
          />

          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              onClick={registerGPU}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register GPU"}
            </button>
          </div>

          {message && (
            <p className="mt-4 text-center font-medium text-green-600">{message}</p>
          )}
        </div>
      )}
    </div>
  );
}
