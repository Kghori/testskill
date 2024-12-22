// Import necessary Firebase services
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getAnalytics } from "firebase/analytics";

// Firebase Configuration for the first app
const firebaseConfigApp1 = {
  apiKey: "AIzaSyAqmkYXLB-JxeQyWhYW-m3XH2d_OU2bxGk",
  authDomain: "testskill-9b23d.firebaseapp.com",
  projectId: "testskill-9b23d",
  storageBucket: "testskill-9b23d.firebasestorage.app",
  messagingSenderId: "82611228805",
  appId: "1:82611228805:web:fec561847f05e6a54f99ec",
  measurementId: "G-Y2REJBTHRH",
};

// Firebase Configuration for the second app
const firebaseConfigApp2 = {
  apiKey: "AIzaSyAlOP4c-x_wz8rkzvDYM-RfCLxTTpZpCTM",
  authDomain: "talent1-8ad4b.firebaseapp.com",
  projectId: "talent1-8ad4b",
  storageBucket: "talent1-8ad4b.appspot.com",
  messagingSenderId: "294123121241",
  appId: "1:294123121241:web:eac3b648669d2a128f5f48",
  measurementId: "G-5DL9P69XBD",
};

// Initialize both Firebase Apps
const app1 = initializeApp(firebaseConfigApp1, "app1");
const app2 = initializeApp(firebaseConfigApp2, "app2");

// Initialize Firebase services for app1
const authApp1 = getAuth(app1);
const dbApp1 = getFirestore(app1);
const storageApp1 = getStorage(app1);
const functionsApp1 = getFunctions(app1);
let analyticsApp1;
try {
  analyticsApp1 = getAnalytics(app1);
} catch (error) {
  console.warn("Analytics initialization skipped:", error);
}

// Initialize Firebase services for app2
const authApp2 = getAuth(app2);
const dbApp2 = getFirestore(app2);
const storageApp2 = getStorage(app2);
const functionsApp2 = getFunctions(app2);
let analyticsApp2;
try {
  analyticsApp2 = getAnalytics(app2);
} catch (error) {
  console.warn("Analytics initialization skipped:", error);
}

// Connect Functions Emulator for Development (app1 example)
if (process.env.NODE_ENV === "development") {
  connectFunctionsEmulator(functionsApp1, "localhost", 5001);
}

// Export initialized Firebase services for both apps
export {
  app1,
  app2,
  authApp1,
  authApp2,
  dbApp1,
  dbApp2,
  storageApp1,
  storageApp2,
  functionsApp1,
  functionsApp2,
  analyticsApp1,
  analyticsApp2,
};
