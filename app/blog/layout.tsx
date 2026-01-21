import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Alex Morgan',
  description: 'Read insights, thoughts, and stories about design, creativity, and the digital world from UI/UX designer Alex Morgan.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
