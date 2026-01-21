# Designer Portfolio Website

A modern, responsive portfolio website for UI/UX designers built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

- **Modern Design**: Clean, minimalist aesthetic with smooth animations and transitions
- **Fully Responsive**: Mobile-first approach ensuring perfect display on all devices
- **Portfolio Gallery**: Filterable project showcase with modal details view
- **Blog System**: Full-featured blog with individual post pages and categories
- **Contact Form**: Interactive contact form with validation
- **SEO Optimized**: Meta tags, OpenGraph support, and semantic HTML
- **Fast Performance**: Static generation for optimal loading speeds
- **TypeScript**: Full type safety throughout the application

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── blog/              # Blog listing and post pages
│   ├── contact/           # Contact page
│   ├── portfolio/         # Portfolio gallery page
│   ├── layout.tsx         # Root layout with header/footer
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   └── Footer.tsx         # Site footer
├── lib/                   # Utilities and data
│   ├── data/             # JSON data files
│   │   ├── projects.json # Portfolio projects
│   │   └── blog-posts.json # Blog posts
│   └── types.ts          # TypeScript type definitions
└── public/               # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📄 Pages

### Home (/)
- Hero section with introduction
- Featured projects showcase
- Skills overview
- Latest blog posts
- Call-to-action section

### Portfolio (/portfolio)
- Grid display of all projects
- Category filtering (UI Design, Web Design, Branding)
- Modal view with detailed project information
- 7 example projects included

### Blog (/blog)
- List of all blog posts with previews
- Category sidebar
- Recent posts widget
- Individual post pages with full content
- 4 example articles included

### About (/about)
- Designer biography and introduction
- Skills with progress indicators
- Tools and technologies used
- Work experience timeline
- Social media links

### Contact (/contact)
- Contact form with validation
- Contact information display
- Social media links
- Location map placeholder

## 🎨 Customization

### Colors

The color scheme uses Tailwind CSS classes. Main colors:
- Primary: Purple (`purple-600`)
- Secondary: Blue (`blue-600`)
- Accent: Pink (`pink-500`)

### Content

#### Projects
Edit `/lib/data/projects.json` to add/modify portfolio projects.

#### Blog Posts
Edit `/lib/data/blog-posts.json` to add/modify blog articles.

#### Personal Information
- Update site metadata in `/app/layout.tsx`
- Modify about page content in `/app/about/page.tsx`
- Update contact information in `/app/contact/page.tsx`

### Fonts

The site uses Google Fonts:
- **Inter**: Body text
- **Playfair Display**: Headings

Modify in `/app/layout.tsx` to change fonts.

## 🏗️ Building for Production

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Deploy with one click

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Digital Ocean
- Self-hosted with Node.js

## 📊 Performance

The site is optimized for performance:
- Static generation for fast page loads
- Optimized images with next/image
- Minimal JavaScript bundle
- CSS purging with Tailwind

Expected Lighthouse scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

## 🛠️ Technologies

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Font Loading**: next/font
- **Image Optimization**: next/image

## 📝 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📧 Contact

For questions or support, reach out at hello@alexmorgan.design

---

Made with ❤️ by Alex Morgan
