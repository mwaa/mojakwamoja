import { dbGetAll } from '@/database/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const charities = dbGetAll();
    return NextResponse.json({ records: charities });
}