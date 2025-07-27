import React from "react";
import { Avatar } from "./avatar";

interface PaymentsCardProps {
  title: string;
  payments: { id: string | number; customer?: { business_name?: string, avatar_url?: string }, amount: number }[];
}

export const PaymentsCard: React.FC<PaymentsCardProps> = ({ title, payments }) => {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm aspect-square overflow-hidden">
      <h2 className="text-base sm:text-lg font-medium mb-4">{title}</h2>
      <div className="flex items-center justify-center text-gray-500 w-full">
        {payments.length === 0 ? (
          <p>No payments yet</p>
        ) : (
          <div className="text-gray-700 text-center w-full flex flex-col gap-2 overflow-y-auto">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar 
                    src={payment.customer?.avatar_url || payment.customer?.logo_url || null} 
                    name={payment.customer?.business_name || ""} 
                    width={24} 
                    height={24} 
                    entityType="customer" 
                  />
                  <span>{payment.amount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}; 