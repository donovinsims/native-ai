import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bookmark } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET /api/bookmarks - Get all bookmarks for the authenticated user
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const bookmarks = await db
      .select()
      .from(bookmark)
      .where(eq(bookmark.userId, session.user.id));

    return NextResponse.json({ bookmarks });
  } catch (error) {
    console.error("Failed to fetch bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}

// POST /api/bookmarks - Add a bookmark
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { appSlug, contentType = "app" } = body;

    if (!appSlug) {
      return NextResponse.json(
        { error: "App slug is required" },
        { status: 400 }
      );
    }

    // Check if bookmark already exists
    const existing = await db
      .select()
      .from(bookmark)
      .where(
        and(
          eq(bookmark.userId, session.user.id),
          eq(bookmark.contentId, appSlug),
          eq(bookmark.contentType, contentType)
        )
      );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Bookmark already exists" },
        { status: 409 }
      );
    }

    const [newBookmark] = await db
      .insert(bookmark)
      .values({
        userId: session.user.id,
        contentId: appSlug,
        contentType: contentType,
      })
      .returning();

    return NextResponse.json({ bookmark: newBookmark }, { status: 201 });
  } catch (error) {
    console.error("Failed to add bookmark:", error);
    return NextResponse.json(
      { error: "Failed to add bookmark" },
      { status: 500 }
    );
  }
}