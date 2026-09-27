"use server";

import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createPoll(formData: FormData, options: string[]) {
  const question = formData.get("question") as string;
  const closesAtStr = formData.get("closes_at") as string;
  const admin_password = formData.get("admin_password") as string;
  
  const expectedPassword = process.env.ADMIN_PASSWORD || "1234";

  if (admin_password !== expectedPassword) {
    return { error: "운영자 비밀번호가 틀렸습니다." };
  }
  
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
    return { id: poll.id };
  } catch (e) {
    console.error(e);
    return { error: "서버 오류로 인해 투표를 생성하지 못했습니다." };
  }
}
