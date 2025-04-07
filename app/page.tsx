import { LNB } from "@/components/layout/lnb";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <LNB />
      <main className="flex-1 p-8">
        <h1>Welcome to e-청구서 관리</h1>
      </main>
    </div>
  );
}
