import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 },
      );
    }

    // Only allow Google Drive URLs
    if (
      !imageUrl.includes("googleusercontent.com") &&
      !imageUrl.includes("google.com") &&
      !imageUrl.includes("drive.google.com")
    ) {
      return NextResponse.json(
        { error: "Only Google Drive URLs are allowed" },
        { status: 403 },
      );
    }

    // For Google Drive download URLs, modify to get direct image access
    let fetchUrl = imageUrl;
    if (imageUrl.includes("drive.google.com/uc")) {
      // Convert download URL to direct image URL
      fetchUrl = imageUrl.replace("export=download", "export=view");
    }

    // Fetch the image with proper headers
    const response = await fetch(fetchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "image/*",
        Referer: "https://drive.google.com/",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: response.status },
      );
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
