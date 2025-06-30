"use client"

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Manage Your Properties
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Like a Pro
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Streamline your property management with our comprehensive dashboard. Track revenue, expenses, and
            performance all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold">
              Start Free Trial
            </button>
            <button className="border border-slate-300 text-slate-700 px-8 py-3 rounded-lg hover:bg-slate-50 transition-all duration-200 font-semibold">
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
