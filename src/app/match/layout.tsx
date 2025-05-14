import AuthCheck from '@/components/AuthCheck/AuthCheck';

export default function MatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthCheck>{children}</AuthCheck>;
}
