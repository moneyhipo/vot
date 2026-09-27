import { sql } from "@/lib/db";
import Link from "next/link";
import { format } from "date-fns";

export const revalidate = 0; // 항상 최신 데이터 가져오기 (SSR)

export default async function Home() {
  let polls: any[] = [];
  try {
    polls = (await sql`SELECT * FROM polls ORDER BY created_at DESC`) as any[];
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">전체 투표 목록</h2>
        <Link 
          href="/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + 새 투표 만들기
        </Link>
      </div>

      {polls.length === 0 ? (
        <p className="text-gray-500 text-center py-10">아직 등록된 투표가 없습니다.</p>
      ) : (
        <div className="grid gap-4">
          {polls.map((poll) => {
            const isClosed = poll.closes_at && new Date() > new Date(poll.closes_at);
            return (
              <Link
                key={poll.id}
                href={`/polls/${poll.id}`}
                className={`p-5 rounded-lg border flex flex-col gap-2 transition hover:shadow-md ${
                  isClosed ? "bg-gray-100 border-gray-200" : "bg-white border-blue-100"
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className={`text-lg font-semibold ${isClosed ? "text-gray-500" : "text-gray-900"}`}>
                    {poll.question}
                  </h3>
                  {isClosed && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      마감됨
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 flex gap-4">
                  <span>등록일: {format(new Date(poll.created_at), "yyyy-MM-dd HH:mm")}</span>
                  {poll.closes_at && (
                    <span className={isClosed ? "text-red-500" : "text-blue-500"}>
                      마감일: {format(new Date(poll.closes_at), "yyyy-MM-dd HH:mm")}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
