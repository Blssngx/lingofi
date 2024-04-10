"use client"
import Image from "next/image";
import { celo, celoAlfajores } from "viem/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected } from "wagmi/connectors";
import { useConnect, useAccount } from "wagmi";
import { use, useEffect, useState} from "react";

export default function Home() {
  const [userAddress, setUserAddress] = useState("");
  const { address, isConnected } = useAccount();
  const [tx, setTx] = useState<any>(undefined);
  const { connect } = useConnect();
  const queryClient = new QueryClient();

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMiniPay) {
      connect({ connector: injected({ target: "metaMask" }) });
    }
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [address, isConnected]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>{userAddress}</p>
    </main>
  );
}
