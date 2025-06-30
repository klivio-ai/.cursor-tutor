"use client"

export default function Features() {
  const features = [
    {
      icon: "🏠",
      title: "Property Management",
      description: "Manage all your properties from a single dashboard with detailed insights and analytics.",
    },
    {
      icon: "💰",
      title: "Revenue Tracking",
      description: "Track rental income, deposits, and other revenue streams with automated calculations.",
    },
    {
      icon: "📊",
      title: "Expense Management",
      description: "Monitor maintenance costs, utilities, and other expenses to maximize profitability.",
    },
    {
      icon: "📈",
      title: "Performance Analytics",
      description: "Get detailed reports and insights to make data-driven decisions for your portfolio.",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything You Need</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Powerful features designed to simplify property management and boost your returns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
