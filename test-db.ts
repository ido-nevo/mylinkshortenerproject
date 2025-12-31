import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

async function testConnection() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);
  try {
    console.log('Testing database connection...');
    console.log('Using DATABASE_URL from .env');
    
    const result = await sql`
      SELECT 
        current_database() as database,
        current_user as "user",
        version() as postgres_version
    `;
    
    console.log('✓ Database connection successful!');
    console.log('Database:', result[0].database);
    console.log('User:', result[0].user);
    console.log('PostgreSQL:', result[0].postgres_version.split(' ')[1]);
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Connection failed:', error);
    process.exit(1);
  }
}

testConnection();
