import { neon } from "@neondatabase/serverless";

// Next.js 개발 서버 환경에서는 HMR(Hot Module Replacement) 때문에 연결이 계속 생성될 수 있으므로
// 전역 변수를 활용해 연결을 재사용합니다.
const globalForNeon = global as unknown as { neonSql: ReturnType<typeof neon> | undefined };

export const sql =
  globalForNeon.neonSql ??
  neon(process.env.DATABASE_URL || "postgresql://dummy:dummy@dummy/dummy");

if (process.env.NODE_ENV !== "production") globalForNeon.neonSql = sql;
