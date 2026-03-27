export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="app-shell">
      <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
        {children}
      </main>
    </div>
  );
}
