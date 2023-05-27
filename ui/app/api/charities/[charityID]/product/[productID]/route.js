import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { dbGetByUUID, dbSaveTo } from '@/database/db';

export async function GET(request, { params }) {
  const { charityID, productID } = params;
  const charity = dbGetByUUID(charityID);
  let product = {};
  if (charity && charity.PRODUCTS && productID in charity.PRODUCTS) {
    product = charity.PRODUCTS[productID];
  }
  console.log('Output', product);
  return NextResponse.json({ record: product });
}

export async function POST(request, { params }) {
  // Get form data from request
  const { charityID, productID } = params;
  const charity = dbGetByUUID(charityID);
  const formData = await request.formData();
  const newId = uuid();

  // TODO:: audio upload
  // const file = formData.get('image');
  // fs.mkdirSync(`./public/${charityID}/${newId}/`, { recursive: true });
  // fs.writeFileSync(
  //     `./public/${charityID}/${newId}/${file.name}`,
  //     Buffer.from(await file.arrayBuffer())
  // );

  console.log(charity.PRODUCTS);
  console.log(params);
  console.log(productID);
  console.log(charity.PRODUCTS.hasOwnProperty(productID));
  console.log(productID in charity.PRODUCTS);

  if (
    charity &&
    charity.PRODUCTS &&
    productID in charity.PRODUCTS &&
    formData.get('entity') === 'BENEFICIARIES'
  ) {
    console.log('in the ofsite');
    const beneficiaries = charity.PRODUCTS[productID]['BENEFICIARIES'] || {};
    beneficiaries[newId] = {
      _id: newId,
      name: formData.get('voucher'),
      voicePrint: formData.get('voicePrint')
    };
    charity.PRODUCTS[productID]['BENEFICIARIES'] = beneficiaries;
    dbSaveTo(charityID, charity);
  }

  return NextResponse.json({ record: charity });
}
