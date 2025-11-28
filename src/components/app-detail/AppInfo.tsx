"use client";

import {
  AppData,
  getPlatformLabel,
  getDistributionLabel,
  getPricingLabel,
} from "@/lib/data/app-schema";

interface AppInfoProps {
  app: AppData;
}

export function AppInfo({ app }: AppInfoProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Single App Information Section */}
      <div className="bg-[#f9fafb] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">App Information</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          {/* Row 1 - Left: Category */}
          <div>
            <p className="text-sm text-[#6b7280] font-normal mb-1">Category</p>
            <p className="text-base font-medium text-[#1a1a1a]">{app.category}</p>
          </div>

          {/* Row 1 - Right: Platforms */}
          <div>
            <p className="text-sm text-[#6b7280] font-normal mb-1">Platforms</p>
            <p className="text-base font-medium text-[#1a1a1a]">
              {app.platforms.map(getPlatformLabel).join(", ")}
            </p>
          </div>

          {/* Row 2 - Left: Pricing */}
          <div>
            <p className="text-sm text-[#6b7280] font-normal mb-1">Pricing</p>
            <p className="text-base font-medium text-[#1a1a1a]">
              {getPricingLabel(app.pricing)}
            </p>
          </div>

          {/* Row 2 - Right: Developer */}
          <div>
            <p className="text-sm text-[#6b7280] font-normal mb-1">Developer</p>
            <p className="text-base font-medium text-[#1a1a1a]">
              {app.developer.name}
            </p>
          </div>

          {/* Row 3 - Full Width: Last Updated */}
          <div className="col-span-2">
            <p className="text-sm text-[#6b7280] font-normal mb-1">Last Updated</p>
            <p className="text-base font-medium text-[#1a1a1a]">
              {formatDate(app.metadata.lastUpdated)}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          About {app.name}
        </h2>
        <p className="text-gray-600 leading-relaxed mb-4">{app.description}</p>

        {/* Features */}
        <h3 className="text-base font-medium text-gray-900 mb-3">
          Key Features
        </h3>
        <ul className="space-y-2">
          {app.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}