"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCustomerForm } from "./CustomerFormContext";
import { isValidEmail } from "@/utils/isValidEmail";

export default function ConfirmCustomerEmail() {
  const [email, setEmail] = useState("");
  const { nextStep, updateFormData, formData } = useCustomerForm();

  const handleNext = () => {
    if (!isValidEmail(email)) {
      return;
    }
    updateFormData({ email });
    nextStep();
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-card rounded-lg shadow-sm border p-8 space-y-6">
        <h2 className="text-lg font-medium mb-6">Enter customer email</h2>
        <p className="text-sm text-muted-foreground mb-6">Please enter the customer's email address for communication.</p>
        <div>
          <Input
            label="Email Address*"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100"
          />
          {!isValidEmail(email) && <p className="text-red-500 text-sm">Please enter a valid email address</p>}
        </div>
        <Button
          onClick={handleNext}
          colorSchema="green"
          variant="primary"
          className="w-full"
        >
          Next
        </Button>
      </div>
    </div>
  )
}
