import {NextRequest, NextResponse} from 'next/server';
import {parseCatalogEnquiryParams} from '@/lib/catalog-enquiry-contract';
import {getCatalogEnquiryContext} from '@/lib/catalog-enquiry-context';
export const runtime = 'nodejs';

/** Public engine IDs only. No RDW/network lookup, personal inputs, prices or tuning promises. */
export function GET(request: NextRequest) {
  const ref = request.nextUrl.search.length <= 400 ? parseCatalogEnquiryParams(request.nextUrl.searchParams) : undefined;
  if (!ref) return NextResponse.json({error: 'INVALID_REFERENCE'}, {status: 400, headers: {'Cache-Control': 'no-store'}});
  const context = getCatalogEnquiryContext(ref);
  if (!context) return NextResponse.json({error: 'UNKNOWN_REFERENCE'}, {status: 404, headers: {'Cache-Control': 'no-store'}});
  return NextResponse.json({context}, {headers: {
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600',
    'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff'
  }});
}
