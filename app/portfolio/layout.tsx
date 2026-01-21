import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio - Alex Morgan',
  description: 'Browse my portfolio of UI/UX design, web design, and branding projects. View detailed case studies and project examples.',
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
