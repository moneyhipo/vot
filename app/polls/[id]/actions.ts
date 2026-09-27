"use server";

import { sql } from "@/lib/db";
import { redirect } from "next/navigation";

export async function submitVote(formData: FormData) {
  const poll_id = formData.get("poll_id") as string;
  const option_id = formData.get("option_id") as string;

  if (!poll_id || !option_id) return;

  // 서버사이드에서도 마감 여부 검증
  const [poll] = await sql`SELECT closes_at FROM polls WHERE id = ${poll_id}`;
  if (poll && poll.closes_at && new Date() > new Date(poll.closes_at)) {
    throw new Error("이미 마감된 투표입니다.");
  }

  // 투표 수 증가
  await sql`
    UPDATE options 
    SET vote_count = vote_count + 1 
    WHERE id = ${option_id}
  `;

  // 투표 후 결과 페이지로 리다이렉트
  redirect(`/polls/${poll_id}/results`);
}
