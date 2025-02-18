import React, { useState } from "react";
import BillingInformation from "./BillingInformation";

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [billingData, setBillingData] = useState(null);

  const handleNext = (data) => {
    setBillingData(data);
    setStep(3); // Proceed to the next step (e.g., Payment Method)
  };

  const handleBack = () => {
    setStep(1); // Go back to the previous step (e.g., Select Plan)
  };

  return (
    <div>
      {step === 2 && (
        <BillingInformation onNext={handleNext} onBack={handleBack} />
      )}
      {/* Add other steps (Select Plan, Payment Method, Confirmation) here */}
    </div>
  );
};

export default MultiStepForm;
