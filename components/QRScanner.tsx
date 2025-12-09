"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: any) => void;
}

export default function QRScanner({
  onScanSuccess,
  onScanFailure,
}: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);

  useEffect(() => {
    // 1. Initialize the scanner
    // "reader" matches the ID of the div below
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        aspectRatio: 1.0,
      },
      /* verbose= */ false
    );

    scannerRef.current = scanner;

    // 2. Render the scanner
    scanner.render(
      (decodedText) => {
        // Success callback
        // Clear the scanner after success to prevent multiple rapid scans
        scanner.clear();
        setScanResult(decodedText);
        onScanSuccess(decodedText);
      },
      (error) => {
        // Failure callback (often noisy, so we usually ignore standard scanning errors)
        if (onScanFailure) onScanFailure(error);
      }
    );

    // 3. Cleanup on unmount
    return () => {
      scanner
        .clear()
        .catch((error) => console.error("Failed to clear scanner", error));
    };
  }, [onScanSuccess, onScanFailure]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        id="reader"
        className="overflow-hidden rounded-lg border-2 border-gray-200"
      ></div>
      {scanResult && (
        <p className="text-center mt-2 text-green-600 font-medium">
          Code detected!
        </p>
      )}
    </div>
  );
}
