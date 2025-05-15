import { ConnectButton, useWalletKit } from "@mysten/wallet-kit";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LoginPage() {
  const wallet = useWalletKit();
  const router = useRouter();

  useEffect(() => {
    if (wallet.isConnected) {
      router.push("/dashboard");
    }
  }, [wallet.isConnected, router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to GPU Registry dApp</h1>
      <ConnectButton />
    </div>
  );
}
