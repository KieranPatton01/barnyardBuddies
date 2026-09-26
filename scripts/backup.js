import fs from 'fs';

async function downloadFirestoreData() {
  const url = 'https://firestore.googleapis.com/v1/projects/barnyard-buddies-59a4a/databases/(default)/documents/barnyard_buddies?pageSize=300';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }
  const data = await response.json();
  const rawDocs = data.documents || [];

  // Parse Firestore REST fields into clean plain JSON objects
  const animals = rawDocs.map(doc => {
    const fields = doc.fields || {};
    const obj = {};
    for (const [key, val] of Object.entries(fields)) {
      if (val.stringValue !== undefined) obj[key] = val.stringValue;
      else if (val.integerValue !== undefined) obj[key] = parseInt(val.integerValue, 10);
      else if (val.doubleValue !== undefined) obj[key] = parseFloat(val.doubleValue);
      else if (val.booleanValue !== undefined) obj[key] = val.booleanValue;
      else if (val.nullValue !== undefined) obj[key] = null;
      else if (val.arrayValue !== undefined) {
        obj[key] = (val.arrayValue.values || []).map(v => v.stringValue || v);
      } else {
        obj[key] = val;
      }
    }
    return obj;
  });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `barnyard_buddies_backup_${timestamp}.json`;
  fs.writeFileSync(filename, JSON.stringify(animals, null, 2), 'utf8');
  console.log(`Successfully downloaded ${animals.length} animals to ${filename}!`);
}

downloadFirestoreData().catch(console.error);
