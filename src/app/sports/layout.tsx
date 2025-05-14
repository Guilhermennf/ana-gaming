import AuthCheck from '@/components/AuthCheck/AuthCheck';

export default function SportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthCheck>{children}</AuthCheck>;
}
