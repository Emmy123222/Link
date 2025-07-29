import React from "react";
import { CircularProgress } from "./CircularProgress";

interface CollectionStatusCardProps {
  title: string;
  percentage: number;
  color?: string;
}

export const CollectionStatusCard: React.FC<CollectionStatusCardProps> = ({
  title,
  percentage,
  color = "text-green-600",
}) => (
  <div className="bg-card rounded-lg p-4 sm:p-6 shadow-sm border aspect-square overflow-hidden">
    <h2 className="text-base sm:text-lg font-medium">{title}</h2>
    <div className="flex justify-center">
      <div className="relative w-4/5 h-4/5">
        <CircularProgress percentage={percentage} color={color} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl sm:text-2xl font-semibold">{percentage}%</span>
        </div>
      </div>
    </div>
  </div>
); 