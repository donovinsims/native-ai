"use server";

interface SubscribeResult {
  success: boolean;
  error?: string;
}

export async function subscribeToNewsletter(email: string): Promise<SubscribeResult> {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Please enter a valid email address" };
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In production, you would:
  // 1. Save to database
  // 2. Send to email service (Mailchimp, ConvertKit, etc.)
  // 3. Send confirmation email

  console.log("Newsletter subscription:", email);

  // For demo purposes, always succeed
  return { success: true };
}
