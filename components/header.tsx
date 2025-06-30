"use client"

import { useState } from "react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="text-xl font-bold text-slate-900">Klivio</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
              Dashboard
            </a>
            <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
              Properties
            </a>
            <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
              Analytics
            </a>
            <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
              Settings
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
