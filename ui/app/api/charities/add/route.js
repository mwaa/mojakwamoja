import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import { dbSaveTo } from '@/database/db';

export async function POST(request) {
  // Get form data from request
  const formData = await request.formData();
  console.log(formData);
  // Save image from form data
  const file = formData.get('image');
  const newId = uuid();

  fs.mkdirSync(`./public/logos/${newId}/`, { recursive: true });
  fs.writeFileSync(`./public/logos/${newId}/${file.name}`, Buffer.from(await file.arrayBuffer()));

  const charity = {
    _id: newId,
    logo: `/logos/${newId}/${file.name}`,
    name: formData.get('name'),
    description: formData.get('description')
  };

  dbSaveTo(newId, charity);
  return NextResponse.json({ data: charity });
}
