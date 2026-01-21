import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact - Alex Morgan',
  description: 'Get in touch with Alex Morgan for design projects, collaborations, or just to say hello. Contact form and social media links available.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
