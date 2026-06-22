import Link from 'next/link'
import { Star, MapPin, Clock, Utensils } from 'lucide-react'
import type { Kitchen } from '@/lib/types'

interface KitchenCardProps {
  kitchen: Kitchen
}

export default function KitchenCard({ kitchen }: KitchenCardProps) {
  return (
    <Link href={`/customer/kitchen/${kitchen.id}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-stone-100 hover:-translate-y-1">
        {/* Cover Image */}
        <div className="relative h-44 bg-stone-100">
          {kitchen.cover_photo ? (
            <img src={kitchen.cover_photo} alt={kitchen.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
          )}
          {/* Online/Offline Badge */}
          <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${kitchen.is_online ? 'bg-green-500 text-white' : 'bg-stone-500 text-white'}`}>
            <span className={`w-1.5 h-1.5 rounded-full bg-white ${kitchen.is_online ? 'animate-pulse' : ''}`} />
            {kitchen.is_online ? 'Open Now' : 'Offline'}
          </div>
          {/* Chef Avatar */}
          <div className="absolute -bottom-4 left-4">
            <img
              src={kitchen.chef?.avatar || `https://i.pravatar.cc/150?u=${kitchen.chef_id}`}
              alt={kitchen.chef?.name}
              className="w-10 h-10 rounded-full border-2 border-white shadow"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 pt-6">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-stone-800 text-base leading-tight">{kitchen.name}</h3>
              <p className="text-xs text-stone-500 mt-0.5">{kitchen.chef?.name}</p>
            </div>
            <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg flex-shrink-0">
              <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              <span className="text-xs font-bold text-orange-600">{kitchen.rating}</span>
            </div>
          </div>

          <p className="text-stone-500 text-xs mt-2 line-clamp-2">{kitchen.description}</p>

          {/* Categories */}
          <div className="flex flex-wrap gap-1 mt-3">
            {kitchen.categories.slice(0, 3).map(cat => (
              <span key={cat} className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full text-xs font-medium">
                {cat}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
            <div className="flex items-center gap-1 text-stone-400 text-xs">
              <MapPin className="w-3 h-3" />
              <span>{kitchen.area}</span>
            </div>
            <div className="flex items-center gap-1 text-stone-400 text-xs">
              <Utensils className="w-3 h-3" />
              <span>{kitchen.total_orders} orders</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
