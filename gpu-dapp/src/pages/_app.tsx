// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { WalletKitProvider } from "@mysten/wallet-kit";
import './index.tsx';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletKitProvider>
      <Component {...pageProps} />
    </WalletKitProvider>
  );
}
