'use client'

import { useState } from 'react'
import { Search, MapPin, ChefHat } from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = ['Veg', 'Non Veg', 'Seafood', 'Desserts', 'Snacks', 'Andhra Specials', 'Healthy Meals', 'Breakfast']

export default function CustomerPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [onlineOnly, setOnlineOnly] = useState(false)

  // No kitchens yet — real data will come from Supabase
  const kitchens: never[] = []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-stone-500 mb-2">
          <MapPin className="w-4 h-4 text-orange-500" />
          <span>Hyderabad, Telangana</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-800">Browse Kitchens</h1>
        <p className="text-stone-500 mt-1">Discover home-cooked food near you</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 flex items-center gap-3 bg-white border border-stone-200 rounded-2xl px-4 py-3 shadow-sm">
          <Search className="w-4 h-4 text-stone-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search kitchens, dishes, or areas..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 outline-none text-sm text-stone-700 placeholder:text-stone-400 bg-transparent"
          />
        </div>
        <button
          onClick={() => setOnlineOnly(!onlineOnly)}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold border transition-colors ${onlineOnly ? 'bg-green-500 text-white border-green-500' : 'bg-white text-stone-600 border-stone-200 hover:border-green-300'}`}
        >
          <span className={`w-2 h-2 rounded-full ${onlineOnly ? 'bg-white animate-pulse' : 'bg-green-500'}`} />
          Open Now
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8" style={{ scrollbarWidth: 'none' }}>
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${!selectedCategory ? 'bg-orange-500 text-white' : 'bg-white text-stone-600 border border-stone-200 hover:border-orange-300'}`}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${selectedCategory === cat ? 'bg-orange-500 text-white' : 'bg-white text-stone-600 border border-stone-200 hover:border-orange-300'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-3xl border-2 border-dashed border-orange-200 py-24 text-center">
        <div className="text-6xl mb-5">🍽️</div>
        <h3 className="text-xl font-bold text-stone-700 mb-2">No kitchens available yet</h3>
        <p className="text-stone-400 text-sm max-w-sm mx-auto mb-6">
          ChefCircle is just getting started in Hyderabad. Be the first home chef to join and serve your community!
        </p>
        <Link
          href="/chef/register"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-colors"
        >
          <ChefHat className="w-4 h-4" /> Register Your Kitchen
        </Link>
      </div>
    </div>
  )
}
