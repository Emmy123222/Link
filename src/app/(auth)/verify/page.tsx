"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyPage() {
  const token = useSearchParams().get("token");
  const [message, setMessage] = useState("Verifying...");
  const router = useRouter();

  useEffect(() => {
    if (!token) return;

    fetch("/api/auth/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setMessage("Email verified successfully!");
          setTimeout(() => router.push("/login"), 2000);
        } else {
          setMessage(res.error || "Verification failed.");
        }
      });
  }, [token]);

  return <p>{message}</p>;
}
