import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Store the email in a database
    // 2. Add to an email service like Mailchimp, ConvertKit, etc.
    // 3. Send a confirmation email

    // For now, we'll simulate a successful subscription
    console.log("New subscriber:", email);

    // Simulate some processing time
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(
      { message: "Successfully subscribed!", email },
      { status: 200 }
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { message: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
