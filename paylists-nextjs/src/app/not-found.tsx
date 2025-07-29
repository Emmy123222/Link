"use client"

import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();
    const handleBack = (): void => {
        router.back();
    }
    return (
        <div className="h-screen w-screen flex-col gap-8 flex justify-center items-center bg-sky-500 text-white">
            <div className="text-center">
                <h1 className="text-9xl font-bold h-40">404</h1>
                <p>Sorry, we couldn’t find the page you’re looking for.</p>
            </div>
            <button
                onClick={handleBack}
                type="button"
                className="bg-white border px-4 py-2 border-gray-300 text-sky-500 rounded-md hover:bg-gray-200 transition-colors"
            >
                Go Back
            </button>
        </div>
    );
}
