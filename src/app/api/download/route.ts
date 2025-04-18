import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const imageUrl = request.nextUrl.searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
    }

    // Fetch the image on the server side
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'attachment; filename="action-figure.png"',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: unknown) {
    console.error('Error downloading image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to download image';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
