"use client";

import QRScanner from "@/components/QRScanner";
import { verifyTicket } from "@/app/actions/verifyTicket";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";

export default function AdminScanPage() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [result, setResult] = useState<any>(null);

  const handleScan = async (token: string) => {
    if (status === "loading" || status === "success") return;

    setStatus("loading");

    // Call Server Action
    const response = await verifyTicket(token);

    if (response.success) {
      setStatus("success");
      setResult(response);
    } else {
      setStatus("error");
      setResult(response);
    }
  };

  const resetScanner = () => {
    setStatus("idle");
    setResult(null);
    window.location.reload(); // Reloading is the cleanest way to restart the html5-qrcode camera
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link href="/account" className="text-gray-400 hover:text-white mr-4">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold">Ticket Scanner</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
        {/* State 1: Scanning */}
        {status === "idle" && (
          <div className="w-full">
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6">
              <QRScanner onScanSuccess={handleScan} />
            </div>
            <p className="text-center text-gray-500 text-sm">
              Point camera at attendee's QR code
            </p>
          </div>
        )}

        {/* State 2: Loading */}
        {status === "loading" && (
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-blue-400 font-medium">Verifying Ticket...</p>
          </div>
        )}

        {/* State 3: Success */}
        {status === "success" && (
          <div className="bg-green-600 w-full p-8 rounded-2xl text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="bg-white text-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-2">ACCESS GRANTED</h2>
            <p className="text-green-100 mb-6">{result?.message}</p>

            <div className="bg-green-700/50 rounded-lg p-4 text-left space-y-2 mb-6">
              <p>
                <span className="text-green-200 text-sm">Attendee:</span>{" "}
                <span className="font-bold block text-lg">
                  {result?.attendee?.name}
                </span>
              </p>
              <p>
                <span className="text-green-200 text-sm">Ticket Type:</span>{" "}
                <span className="font-bold block">
                  {result?.attendee?.ticketType}
                </span>
              </p>
            </div>

            <button
              onClick={resetScanner}
              className="bg-white text-green-700 w-full py-3 rounded-xl font-bold hover:bg-green-50 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Scan Next Ticket
            </button>
          </div>
        )}

        {/* State 4: Error */}
        {status === "error" && (
          <div className="bg-red-600 w-full p-8 rounded-2xl text-center shadow-2xl animate-in shake duration-300">
            <div className="bg-white text-red-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-2">ACCESS DENIED</h2>
            <p className="text-red-100 mb-6 font-medium text-lg">
              {result?.message}
            </p>

            <button
              onClick={resetScanner}
              className="bg-white text-red-700 w-full py-3 rounded-xl font-bold hover:bg-red-50 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
