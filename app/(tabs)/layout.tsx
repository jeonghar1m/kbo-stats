import { TabNav } from "@/components/tab-nav";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1">
      <header className="bg-zinc-900 text-white py-4 px-4 dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold tracking-tight">⚾ KBO 경기 결과</h1>
        </div>
      </header>
      <TabNav />
      <div className="max-w-4xl mx-auto px-4 py-6">{children}</div>
    </main>
  );
}
