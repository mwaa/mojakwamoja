import fs from 'fs';

const dbPath = './database/simple.json';

export function dbSaveTo(uuid, record) {
    const data = JSON.parse(fs.readFileSync(dbPath));
    data[uuid] = record;
    fs.writeFileSync(dbPath, JSON.stringify(data), 'utf-8')
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
        fs.writeFileSync(dbPath, JSON.stringify(data), 'utf-8')
        return isRemoved;
    }
    return false;
}

export function dbGetAll() {
    const data = JSON.parse(fs.readFileSync(dbPath));
    return Object.values(data);
}