"use client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">

      <main className="max-w-6xl mx-auto p-8">
        {children}
      </main>

    </div>
  );
}