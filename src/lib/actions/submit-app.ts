"use server";

interface SubmitAppData {
  appName: string;
  appUrl: string;
  category: string;
  platforms: string[];
  email?: string;
  description?: string;
}

interface SubmitAppResult {
  success: boolean;
  error?: string;
}

export async function submitApp(data: SubmitAppData): Promise<SubmitAppResult> {
  // Validate required fields
  if (!data.appName.trim()) {
    return { success: false, error: "App name is required" };
  }

  if (!data.appUrl.trim()) {
    return { success: false, error: "App URL is required" };
  }

  // Validate URL format
  try {
    new URL(data.appUrl);
  } catch {
    return { success: false, error: "Please enter a valid URL" };
  }

  if (!data.category) {
    return { success: false, error: "Please select a category" };
  }

  if (!data.platforms || data.platforms.length === 0) {
    return { success: false, error: "Please select at least one platform" };
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In production, you would:
  // 1. Save to database
  // 2. Send notification to admin/moderators
  // 3. Send confirmation email to user if provided

  console.log("App submission:", data);

  // For demo purposes, always succeed
  return { success: true };
}
