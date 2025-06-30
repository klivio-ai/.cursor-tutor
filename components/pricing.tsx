"use client"

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "€29",
      period: "/month",
      features: ["Up to 5 properties", "Basic analytics", "Email support", "Mobile app access"],
    },
    {
      name: "Professional",
      price: "€79",
      period: "/month",
      features: ["Up to 25 properties", "Advanced analytics", "Priority support", "API access", "Custom reports"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "€199",
      period: "/month",
      features: [
        "Unlimited properties",
        "White-label solution",
        "Dedicated support",
        "Custom integrations",
        "Advanced security",
      ],
    },
  ]

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose the plan that fits your portfolio size and needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl ${plan.popular ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white" : "bg-white border border-slate-200"}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? "text-white" : "text-slate-900"}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center">
                  <span className={`text-4xl font-bold ${plan.popular ? "text-white" : "text-slate-900"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-lg ${plan.popular ? "text-blue-100" : "text-slate-600"}`}>{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <svg
                      className={`w-5 h-5 mr-3 ${plan.popular ? "text-blue-200" : "text-green-500"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className={plan.popular ? "text-blue-100" : "text-slate-600"}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  plan.popular
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
