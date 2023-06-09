import { dbGetAll } from '@/database/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  const charities = dbGetAll();

  let products = [];
  Object.values(charities).forEach((charity) => {
    if ('PRODUCTS' in charity) {
      products = products.concat(Object.values(charity.PRODUCTS));
    }
  });

  // Return only products for current store owner
  if (address) {
    products = products.filter((product) => product.payout === address);
  }

  return NextResponse.json({ records: products });
}
