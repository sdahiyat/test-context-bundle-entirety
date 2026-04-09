import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero */}
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          NutriTrack
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          AI-powered nutrition tracking. Log meals instantly with photo recognition,
          track your macros, and get personalized insights to reach your health goals.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/foods"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg
                       bg-primary-600 text-white font-semibold hover:bg-primary-700
                       transition-colors shadow-sm"
          >
            Browse Food Database
          </Link>
          <a
            href="#features"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg
                       border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50
                       transition-colors"
          >
            Learn More
          </a>
        </div>

        {/* Features */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="text-3xl mb-3">📸</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Photo Logging</h3>
            <p className="text-gray-600 text-sm">
              Snap a photo of your meal and let our AI identify the foods and estimate
              calories automatically.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Tracking</h3>
            <p className="text-gray-600 text-sm">
              Track calories, protein, carbs, and fats with precision. View your daily
              progress at a glance.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Goals</h3>
            <p className="text-gray-600 text-sm">
              Set custom nutrition targets aligned with your goals — weight loss,
              muscle gain, or maintenance.
            </p>
          </div>
        </div>

        {/* Food database callout */}
        <div className="mt-12 bg-primary-50 rounded-xl border border-primary-100 p-6">
          <h2 className="text-lg font-semibold text-primary-900 mb-2">
            Explore the Food Database
          </h2>
          <p className="text-primary-700 text-sm mb-4">
            Browse and search our library of common foods with full nutritional breakdowns.
          </p>
          <Link
            href="/foods"
            className="inline-flex items-center justify-center px-5 py-2 rounded-lg
                       bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700
                       transition-colors"
          >
            Open Food Database →
          </Link>
        </div>
      </div>
    </main>
  )
}
