import { NextRequest, NextResponse } from "next/server";

interface SubmitAppRequest {
  appName: string;
  appUrl: string;
  category: string;
  platforms: string[];
  email?: string;
  reason?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SubmitAppRequest = await request.json();

    // Validate required fields
    if (!body.appName || typeof body.appName !== "string" || !body.appName.trim()) {
      return NextResponse.json(
        { message: "App name is required" },
        { status: 400 }
      );
    }

    if (!body.appUrl || typeof body.appUrl !== "string" || !body.appUrl.trim()) {
      return NextResponse.json(
        { message: "App URL is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(body.appUrl.startsWith("http") ? body.appUrl : `https://${body.appUrl}`);
    } catch {
      return NextResponse.json(
        { message: "Please provide a valid URL" },
        { status: 400 }
      );
    }

    if (!body.category || typeof body.category !== "string") {
      return NextResponse.json(
        { message: "Category is required" },
        { status: 400 }
      );
    }

    if (!body.platforms || !Array.isArray(body.platforms) || body.platforms.length === 0) {
      return NextResponse.json(
        { message: "At least one platform is required" },
        { status: 400 }
      );
    }

    // Validate email if provided
    if (body.email && !body.email.includes("@")) {
      return NextResponse.json(
        { message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Store the submission in a database
    // 2. Send notification to admin
    // 3. Send confirmation email to user

    console.log("New app submission:", {
      appName: body.appName,
      appUrl: body.appUrl,
      category: body.category,
      platforms: body.platforms,
      email: body.email,
      reason: body.reason,
    });

    // Simulate some processing time
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(
      { 
        message: "App submitted successfully!",
        submission: {
          appName: body.appName,
          appUrl: body.appUrl,
          category: body.category,
          platforms: body.platforms,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { message: "Failed to submit app. Please try again." },
      { status: 500 }
    );
  }
}
