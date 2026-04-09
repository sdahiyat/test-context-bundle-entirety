import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-bold text-xl text-gray-900">NutriTrack</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="btn-primary text-sm px-4 py-2"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
          <span>✨</span>
          <span>AI-Powered Nutrition Tracking</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Track nutrition
          <br />
          <span className="text-primary-600">effortlessly with AI</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Log meals in seconds with AI photo recognition. Get personalised calorie and macro
          targets. Understand your habits with smart insights.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signup" className="btn-primary px-8 py-3 text-base">
            Get Started Free →
          </Link>
          <Link
            href="/auth/login"
            className="btn-secondary px-8 py-3 text-base"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Everything you need to reach your goals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              emoji: '📸',
              title: 'AI Photo Logging',
              description:
                'Snap a photo of your meal and let our AI identify foods and estimate calories automatically.',
            },
            {
              emoji: '📊',
              title: 'Smart Tracking',
              description:
                'Daily calorie and macro summaries with beautiful charts to keep you on track.',
            },
            {
              emoji: '🎯',
              title: 'Personalised Goals',
              description:
                'Calorie and macro targets calculated from your body metrics and goal type using proven equations.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-6 bg-gray-50 rounded-2xl hover:bg-primary-50 transition-colors"
            >
              <div className="text-4xl mb-4">{feature.emoji}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to start tracking?</h2>
        <p className="text-primary-100 mb-8 text-lg">
          Join thousands of users achieving their nutrition goals.
        </p>
        <Link
          href="/auth/signup"
          className="inline-flex items-center bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors"
        >
          Get Started Free →
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm">
        <p>© 2024 NutriTrack. All rights reserved.</p>
      </footer>
    </div>
  )
}
