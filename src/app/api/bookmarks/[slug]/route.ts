import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bookmark } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET /api/bookmarks/[slug] - Check if an app is bookmarked
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const existing = await db
      .select()
      .from(bookmark)
      .where(
        and(
          eq(bookmark.userId, session.user.id),
          eq(bookmark.contentId, slug),
          eq(bookmark.contentType, "app")
        )
      );

    return NextResponse.json({ isBookmarked: existing.length > 0 });
  } catch (error) {
    console.error("Failed to check bookmark:", error);
    return NextResponse.json(
      { error: "Failed to check bookmark" },
      { status: 500 }
    );
  }
}

// DELETE /api/bookmarks/[slug] - Remove a bookmark
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await db
      .delete(bookmark)
      .where(
        and(
          eq(bookmark.userId, session.user.id),
          eq(bookmark.contentId, slug),
          eq(bookmark.contentType, "app")
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete bookmark:", error);
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}