"use client";

import { useState } from "react";
import { Sparkles, Loader2, CheckCircle } from "lucide-react";
import { Modal } from "./Modal";

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscribeModal({ isOpen, onClose }: SubscribeModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic email validation
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to subscribe");
      }

      setIsSuccess(true);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setTimeout(() => {
      setEmail("");
      setError(null);
      setIsSuccess(false);
    }, 200);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Subscribe to newsletter">
      <div className="p-6 pt-4 md:pt-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full">
            {isSuccess ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <Sparkles className="w-6 h-6 text-gray-900" />
            )}
          </div>
        </div>

        {isSuccess ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              You&apos;re subscribed!
            </h2>
            <p className="text-gray-600 mb-6">
              Thanks for subscribing. You&apos;ll receive our weekly curated software picks in your inbox.
            </p>
            <button
              onClick={handleClose}
              className="w-full min-h-[44px] px-4 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Heading */}
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Weekly inspiration
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-center mb-6">
              Stay up to date on the latest software discoveries and get the best apps delivered to your email inbox every week.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="you@example.com"
                  className={`w-full min-h-[44px] px-4 py-3 rounded-lg border ${
                    error ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-gray-900"
                  } focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
                  disabled={isLoading}
                  autoComplete="email"
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[44px] px-4 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>

            {/* Footer text */}
            <p className="text-sm text-gray-400 text-center mt-4">
              No spam — just curated software
            </p>
          </>
        )}
      </div>
    </Modal>
  );
}
