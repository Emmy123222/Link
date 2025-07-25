"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const res = await fetch("/api/me");
      const { user } = await res.json();
      setLoading(false);
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    };
    checkUser();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return null;
}
