"use client"
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { celoAlfajores } from "viem/chains";
import { useReadContract } from "wagmi";
import {
  erc20Abi,
  formatEther,
  parseEther,
  createWalletClient,
  custom,
  stringToHex,
  createPublicClient,
  http,
} from "viem";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import Davatar from "@davatar/react";
import { useRouter } from "next/router";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";
import { useScroll, useTransform } from "framer-motion";
import React from "react";
import { Button, MovingBorder } from "@/components/ui/moving-border";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { PathFinderLoader } from "@/components/ui/PathFinderLoader";

const publicClient = createPublicClient({
  chain: celoAlfajores,
  transport: http(),
});

const cUSDTokenAddressTestnet = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

export default function Home() {
  const router = useRouter();
  const { token } = router.query;
  const { connect } = useConnect();
  const { address, isConnected } = useAccount();
  const [hideConnectBtn, setHideConnectBtn] = useState(false);
  const [senderAddress, setSenderAddress] = useState("");
  const [senderName, setSenderName] = useState("");
  const [sentAsset, setSentAsset] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [userAddress, setUserAddress] = useState<`0x${string}` | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [tx, setTx] = useState<string>(""); // Transaction hash
  const [message, setMessage] = useState<string>(""); // Message state

  // Set up client-only state initialization
  useEffect(() => {
    setIsClient(true);
    if (isClient) {
      setSenderAddress(localStorage.getItem("senderAddress") || "");
      setSenderName(localStorage.getItem("senderName") || "");
      setSentAsset(localStorage.getItem("sentAsset") || "");
    }
  }, [isClient]);

  useEffect(() => {
    if (token && isClient) { // Ensure this runs only on client
      const fetchData = async () => {
        try {
          const url = `http://localhost:8080/api/getStringInfo/${token}`;
          const res = await fetch(url);
          const data = await res.json();
          if (data.stringInfo) {
            setSenderName(data.stringInfo.name);
            setSenderAddress(data.stringInfo.fromAddress);
            setSentAsset(data.stringInfo.sentAssets);
            localStorage.setItem("senderName", data.stringInfo.name);
            localStorage.setItem("senderAddress", data.stringInfo.fromAddress);
            localStorage.setItem("sentAsset", data.stringInfo.sentAssets);
          }
          else
            if (data.message == "Token doesn't exist") {
              setMessage(data.message);
            }
        } catch (error) {
          console.error("Failed to fetch string info:", error);
        }
      };
      fetchData();
    }
  }, [token, isClient]);

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMiniPay && isClient) {
      connect({ connector: injected() });
    }
  }, [connect, isClient]);

  useEffect(() => {
    if (isConnected && address && isClient) {
      localStorage.setItem("userAddress", address);
      setUserAddress(address);
    }
  }, [address, isConnected, isClient]);

  const clearLocalStorage = () => {
    localStorage.removeItem("senderName");
    localStorage.removeItem("senderAddress");
    localStorage.removeItem("sentAsset");
  };

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMiniPay) {
      setHideConnectBtn(true);
      connect({ connector: injected({ target: "metaMask" }) });
    }
  }, []);

  const handleSubmit = async () => {
    if (token && address && isClient) {
      setLoading(true); // Start loading
      try {
        const url = `http://localhost:8080/api/getString/${token}/${address}`;
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);
        if (data.transactionHash) {
          setTx(data.transactionHash);
          setLoading(false); // Stop loading
          clearLocalStorage();
        }
      } catch (error) {
        console.error("Failed to claim funds:", error);
      }
    }
  };

  if (!senderName || !senderAddress || !sentAsset) {
    return (
      <>
        {message ? (
          <div className="w-full flex flex-col h-screen items-center text-center justify-center py-12 px-4 lg:px-0">
            <div className="w-full max-w-lg mx-auto">
              <div>
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 50 50"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  xmlSpace="preserve"
                  style={{
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    strokeLinejoin: "round",
                    strokeMiterlimit: 2,
                  }}
                  className="w-20 h-20 mx-auto mb-6"
                >
                  <g transform="matrix(0.239703,0,0,0.239703,-26.037,-126.482)">
                    <g transform="matrix(288,0,0,288,328.533,730.956)" />
                    <text
                      x="95.917px"
                      y="730.956px"
                      style={{
                        fontFamily: "'Yarndings12-Regular', 'Yarndings 12'",
                        fontSize: 288,
                      }}
                    >
                      {"a"}
                    </text>
                  </g>
                </svg>
              </div>
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                This Lingofi String link is no longer valid.
              </h1>
              <p className="leading-7 text-md font-semibold [&:not(:first-child)]:mt-6">
                Unfortunately, the link you have attempted to access has either been used or expired due to inactivity. For security reasons, each link is designed for a single use only and has a limited validity period.
              </p>
            </div>
          </div>
        ) : (
          <PathFinderLoader />
        )}
      </>
    );
  }

  if (message) {
    return (
      <div className="w-full flex flex-col h-screen items-center text-center justify-center py-12 px-4 lg:px-0">
        <div className="w-full max-w-lg mx-auto">
          <div>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 50 50"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              xmlSpace="preserve"
              style={{
                fillRule: "evenodd",
                clipRule: "evenodd",
                strokeLinejoin: "round",
                strokeMiterlimit: 2,
              }}
              className="w-20 h-20 mx-auto mb-6"
            >
              <g transform="matrix(0.239703,0,0,0.239703,-26.037,-126.482)">
                <g transform="matrix(288,0,0,288,328.533,730.956)" />
                <text
                  x="95.917px"
                  y="730.956px"
                  style={{
                    fontFamily: "'Yarndings12-Regular', 'Yarndings 12'",
                    fontSize: 288,
                  }}
                >
                  {"a"}
                </text>
              </g>
            </svg>
          </div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {message}
          </h1>
        </div>
      </div>
    );
  }

  if (tx) {
    return (
      <div className="w-full flex flex-col h-screen items-center text-center justify-center py-12 px-4 lg:px-0">
        <div className="w-full max-w-lg mx-auto">
          <div>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 50 50"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              xmlSpace="preserve"
              style={{
                fillRule: "evenodd",
                clipRule: "evenodd",
                strokeLinejoin: "round",
                strokeMiterlimit: 2,
              }}
              className="w-20 h-20 mx-auto mb-6"
            >
              <g transform="matrix(0.239703,0,0,0.239703,-26.037,-126.482)">
                <g transform="matrix(288,0,0,288,328.533,730.956)" />
                <text
                  x="95.917px"
                  y="730.956px"
                  style={{
                    fontFamily: "'Yarndings12-Regular', 'Yarndings 12'",
                    fontSize: 288,
                  }}
                >
                  {"a"}
                </text>
              </g>
            </svg>
          </div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Funds successfully claimed!
          </h1>
          <p className="leading-7 text-md font-semibold [&:not(:first-child)]:mt-6">
            You have successfully claimed your funds. You can view the transaction details by clicking the button below.
          </p>
          <div className="flex flex-row items-center justify-center mb-10 w-full mt-10">
            <Button
              onClick={() => window.open(`${tx}`, "_blank")}
              borderRadius="1.75rem"
              className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
            >
              View Transaction
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <div>
          <PathFinderLoader />
        </div>
      ) : (
        <div className="w-full flex flex-col h-screen items-center text-center justify-center py-12 px-4 lg:px-0">
          <div className="w-full max-w-lg mx-auto">
            <div>
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 50 50"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                xmlSpace="preserve"
                style={{
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                  strokeLinejoin: "round",
                  strokeMiterlimit: 2,
                }}
                className="w-20 h-20 mx-auto mb-6"
              >
                <g transform="matrix(0.239703,0,0,0.239703,-26.037,-126.482)">
                  <g transform="matrix(288,0,0,288,328.533,730.956)" />
                  <text
                    x="95.917px"
                    y="730.956px"
                    style={{
                      fontFamily: "'Yarndings12-Regular', 'Yarndings 12'",
                      fontSize: 288,
                    }}
                  >
                    {"a"}
                  </text>
                </g>
              </svg>
            </div>
            {senderAddress ? (
              <>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  Claim your Lingofi String!
                </h1>
                <p className="leading-7 text-md font-semibold [&:not(:first-child)]:mt-6">
                  You&apos;ve received a cryptocurrency transfer of <span className="uppercase">{sentAsset}</span> from <span className="font-bold">{senderName}</span>! To securely access and claim your funds, please choose your preferred method to proceed with claiming your funds.
                </p>
              </>
            ) : (
              <>
              </>
            )}
            {isConnected ? (
              <>
                {userAddress && (
                  <>
                    <div className="flex flex-row items-center justify-center mb-10 w-full mt-10">
                      <AnimatedTooltip items={
                        [
                          {
                            id: 1,
                            name: senderName,
                            designation: "Sender",
                            address: senderAddress,
                          },
                          {
                            id: 2,
                            name: "You",
                            designation: "Recipient",
                            address: userAddress,
                          },
                        ]
                      } />
                    </div>
                    <div className="flex flex-row items-center justify-center mb-10 w-full mt-10">
                      <Button
                        onClick={handleSubmit}
                        borderRadius="1.75rem"
                        className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                      >
                        Claim Funds
                      </Button>
                    </div>
                  </>)}
              </>
            ) : (
              <div>
                <p className="text-lg font-bold mt-5">1. Connect a Wallet</p>
                <p className="text-md font-semibold">
                  Link your preferred cryptocurrency wallet to securely withdraw your funds.
                </p>
                <div className="flex flex-row items-center justify-center mb-5 w-full mt-3">
                  {!hideConnectBtn && (
                    <ConnectButton />
                  )}
                </div>
                <p className="text-lg font-bold mt-5">2. Use MiniPay</p>
                <p className="text-md font-semibold">
                  Alternatively, you can withdraw directly through MiniPay for a fast and user-friendly experience.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
