import fs from 'fs';
import path from 'path';

let dbPath = path.join(process.cwd(), 'database/simple.json');

if (process.env.NODE_ENV === 'production') {
  dbPath = path.join('/tmp', 'simple.json');
  if (!fs.existsSync(path)) {
    const filePath = path.join(process.cwd(), 'database/simple.json');
    const data = JSON.parse(fs.readFileSync(filePath));
    fs.writeFileSync(dbPath, JSON.stringify(data), { flag: 'wx' });
  }
}

export function dbSaveTo(uuid, record) {
  const data = JSON.parse(fs.readFileSync(dbPath));
  data[uuid] = record;
  fs.writeFileSync(dbPath, JSON.stringify(data), 'utf-8');
}

export function dbGetByUUID(uuid) {
  const data = JSON.parse(fs.readFileSync(dbPath));
  if (uuid in data) {
    return data[uuid];
  }
  return null;
}

export function dbDeleteByUUID(uuid) {
  const data = JSON.parse(fs.readFileSync(dbPath));
  if (uuid in data) {
    const isRemoved = delete data[uuid];
    fs.writeFileSync(dbPath, JSON.stringify(data), 'utf-8');
    return isRemoved;
  }
  return false;
}

export function dbGetAll() {
  const data = JSON.parse(fs.readFileSync(dbPath));
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
