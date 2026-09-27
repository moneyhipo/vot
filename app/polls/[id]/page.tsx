import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { submitVote } from "./actions";

export const revalidate = 0; // SSR

export default async function PollPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let polls: any[];
  let options: any[];

  try {
    polls = (await sql`SELECT * FROM polls WHERE id = ${id}`) as any[];
    options = (await sql`SELECT * FROM options WHERE poll_id = ${id} ORDER BY id ASC`) as any[];
  } catch (e) {
    return notFound();
  }

  if (polls.length === 0) return notFound();

  const poll = polls[0];
  const isClosed = poll.closes_at && new Date() > new Date(poll.closes_at);

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow border border-gray-100">
      <h2 className="text-2xl font-bold mb-2">{poll.question}</h2>
      
      <div className="text-sm text-gray-500 mb-6 flex gap-4">
        <span>등록일: {format(new Date(poll.created_at), "yyyy-MM-dd HH:mm")}</span>
        {poll.closes_at && (
          <span className={isClosed ? "text-red-500 font-bold" : "text-blue-500"}>
            마감일: {format(new Date(poll.closes_at), "yyyy-MM-dd HH:mm")}
          </span>
        )}
      </div>

      {isClosed && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6 border border-red-200">
          이 투표는 마감되었습니다. 더 이상 참여할 수 없습니다.
        </div>
      )}

      <form action={submitVote} className="space-y-4">
        <input type="hidden" name="poll_id" value={poll.id} />
        
        <div className="space-y-3">
          {options.map((opt) => (
            <label 
              key={opt.id} 
              className={`block border p-4 rounded-lg cursor-pointer transition ${
                isClosed ? "bg-gray-50 opacity-60" : "hover:bg-blue-50 hover:border-blue-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <input 
                  type="radio" 
                  name="option_id" 
                  value={opt.id} 
                  required 
                  disabled={isClosed}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="font-medium text-gray-800">{opt.label}</span>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-8 flex gap-3">
          <button 
            type="submit" 
            disabled={isClosed}
            className="flex-1 bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            투표하기
          </button>
          
          <Link 
            href={`/polls/${poll.id}/results`}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition flex items-center justify-center"
          >
            결과 보기
          </Link>
        </div>
      </form>
    </div>
  );
}
