import { sql } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 0; // 항상 최신 데이터 가져오기

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let polls: any[];
  let options: any[];

  try {
    polls = await sql`SELECT * FROM polls WHERE id = ${id}`;
    options = await sql`SELECT * FROM options WHERE poll_id = ${id} ORDER BY id ASC`;
  } catch (e) {
    return notFound();
  }

  if (polls.length === 0) return notFound();

  const poll = polls[0];
  const totalVotes = options.reduce((acc, opt) => acc + opt.vote_count, 0);

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow border border-gray-100">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">📊 투표 결과</h2>
        <h3 className="text-lg text-gray-600">{poll.question}</h3>
        <p className="text-sm text-gray-500 mt-2">
          총 투표 수: <strong className="text-blue-600">{totalVotes}</strong>표
        </p>
      </div>

      <div className="space-y-6">
        {options.map((opt) => {
          const percentage = totalVotes === 0 ? 0 : Math.round((opt.vote_count / totalVotes) * 100);
          
          return (
            <div key={opt.id} className="space-y-1">
              <div className="flex justify-between text-sm font-medium text-gray-700">
                <span>{opt.label}</span>
                <span>{opt.vote_count}표 ({percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-in-out" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Link 
          href="/"
          className="text-blue-600 hover:underline font-medium"
        >
          &larr; 투표 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
