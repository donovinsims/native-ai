import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { RegisterPageClient } from "./RegisterPageClient";

function RegisterPageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterPageFallback />}>
      <RegisterPageClient />
    </Suspense>
  );
}