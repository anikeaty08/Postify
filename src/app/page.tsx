import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="container relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-fadeIn">
            Share Your Story<br />With The World
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            A modern, minimalist blogging platform designed for writers.
            Create your personal blog in seconds and start publishing today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <Link
              href="/signup"
              className="px-8 py-4 bg-violet-600 text-white rounded-full font-semibold hover:bg-violet-700 transition-all hover:scale-105 shadow-lg shadow-violet-500/25"
            >
              Start Writing - It's Free
            </Link>
            <Link
              href="/explore"
              className="px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all hover:scale-105"
            >
              Explore Posts
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="✍️"
              title="Rich Text Editor"
              description="Write beautifully with our intuitive editor. Support for images, formatting, and more."
            />
            <FeatureCard
              icon="🎨"
              title="Customizable Profile"
              description="Your own personal space. Customize your bio, avatar, and improved brand identity."
            />
            <FeatureCard
              icon="🌍"
              title="Global Reach"
              description="Your posts are SEO-ready and accessible to everyone. build your audience effortlessly."
            />
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="w-full py-20 px-4">
        <div className="container max-w-5xl">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 animate-slideUp">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
            <div className="bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="ml-4 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs text-gray-500 flex-grow max-w-xs">
                postify.app/yourname
              </div>
            </div>
            <div className="aspect-[16/9] bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative">
              {/* Decorative placeholder */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600 text-lg">
                Beautiful Blog Preview
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-8 bg-white dark:bg-black rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-violet-500/50 hover:shadow-lg transition-all duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
