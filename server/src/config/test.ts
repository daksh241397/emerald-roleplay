// test-db.ts
import { testConnection } from './database';

(async () => {
  const isConnected = await testConnection();
  if (isConnected) {
    console.log('✅ Connected to the database!');
  } else {
    console.log('❌ Failed to connect to the database.');
  }
})();
