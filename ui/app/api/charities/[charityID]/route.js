import { NextResponse } from 'next/server';
import fs from 'fs';
import { dbGetByUUID, dbSaveTo } from '@/database/db';

export async function GET(request, { params }) {
  const charity = await dbGetByUUID(params.charityID);
  return NextResponse.json({ record: charity });
}

export async function POST(request, { params }) {
  // Get form data from request
  const charity = await dbGetByUUID(params.charityID);
  const formData = await request.formData();
  const file = formData.get('image');
  const newId = formData.get('_id');

  fs.mkdirSync(`./public/${params.charityID}/${newId}/`, { recursive: true });
  fs.writeFileSync(
    `./public/${params.charityID}/${newId}/${file.name}`,
    Buffer.from(await file.arrayBuffer())
  );

  const products = charity['PRODUCTS'] || {};
  const newProduct = {
    _id: newId,
    image: `/${params.charityID}/${newId}/${file.name}`,
    name: formData.get('name'),
    product: formData.get('product'),
    payout: formData.get('payout'),
    isBundle: formData.get('isBundle'),
    cost: formData.get('cost')
  };
  products[newId] = newProduct;
  charity['PRODUCTS'] = products;
  await dbSaveTo(params.charityID, charity);

  return NextResponse.json({ data: newProduct });
}
