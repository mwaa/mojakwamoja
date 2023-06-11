import fs from 'fs';
import path from 'path';
import { kv } from "@vercel/kv";

const dbPath = path.join(process.cwd(), 'database/simple.json');

if (process.env.NODE_ENV === 'production') {
  const data = JSON.parse(fs.readFileSync(dbPath));
  readDB().then((existingData) => {
    if (!existingData || !"62c60b15-11ca-4fdc-a296-77ca77c712a6" in existingData) {
      writeToDB(data);
    }
  });
}

async function readDB() {
  if (process.env.NODE_ENV === 'production') {
    return await kv.get('charities');
  } else {
    return JSON.parse(fs.readFileSync(dbPath));
  }
}

async function writeToDB(data) {
  if (process.env.NODE_ENV === 'production') {
    return await kv.set('charities', data);
  } else {
    return fs.writeFileSync(dbPath, JSON.stringify(data), 'utf-8');
  }
}


export async function dbSaveTo(uuid, record) {
  const data = await readDB();
  data[uuid] = record;
  await writeToDB(data);
}

export async function dbGetByUUID(uuid) {
  const data = await readDB();
  if (uuid in data) {
    return data[uuid];
  }
  return null;
}

export async function dbDeleteByUUID(uuid) {
  const data = await readDB();
  if (uuid in data) {
    const isRemoved = delete data[uuid];
    await writeToDB(data);
    return isRemoved;
  }
  return false;
}

export async function dbGetAll() {
  const data = await readDB();
  return Object.values(data);
}

export async function dbGetProductBenefiaries(productID) {
  let beneficiaries = {};
  const charities = await dbGetAll();
  Object.values(charities).forEach((charity) => {
    if ('PRODUCTS' in charity && productID in charity.PRODUCTS) {
      if ('BENEFICIARIES' in charity.PRODUCTS[productID]) {
        beneficiaries = charity.PRODUCTS[productID].BENEFICIARIES;
      }
    }
  });

  return beneficiaries;
}
