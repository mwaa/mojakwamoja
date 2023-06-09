import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { dbGetProductBenefiaries } from '@/database/db';
import { uploadToS3 } from '@/utils/uploadS3';

export async function POST(request, { params }) {
  // Get form data from request
  const { productID } = params;
  const beneficiaries = dbGetProductBenefiaries(productID);
  const formData = await request.formData();
  const beneficiaryID = formData.get('beneficiaryId');
  const audioFile = formData.get('audio');
  const newAudioId = uuid();

  let data = {};
  if (beneficiaryID && beneficiaryID in beneficiaries) {
    const currentBeneficiary = beneficiaries[beneficiaryID];

    uploadToS3(newAudioId, Buffer.from(await audioFile.arrayBuffer()));

    data = {
      original: currentBeneficiary.voucher,
      redeem: newAudioId
    };
  }

  return NextResponse.json({ data });
}
