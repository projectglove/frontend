"use client";

import ConnectWallet from "./connect-wallet";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-black dark">
      <div className="flex flex-col items-center justify-center bg-background p-8 rounded-lg shadow-md sm:px-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white"><span className="pr-1">🧤</span>Welcome to Glove</h1>
          <p className="text-lg text-gray-400 leading-tight">
            Glove is an open-source confidential voting solution for Kusama OpenGov.
          </p>
        </div>
        <ConnectWallet id="hero-connect-accounts" />
      </div>
    </div>
  );
}
