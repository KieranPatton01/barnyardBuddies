import fs from 'fs';
import path from 'path';

// Reads the most recent backup JSON file in the project folder and uploads it back to Firestore
async function restoreBackup() {
  const rootDir = process.cwd();
  const files = fs.readdirSync(rootDir);
  const backupFiles = files
    .filter(f => f.startsWith('barnyard_buddies_backup_') && f.endsWith('.json'))
    .sort()
    .reverse();

  if (backupFiles.length === 0) {
    console.error('No backup files found to restore!');
    return;
  }

  const targetFile = backupFiles[0];
  console.log(`Restoring from latest backup: ${targetFile}...`);
  const raw = fs.readFileSync(path.join(rootDir, targetFile), 'utf8');
  const animals = JSON.parse(raw);

  let successCount = 0;
  for (const animal of animals) {
    const url = `https://firestore.googleapis.com/v1/projects/barnyard-buddies-59a4a/databases/(default)/documents/barnyard_buddies/${animal.id}`;
    
    // Convert object fields into Firestore REST format
    const fields = {};
    for (const [key, val] of Object.entries(animal)) {
      if (val === null || val === undefined) fields[key] = { nullValue: null };
      else if (typeof val === 'string') fields[key] = { stringValue: val };
      else if (typeof val === 'boolean') fields[key] = { booleanValue: val };
      else if (typeof val === 'number') {
        if (Number.isInteger(val)) fields[key] = { integerValue: val.toString() };
        else fields[key] = { doubleValue: val };
      }
    }

    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields })
    });

    if (res.ok) {
      successCount++;
    } else {
      const err = await res.text();
      console.warn(`Failed to restore ${animal.id}:`, err);
    }
  }

  console.log(`Restore complete: Successfully restored ${successCount} of ${animals.length} animals!`);
}

restoreBackup().catch(console.error);
