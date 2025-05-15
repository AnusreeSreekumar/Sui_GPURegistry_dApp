import { useWalletKit } from '@mysten/wallet-kit';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Dashboard() {
  const wallet = useWalletKit();
  const router = useRouter();

  useEffect(() => {
    if (!wallet.isConnected) {
      router.push('/');
    }
  }, [wallet.isConnected, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-100 text-gray-900">
      {/* Heading */}
      <header className="text-center pt-10">
        <h1 className="text-4xl font-extrabold">GPU Registry dApp</h1>
      </header>

      {/* Sign Out button */}
      <div className="absolute top-5 right-5">
        <button
          onClick={() => wallet.disconnect()}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold"
        >
          Sign Out
        </button>
      </div>

      {/* Card Content */}
      <main className="mt-20 ml-10">
        <div className="bg-white shadow-lg rounded-xl p-8 w-[400px] mt-60">
          <h2 className="text-xl font-bold mb-2">Register New GPU</h2>
          <p className="text-sm text-gray-600 mb-4">
            You can register your GPU with details like specs, availability, and price.
          </p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-md">
            Start Registration
          </button>
        </div>
      </main>
    </div>
  );
}
