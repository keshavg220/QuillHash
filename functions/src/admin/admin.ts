import * as admin from 'firebase-admin';
import { RuntimeOptions } from 'firebase-functions';
admin.initializeApp();
export const db = admin.firestore();
export const auth = admin.auth();
export const messaging = admin.messaging();
export const runTime2: RuntimeOptions = { timeoutSeconds: 120, memory: '128MB' };
