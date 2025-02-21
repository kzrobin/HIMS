import React, { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const Test = () => {
  const [data, setData] = useState("No result");

  return (
    <div className="p-5">
      <h2 className="text-lg font-semibold mb-4">Scan a Barcode</h2>
      <BarcodeScannerComponent
        width={300}
        height={300}
        onUpdate={(err, result) => {
          if (result) setData(result.text);
        }}
      />
      <p className="mt-4">Scanned Data: {data}</p>
    </div>
  );
};

export default Test;
