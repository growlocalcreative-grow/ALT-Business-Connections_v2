import fs from "fs";
import path from "path";
import { initializeApp, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8'));

if (!getApps().length) {
  initializeApp({
    projectId: firebaseConfig.projectId
  });
}

const db = getFirestore(firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)' 
  ? firebaseConfig.firestoreDatabaseId 
  : undefined);

async function checkQueue() {
  console.log("Checking newsletter_queue with admin privileges...");
  const snapshot = await db.collection("newsletter_queue").limit(5).get();
  console.log(`Found ${snapshot.size} documents.`);
  snapshot.forEach((doc: any) => {
    const data = doc.data();
    console.log(`ID: ${doc.id}, Status: ${data.status}, CreatedAt: ${data.createdAt?.toDate?.() || data.createdAt}`);
    if (data.error) {
      console.log(`Error: ${data.error}`);
    }
  });
  process.exit(0);
}

checkQueue().catch(err => {
  console.error("Error checking queue:", err);
  process.exit(1);
});


