import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 2C5.13 2 2 5.13 2 9s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12.5A5.5 5.5 0 1 1 9 3.5a5.5 5.5 0 0 1 0 11z"
                fill="white"
              />
              <path
                d="M9 5v4l3 1.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xl font-bold text-primary-600">NutriTrack</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="btn-primary text-sm"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-4 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-primary-700">AI-Powered Nutrition Tracking</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Track nutrition{' '}
          <span className="text-primary-600">effortlessly</span>
          <br />
          with the power of AI
        </h1>

        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Log meals in seconds with AI photo recognition. Get personalized insights and reach your
          health goals faster than ever.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth/signup" className="btn-primary text-base px-8 py-3">
            Start tracking for free
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Sign in to your account
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-24 text-left">
          {[
            {
              icon: '📸',
              title: 'AI Photo Logging',
              description:
                'Snap a photo of your meal and our AI instantly identifies foods and estimates calories and macros.',
            },
            {
              icon: '📊',
              title: 'Smart Tracking',
              description:
                'Visualize your daily nutrition with beautiful charts. Track calories, protein, carbs, and fats effortlessly.',
            },
            {
              icon: '🎯',
              title: 'Personalized Goals',
              description:
                'Set custom goals for weight loss, maintenance, or muscle gain. Get AI-powered feedback to stay on track.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-20 bg-primary-600 rounded-3xl p-10 text-white text-center">
          <h2 className="text-3xl font-bold mb-3">Ready to transform your health?</h2>
          <p className="text-primary-100 mb-8 text-lg">
            Join thousands of users tracking their nutrition with NutriTrack.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors"
          >
            Get started — it&apos;s free
          </Link>
        </div>
      </main>
    </div>
  );
}
