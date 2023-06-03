import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { dbGetByUUID, dbSaveTo } from '@/database/db';
import { uploadToS3 } from '@/utils/uploadS3';

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
  let newBeneficiary = {};

  if (
    charity &&
    charity.PRODUCTS &&
    productID in charity.PRODUCTS &&
    formData.get('entity') === 'BENEFICIARIES'
  ) {
    const voucher = formData.get('voucher');
    const audioFile = formData.get('audio');

    uploadToS3(voucher, Buffer.from(await audioFile.arrayBuffer()));

    const beneficiaries = charity.PRODUCTS[productID]['BENEFICIARIES'] || {};
    newBeneficiary = {
      _id: newId,
      voucher: formData.get('voucher'),
      voicePrint: formData.get('voicePrint')
    };
    beneficiaries[newId] = newBeneficiary;
    charity.PRODUCTS[productID]['BENEFICIARIES'] = beneficiaries;
    dbSaveTo(charityID, charity);
  }

  return NextResponse.json({ data: newBeneficiary });
}
