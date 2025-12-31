import { db } from '@/db';
import { linksTable, InsertLink } from '@/db/schema';
import { eq, desc, and, not } from 'drizzle-orm';

export async function getUserLinks(userId: string) {
  return await db
    .select()
    .from(linksTable)
    .where(eq(linksTable.userId, userId))
    .orderBy(desc(linksTable.createdAt));
}

export async function createLink(data: Omit<InsertLink, 'id' | 'createdAt' | 'updatedAt'>) {
  const [link] = await db.insert(linksTable).values(data).returning();
  return link;
}

export async function updateLink(
  id: number,
  userId: string,
  data: { url: string; shortCode: string }
) {
  const [link] = await db
    .update(linksTable)
    .set({
      url: data.url,
      shortCode: data.shortCode,
      updatedAt: new Date().toISOString(),
    })
    .where(and(eq(linksTable.id, id), eq(linksTable.userId, userId)))
    .returning();
  return link;
}

export async function deleteLink(id: number, userId: string) {
  const [link] = await db
    .delete(linksTable)
    .where(and(eq(linksTable.id, id), eq(linksTable.userId, userId)))
    .returning();
  return link;
}

export async function checkShortCodeExists(shortCode: string, excludeId?: number) {
  const conditions = [eq(linksTable.shortCode, shortCode)];
  
  if (excludeId !== undefined) {
    conditions.push(not(eq(linksTable.id, excludeId)));
  }

  const [existing] = await db
    .select()
    .from(linksTable)
    .where(conditions.length === 1 ? conditions[0] : and(...conditions))
    .limit(1);
  
  return !!existing;
}

export async function getLinkByShortCode(shortCode: string) {
  const [link] = await db
    .select()
    .from(linksTable)
    .where(eq(linksTable.shortCode, shortCode))
    .limit(1);
  
  return link;
}
