import 'dotenv/config';
import { db } from '@/db';
import { linksTable } from '@/db/schema';

const exampleLinks = [
  { url: 'https://www.github.com', shortCode: 'gh2024' },
  { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', shortCode: 'yt-vid' },
  { url: 'https://docs.google.com/spreadsheets/d/abc123', shortCode: 'gsheet' },
  { url: 'https://www.linkedin.com/in/johndoe', shortCode: 'lnkdn' },
  { url: 'https://www.amazon.com/product/B08N5WRWNW', shortCode: 'amzn-prod' },
  { url: 'https://twitter.com/elonmusk/status/123456789', shortCode: 'tweet' },
  { url: 'https://stackoverflow.com/questions/12345678', shortCode: 'so-q' },
  { url: 'https://www.figma.com/file/abc123/My-Design', shortCode: 'figma-design' },
  { url: 'https://vercel.com/docs/concepts/deployments', shortCode: 'vcl-docs' },
  { url: 'https://nextjs.org/docs/app/building-your-application', shortCode: 'next-docs' },
];

async function seedLinks() {
  const userId = 'user_37ZqSjaor8GeXAfTT2Q8wTQvc7p';
  
  try {
    console.log('🌱 Seeding example links...');
    
    for (const link of exampleLinks) {
      await db.insert(linksTable).values({
        userId,
        url: link.url,
        shortCode: link.shortCode,
      });
      console.log(`✓ Added: ${link.shortCode} -> ${link.url}`);
    }
    
    console.log('✅ Successfully seeded 10 example links!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedLinks();
