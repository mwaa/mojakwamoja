import { dbGetAll } from '@/database/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const charities = await dbGetAll();

  let products = [];
  Object.values(charities).forEach((charity) => {
    if ('PRODUCTS' in charity) {
      products = products.concat(Object.values(charity.PRODUCTS));
    }
  });

  return NextResponse.json({ records: products });
}
