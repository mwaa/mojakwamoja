import fs from 'fs';
import path from 'path';
import { kv } from "@vercel/kv";

const dbPath = path.join(process.cwd(), 'database/simple.json');

if (process.env.NODE_ENV === 'production') {
  const data = JSON.parse(fs.readFileSync(dbPath));
  const existingData = readDB();
  if (!"62c60b15-11ca-4fdc-a296-77ca77c712a6" in existingData) {
    writeToDB(data);
  }
}

function readDB() {
  if (process.env.NODE_ENV === 'production') {
    kv.get('charities').then((data) => {
      return JSON.parse(data);
    });
  } else {
    return JSON.parse(fs.readFileSync(dbPath));
  }
}

function writeToDB(data) {
  if (process.env.NODE_ENV === 'production') {
    return kv.set('charities', JSON.stringify(data));
  } else {
    return fs.writeFileSync(dbPath, JSON.stringify(data), 'utf-8');
  }
}


export function dbSaveTo(uuid, record) {
  const data = readDB();
  data[uuid] = record;
  writeToDB(data);
}

export function dbGetByUUID(uuid) {
  const data = readDB();
  if (uuid in data) {
    return data[uuid];
  }
  return null;
}

export function dbDeleteByUUID(uuid) {
  const data = readDB();
  if (uuid in data) {
    const isRemoved = delete data[uuid];
    writeToDB(data);
    return isRemoved;
  }
  return false;
}

export function dbGetAll() {
  const data = readDB();
  return Object.values(data);
}

export function dbGetProductBenefiaries(productID) {
  let beneficiaries = {};
  const charities = dbGetAll();
  Object.values(charities).forEach((charity) => {
    if ('PRODUCTS' in charity && productID in charity.PRODUCTS) {
      if ('BENEFICIARIES' in charity.PRODUCTS[productID]) {
        beneficiaries = charity.PRODUCTS[productID].BENEFICIARIES;
      }
    }
  });

  return beneficiaries;
}
