export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  slug: string;
  fullDescription?: string;
  tags?: string[];
  year?: string;
  client?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  author: string;
  content: string;
  excerpt: string;
  image: string;
  category: string;
  readTime?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  message: string;
}
