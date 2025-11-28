"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SubscribeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscriberCount?: number;
}

type FormState = "idle" | "loading" | "success" | "error";

export default function SubscribeModal({
  open,
  onOpenChange,
  subscriberCount = 97,
}: SubscribeModalProps) {
  const [email, setEmail] = React.useState("");
  const [formState, setFormState] = React.useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("loading");
    setErrorMessage("");

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setFormState("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormState("success");
    } catch (error) {
      setFormState("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  React.useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setFormState("idle");
        setEmail("");
        setErrorMessage("");
      }, 300); // Wait for closing animation
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px] p-8 bg-white rounded-lg shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
        {formState === 'success' ? (
          <div className="flex flex-col items-center text-center">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-1000">
                You're subscribed!
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-2">
                Thanks for joining. You'll get your first email with fresh design inspiration soon.
              </DialogDescription>
            </DialogHeader>
            <Button
              onClick={() => onOpenChange(false)}
              className="mt-6 h-10 px-4 w-full bg-gray-900 text-white rounded-lg border border-black hover:bg-almostBlack flex items-center justify-center text-sm font-medium"
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="text-left">
              <DialogTitle className="text-xl font-semibold text-gray-1000">
                Join our newsletter
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">
                Get daily design inspiration updates. Hand-picked, never spam.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={formState === "loading"}
                  className="h-10 rounded-lg border-gray-200 focus-visible:ring-black placeholder:text-gray-400 text-sm"
                  required
                />
                <Button
                  type="submit"
                  disabled={formState === "loading"}
                  className="h-10 px-4 bg-gray-900 text-white rounded-lg border border-black hover:bg-almostBlack flex items-center justify-center text-sm font-medium shrink-0"
                >
                  {formState === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </div>
              {formState === "error" && (
                <p className="text-xs text-destructive">{errorMessage}</p>
              )}
            </form>
            
            <p className="mt-4 text-center text-sm text-gray-400">
                Join {subscriberCount.toLocaleString()} others who subscribed today.
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}