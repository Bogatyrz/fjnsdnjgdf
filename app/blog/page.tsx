import Link from 'next/link';
import posts from '@/lib/data/blog-posts.json';

const categories = Array.from(new Set(posts.map(p => p.category)));

export default function BlogPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 font-serif">Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Insights, thoughts, and stories about design, creativity, and the digital world.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="aspect-[16/9] bg-gradient-to-br from-purple-400 via-pink-400 to-blue-500 relative cursor-pointer">
                      <div className="absolute inset-0 flex items-center justify-center p-8">
                        <span className="text-white text-3xl font-bold opacity-50 text-center">{post.title}</span>
                      </div>
                    </div>
                  </Link>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500">{post.date}</span>
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-purple-600 transition-colors cursor-pointer font-serif">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                          {post.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{post.author}</span>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center"
                      >
                        Read More
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Categories */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-serif">Categories</h3>
                <ul className="space-y-2">
                  {categories.map((category) => {
                    const count = posts.filter(p => p.category === category).length;
                    return (
                      <li key={category}>
                        <button className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-100 hover:text-purple-600 transition-colors flex items-center justify-between">
                          <span>{category}</span>
                          <span className="text-sm text-gray-500">({count})</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Recent Posts */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-serif">Recent Posts</h3>
                <ul className="space-y-4">
                  {posts.slice(0, 3).map((post) => (
                    <li key={post.id}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="block group"
                      >
                        <h4 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors mb-1">
                          {post.title}
                        </h4>
                        <p className="text-sm text-gray-500">{post.date}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2 font-serif">Newsletter</h3>
                <p className="text-purple-100 mb-4 text-sm">
                  Get the latest posts delivered right to your inbox.
                </p>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2 rounded-lg text-gray-900 mb-3 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="w-full bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
