import { NextRequest, NextResponse } from 'next/server';
import { getLinkByShortCode } from '@/data/links';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortcode: string }> }
) {
  const { shortcode } = await params;
  
  // Fetch the link from the database
  const link = await getLinkByShortCode(shortcode);
  
  // If link not found, return 404
  if (!link) {
    return new NextResponse('Link not found', { status: 404 });
  }
  
  // Redirect to the full URL
  return NextResponse.redirect(link.url, { status: 307 });
}
