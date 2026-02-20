import { useState, useRef } from "react";
import Quagga from "quagga";

export const useBarcodeScanner = () => {
  const scannerRef = useRef(null);
  const [barcode, setBarcode] = useState("");
  const [scanning, setScanning] = useState(false);

  const onDetectedHandler = (result) => {
    setBarcode(result.codeResult.code);
    Quagga.offDetected(onDetectedHandler);
    Quagga.stop();
    setScanning(false);
  };

  const startScanner = () => {
    if (scanning) return;
    setBarcode(""); // Reset barcode for a new scan
    setScanning(true);
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment",
          },
        },
        decoder: {
          readers: [
            "code_128_reader",
            "ean_reader",
            "ean_8_reader",
            "upc_reader",
          ],
        },
      },
      (err) => {
        if (err) {
          // console.error("Quagga initialization failed:", err);
          setScanning(false);
          return;
        }
        Quagga.start();
        Quagga.offDetected(onDetectedHandler);
        Quagga.onDetected(onDetectedHandler);
      }
    );
  };

  // New function to stop the scanner
  const stopScanner = () => {
    if (scanning) {
      Quagga.stop();
      setScanning(false);
    }
  };

  return {
    scannerRef,
    barcode,
    scanning,
    startScanner,
    setBarcode,
    stopScanner,
  };
};
