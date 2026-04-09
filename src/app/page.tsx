import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🥗</span>
          <span className="font-bold text-xl text-primary-700">NutriTrack</span>
        </div>
        <div className="flex gap-3">
          <Link
            href="/auth/login"
            className="text-sm text-gray-600 hover:text-primary-700 font-medium px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Track nutrition with{' '}
          <span className="text-primary-600">AI-powered</span> ease
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          Log meals effortlessly, understand your diet, and hit your health goals.
          Manual logging or AI photo recognition — your choice.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/auth/signup"
            className="bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-700 transition-colors shadow-lg"
          >
            Start Tracking Free
          </Link>
          <Link
            href="/auth/login"
            className="bg-white text-primary-600 border-2 border-primary-200 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-colors"
          >
            Sign In
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-3 gap-6 text-left">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">📷</div>
            <h3 className="font-bold text-gray-900 mb-2">AI Photo Logging</h3>
            <p className="text-sm text-gray-600">
              Snap a photo of your meal and let AI identify foods and estimate calories automatically.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-bold text-gray-900 mb-2">Smart Tracking</h3>
            <p className="text-sm text-gray-600">
              Track calories, protein, carbs, and fat with real-time progress toward your daily goals.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-bold text-gray-900 mb-2">Personalized Goals</h3>
            <p className="text-sm text-gray-600">
              Set custom targets for weight loss, maintenance, or muscle gain with tailored recommendations.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
