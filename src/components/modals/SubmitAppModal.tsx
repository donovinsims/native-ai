"use client";

import { useState } from "react";
import { Upload, Loader2, CheckCircle } from "lucide-react";
import { Modal } from "./Modal";

interface SubmitAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
{ value: "", label: "Select a category" },
{ value: "design", label: "Design" },
{ value: "development", label: "Development" },
{ value: "productivity", label: "Productivity" },
{ value: "security", label: "Security" },
{ value: "automation", label: "Automation" },
{ value: "communication", label: "Communication" },
{ value: "utilities", label: "Utilities" }];


const platforms = [
{ value: "ios", label: "iOS" },
{ value: "macos", label: "MacOS" },
{ value: "mcp", label: "MCP" },
{ value: "n8n", label: "n8n" },
{ value: "shortcut", label: "iOS Shortcut" },
{ value: "web", label: "Web App" }];


interface FormData {
  appName: string;
  appUrl: string;
  category: string;
  platforms: string[];
  email: string;
  reason: string;
}

export function SubmitAppModal({ isOpen, onClose }: SubmitAppModalProps) {
  const [formData, setFormData] = useState<FormData>({
    appName: "",
    appUrl: "",
    category: "",
    platforms: [],
    email: "",
    reason: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.appName.trim()) {
      newErrors.appName = "App name is required";
    }

    if (!formData.appUrl.trim()) {
      newErrors.appUrl = "App URL is required";
    } else if (!isValidUrl(formData.appUrl)) {
      newErrors.appUrl = "Please enter a valid URL";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (formData.platforms.length === 0) {
      newErrors.platforms = ["Please select at least one platform"];
    }

    if (formData.email && !formData.email.includes("@")) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/submit-app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to submit");
      }

      setIsSuccess(true);
      setFormData({
        appName: "",
        appUrl: "",
        category: "",
        platforms: [],
        email: "",
        reason: ""
      });
    } catch (err) {
      setErrors({
        appName: err instanceof Error ? err.message : "Something went wrong"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlatformChange = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform) ?
      prev.platforms.filter((p) => p !== platform) :
      [...prev.platforms, platform]
    }));
    setErrors((prev) => ({ ...prev, platforms: undefined }));
  };

  const handleClose = () => {
    setTimeout(() => {
      setFormData({
        appName: "",
        appUrl: "",
        category: "",
        platforms: [],
        email: "",
        reason: ""
      });
      setErrors({});
      setIsSuccess(false);
    }, 200);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Submit an app">
      <div className="p-6 pt-4 md:pt-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full">
            {isSuccess ?
            <CheckCircle className="w-6 h-6 text-green-600" /> :

            <Upload className="w-6 h-6 text-gray-900" />
            }
          </div>
        </div>

        {isSuccess ?
        <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Submission received!
            </h2>
            <p className="text-gray-600 mb-6">
              Thanks for sharing! We&apos;ll review your submission and add it to our directory if it meets our quality standards.
            </p>
            <button
            onClick={handleClose}
            className="w-full min-h-[44px] px-4 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors">

              Done
            </button>
          </div> :

        <>
            {/* Heading */}
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Submit Software
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-center mb-6">
              Know a great software application? Share it with the community.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* App Name */}
              <div>
                <label htmlFor="appName" className="block text-sm font-medium text-gray-700 mb-1">
                  App name <span className="text-red-500">*</span>
                </label>
                <input
                id="appName"
                type="text"
                value={formData.appName}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, appName: e.target.value }));
                  setErrors((prev) => ({ ...prev, appName: undefined }));
                }}
                placeholder="e.g., Figma"
                className={`w-full min-h-[44px] px-4 py-3 rounded-lg border ${
                errors.appName ? "border-red-300" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent`
                }
                disabled={isLoading} />

                {errors.appName &&
              <p className="mt-1 text-sm text-red-600">{errors.appName}</p>
              }
              </div>

              {/* App URL */}
              <div>
                <label htmlFor="appUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  App URL <span className="text-red-500">*</span>
                </label>
                <input
                id="appUrl"
                type="text"
                value={formData.appUrl}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, appUrl: e.target.value }));
                  setErrors((prev) => ({ ...prev, appUrl: undefined }));
                }}
                placeholder="https://example.com"
                className={`w-full min-h-[44px] px-4 py-3 rounded-lg border ${
                errors.appUrl ? "border-red-300" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent`
                }
                disabled={isLoading} />

                {errors.appUrl &&
              <p className="mt-1 text-sm text-red-600">{errors.appUrl}</p>
              }
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                id="category"
                value={formData.category}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, category: e.target.value }));
                  setErrors((prev) => ({ ...prev, category: undefined }));
                }}
                className={`w-full min-h-[44px] px-4 py-3 rounded-lg border ${
                errors.category ? "border-red-300" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white`
                }
                disabled={isLoading}>

                  {categories.map((cat) =>
                <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                )}
                </select>
                {errors.category &&
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              }
              </div>

              {/* Platforms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((platform) =>
                <label
                  key={platform.value}
                  className={`inline-flex items-center justify-center min-h-[44px] px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                  formData.platforms.includes(platform.value) ?
                  "bg-gray-900 text-white border-gray-900" :
                  "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`
                  }>

                      <input
                    type="checkbox"
                    checked={formData.platforms.includes(platform.value)}
                    onChange={() => handlePlatformChange(platform.value)}
                    className="sr-only"
                    disabled={isLoading} />

                      <span className="text-sm !whitespace-pre-line !whitespace-pre-line !whitespace-pre-line">{platform.label}</span>
                    </label>
                )}
                </div>
                {errors.platforms &&
              <p className="mt-1 text-sm text-red-600">{errors.platforms}</p>
              }
              </div>

              {/* Email (optional) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Your email <span className="text-gray-400">(optional)</span>
                </label>
                <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, email: e.target.value }));
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="you@example.com"
                className={`w-full min-h-[44px] px-4 py-3 rounded-lg border ${
                errors.email ? "border-red-300" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent`
                }
                disabled={isLoading}
                autoComplete="email" />

                {errors.email &&
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              }
              </div>

              {/* Reason */}
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                  Why is this app great?
                </label>
                <textarea
                id="reason"
                value={formData.reason}
                onChange={(e) =>
                setFormData((prev) => ({ ...prev, reason: e.target.value }))
                }
                placeholder="Tell us what makes this app special..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                disabled={isLoading} />

              </div>

              <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[44px] px-4 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">

                {isLoading ?
              <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </> :

              "Submit App"
              }
              </button>
            </form>

            {/* Footer text */}
            <p className="text-sm text-gray-400 text-center mt-4">
              We verify every submission
            </p>
          </>
        }
      </div>
    </Modal>);

}