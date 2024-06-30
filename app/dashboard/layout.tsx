import Header from '@/components/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col w-full">
      <Header />
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}
