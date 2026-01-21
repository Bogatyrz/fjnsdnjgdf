import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - Alex Morgan',
  description: 'Learn more about Alex Morgan, a passionate UI/UX designer with over 6 years of experience creating beautiful and functional digital experiences.',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
