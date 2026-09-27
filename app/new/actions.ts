"use server";

import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createPoll(formData: FormData, options: string[]) {
  const question = formData.get("question") as string;
  const closesAtStr = formData.get("closes_at") as string;
  
  const closes_at = closesAtStr ? new Date(closesAtStr) : null;

  try {
    const result = await sql`
      INSERT INTO polls (question, closes_at) 
      VALUES (${question}, ${closes_at ? closes_at.toISOString() : null}) 
      RETURNING id
    `;
    const poll = (result as any[])[0];

    for (const option of options) {
      await sql`
        INSERT INTO options (poll_id, label) 
        VALUES (${poll.id}, ${option})
      `;
    }

    revalidatePath("/");
    return poll.id;
  } catch (e) {
    console.error(e);
    return null;
  }
}
