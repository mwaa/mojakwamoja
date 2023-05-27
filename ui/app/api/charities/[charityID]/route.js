import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import { dbGetByUUID, dbSaveTo } from '@/database/db';

export async function GET(request, { params }) {
    const charity = dbGetByUUID(params.charityID);
    return NextResponse.json({ record: charity });
}

export async function POST(request, { params }) {
    // Get form data from request
    const charity = dbGetByUUID(params.charityID);
    const formData = await request.formData();
    const file = formData.get('image');
    const newId = uuid();

    fs.mkdirSync(`./public/${params.charityID}/${newId}/`, { recursive: true });
    fs.writeFileSync(
        `./public/${params.charityID}/${newId}/${file.name}`,
        Buffer.from(await file.arrayBuffer())
    );

    if (formData.get('entity') === 'PRODUCTS') {
        const products = charity['PRODUCTS'] || {};
        products[newId] = {
            _id: newId,
            image: `/${params.charityID}/${newId}/${file.name}`,
            name: formData.get('name'),
            product: formData.get('product'),
            payout: formData.get('payout'),
            isBundle: formData.get('isBundle'),
            cost: formData.get('cost'),
        };
        charity['PRODUCTS'] = products;
        dbSaveTo(params.charityID, charity);
    }

    return NextResponse.json({ record: charity });
}