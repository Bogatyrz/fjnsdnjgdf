import { notFound } from 'next/navigation';
import Link from 'next/link';
import posts from '@/lib/data/blog-posts.json';

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  
  if (!post) {
    return {};
  }

  return {
    title: `${post.title} - Alex Morgan Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = posts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 2);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-purple-400 via-pink-400 to-blue-500 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center text-white hover:text-purple-100 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>
          <span className="inline-block px-4 py-1 bg-white bg-opacity-20 text-white rounded-full text-sm font-medium mb-4">
            {post.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">
            {post.title}
          </h1>
          <div className="flex items-center text-white text-opacity-90">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold mr-3">
              {post.author.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="font-medium">{post.author}</p>
              <div className="flex items-center text-sm">
                <span>{post.date}</span>
                <span className="mx-2">•</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          {post.content.split('\n').map((paragraph, index) => {
            if (paragraph.startsWith('# ')) {
              return (
                <h1 key={index} className="text-4xl font-bold text-gray-900 mb-6 mt-8 font-serif">
                  {paragraph.replace('# ', '')}
                </h1>
              );
            } else if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="text-3xl font-bold text-gray-900 mb-4 mt-8 font-serif">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            } else if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-2xl font-bold text-gray-900 mb-3 mt-6 font-serif">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            } else if (paragraph.trim() === '') {
              return <div key={index} className="h-4"></div>;
            } else if (paragraph.startsWith('- ')) {
              return (
                <li key={index} className="text-gray-700 leading-relaxed ml-6">
                  {paragraph.replace('- ', '')}
                </li>
              );
            } else {
              return (
                <p key={index} className="text-gray-700 leading-relaxed mb-6">
                  {paragraph}
                </p>
              );
            }
          })}
        </div>

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
          <div className="flex gap-4">
            <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
              Twitter
            </button>
            <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
              LinkedIn
            </button>
            <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
              Facebook
            </button>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="aspect-[16/9] bg-gradient-to-br from-purple-400 to-blue-500 relative">
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                      <span className="text-white text-xl font-bold opacity-50 text-center">{relatedPost.title}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="text-sm text-purple-600 font-medium">{relatedPost.category}</span>
                    <h4 className="text-xl font-bold text-gray-900 mt-2 mb-2 group-hover:text-purple-600 transition-colors">
                      {relatedPost.title}
                    </h4>
                    <p className="text-gray-600 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
