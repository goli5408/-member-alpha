export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* Warm neutral desktop backdrop — same as member app shell */
    <div className="flex justify-center min-h-dvh" style={{ background: "#ddd9cc" }}>
      <div
        className="relative w-full flex flex-col"
        style={{
          maxWidth:  430,
          minHeight: "100dvh",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 8px 48px rgba(0,0,0,0.18)",
        }}
      >
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
          {children}
        </main>
      </div>
    </div>
  );
}
