import TopNav from "./TopNav";

interface PageLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export default function PageLayout({ children, fullWidth }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className={`flex-1 ${fullWidth ? "" : "mx-auto w-full max-w-6xl px-4 sm:px-6 py-6"}`}>
        {children}
      </main>
    </div>
  );
}
