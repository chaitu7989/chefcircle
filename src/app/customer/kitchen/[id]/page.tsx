'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Star, MapPin, Clock, Bell, Users, ShoppingBag, Plus, Minus, CheckCircle } from 'lucide-react'
import { mockKitchens, mockDishes } from '@/lib/mock-data'
import type { Dish } from '@/lib/types'

interface CartItem { dish: Dish; qty: number }

export default function KitchenDetailPage({ params }: { params: { id: string } }) {
  const kitchen = mockKitchens.find(k => k.id === params.id) || mockKitchens[0]
  const dishes = mockDishes.filter(d => d.kitchen_id === kitchen.id)
  const [cart, setCart] = useState<CartItem[]>([])
  const [demandedDishes, setDemandedDishes] = useState<Set<string>>(new Set())
  const [notifiedDishes, setNotifiedDishes] = useState<Set<string>>(new Set())

  const availableDishes = dishes.filter(d => d.is_available_today)
  const unavailableDishes = dishes.filter(d => !d.is_available_today)

  const addToCart = (dish: Dish) => {
    setCart(prev => {
      const existing = prev.find(i => i.dish.id === dish.id)
      if (existing) return prev.map(i => i.dish.id === dish.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { dish, qty: 1 }]
    })
  }
  const removeFromCart = (dishId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.dish.id === dishId)
      if (existing && existing.qty > 1) return prev.map(i => i.dish.id === dishId ? { ...i, qty: i.qty - 1 } : i)
      return prev.filter(i => i.dish.id !== dishId)
    })
  }
  const getQty = (dishId: string) => cart.find(i => i.dish.id === dishId)?.qty || 0
  const total = cart.reduce((sum, i) => sum + i.dish.price * i.qty, 0)
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0)

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Back */}
      <Link href="/customer" className="inline-flex items-center gap-2 text-stone-500 hover:text-orange-500 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Kitchens
      </Link>

      {/* Cover */}
      <div className="relative h-56 md:h-72 rounded-2xl overflow-hidden bg-stone-100 mb-6">
        {kitchen.cover_photo && <img src={kitchen.cover_photo} alt={kitchen.name} className="w-full h-full object-cover" />}
        <div className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${kitchen.is_online ? 'bg-green-500 text-white' : 'bg-stone-700 text-white'}`}>
          <span className={`w-2 h-2 rounded-full bg-white ${kitchen.is_online ? 'animate-pulse' : ''}`} />
          {kitchen.is_online ? 'Open Now' : 'Currently Offline'}
        </div>
      </div>

      {/* Kitchen Info */}
      <div className="flex items-start gap-4 mb-6">
        <img src={kitchen.chef?.avatar || ''} alt={kitchen.chef?.name} className="w-16 h-16 rounded-2xl border-2 border-orange-100 object-cover" />
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-stone-800">{kitchen.name}</h1>
          <p className="text-stone-500 text-sm mt-0.5">by {kitchen.chef?.name}</p>
          <p className="text-stone-600 text-sm mt-2">{kitchen.description}</p>
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span className="font-bold text-stone-700">{kitchen.rating}</span>
              <span className="text-stone-400 text-xs">({kitchen.total_orders} orders)</span>
            </div>
            <div className="flex items-center gap-1 text-stone-500 text-sm">
              <MapPin className="w-3.5 h-3.5" />
              {kitchen.area}, {kitchen.city}
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {kitchen.categories.map(cat => (
          <span key={cat} className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm font-medium">{cat}</span>
        ))}
      </div>

      {/* Weekly Availability */}
      <div className="bg-white rounded-2xl border border-stone-100 p-5 mb-6">
        <h3 className="font-bold text-stone-700 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-500" /> Weekly Availability
        </h3>
        <div className="grid grid-cols-7 gap-1 text-center">
          {days.map(day => {
            const meals = kitchen.availability[day]
            return (
              <div key={day} className="text-xs">
                <div className="font-semibold text-stone-500 mb-1 capitalize">{day.slice(0, 3)}</div>
                {meals.length === 0
                  ? <div className="text-stone-300">—</div>
                  : meals.map(m => (
                    <div key={m} className="bg-orange-100 text-orange-600 rounded px-1 py-0.5 mb-0.5 capitalize text-xs">{m.slice(0, 1).toUpperCase()}</div>
                  ))
                }
              </div>
            )
          })}
        </div>
        <p className="text-xs text-stone-400 mt-2">B=Breakfast, L=Lunch, D=Dinner</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu */}
        <div className="lg:col-span-2 space-y-6">
          {/* Available Dishes */}
          {availableDishes.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-stone-800 mb-4">Today&apos;s Menu</h2>
              <div className="space-y-3">
                {availableDishes.map(dish => {
                  const qty = getQty(dish.id)
                  const remaining = dish.quantity_total - dish.quantity_sold
                  const soldOut = remaining <= 0
                  return (
                    <div key={dish.id} className="bg-white rounded-2xl border border-stone-100 p-4 flex gap-4">
                      <div className="w-20 h-20 rounded-xl bg-orange-50 flex-shrink-0 overflow-hidden">
                        {dish.image
                          ? <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-stone-800 text-sm">{dish.name}</h3>
                              <span className={`w-3 h-3 rounded-sm border-2 flex-shrink-0 ${dish.is_veg ? 'border-green-600 bg-green-100' : 'border-red-600 bg-red-100'}`} />
                            </div>
                            <p className="text-stone-500 text-xs mt-1 line-clamp-2">{dish.description}</p>
                          </div>
                          <span className="font-bold text-stone-800 text-sm flex-shrink-0">₹{dish.price}</span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="text-xs text-stone-400">
                            {soldOut ? (
                              <span className="text-red-500 font-semibold">Sold Out</span>
                            ) : (
                              <span>{remaining} left</span>
                            )}
                          </div>
                          {!soldOut ? (
                            qty === 0 ? (
                              <button onClick={() => addToCart(dish)} className="px-4 py-1.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
                                Add
                              </button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button onClick={() => removeFromCart(dish.id)} className="w-7 h-7 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center hover:bg-orange-200">
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="font-bold text-stone-800 text-sm w-4 text-center">{qty}</span>
                                <button onClick={() => addToCart(dish)} className="w-7 h-7 bg-orange-500 text-white rounded-lg flex items-center justify-center hover:bg-orange-600">
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Unavailable / Group Unlock Dishes */}
          {unavailableDishes.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-stone-800 mb-4">Request &amp; Unlock</h2>
              <div className="space-y-3">
                {unavailableDishes.map(dish => {
                  const isDemanded = demandedDishes.has(dish.id)
                  const isNotified = notifiedDishes.has(dish.id)
                  const progress = dish.group_unlock_target
                    ? Math.min((dish.demand_count / dish.group_unlock_target) * 100, 100)
                    : null

                  return (
                    <div key={dish.id} className="bg-stone-50 rounded-2xl border border-stone-200 p-4 opacity-80">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-stone-700 text-sm">{dish.name}</h3>
                          <p className="text-stone-400 text-xs mt-1">{dish.description}</p>
                        </div>
                        <span className="font-bold text-stone-500 text-sm">₹{dish.price}</span>
                      </div>

                      {dish.group_unlock_target && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Group Unlock</span>
                            <span>{dish.demand_count}/{dish.group_unlock_target} requests</span>
                          </div>
                          <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
                          </div>
                          <p className="text-xs text-stone-400 mt-1">{dish.group_unlock_target! - dish.demand_count} more requests needed to unlock</p>
                        </div>
                      )}

                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => setDemandedDishes(prev => { const n = new Set(prev); isDemanded ? n.delete(dish.id) : n.add(dish.id); return n })}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${isDemanded ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`}
                        >
                          {isDemanded ? <CheckCircle className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                          {isDemanded ? 'Requested!' : 'Request Dish'}
                        </button>
                        <button
                          onClick={() => setNotifiedDishes(prev => { const n = new Set(prev); isNotified ? n.delete(dish.id) : n.add(dish.id); return n })}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${isNotified ? 'bg-stone-700 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
                        >
                          <Bell className="w-3.5 h-3.5" />
                          {isNotified ? 'Notified' : 'Notify Me'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
              <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-orange-500" /> Your Order
              </h3>
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🛒</div>
                  <p className="text-stone-400 text-sm">Your cart is empty</p>
                  <p className="text-stone-300 text-xs mt-1">Add dishes to get started</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {cart.map(item => (
                      <div key={item.dish.id} className="flex items-center justify-between text-sm">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-stone-700 truncate">{item.dish.name}</p>
                          <p className="text-stone-400 text-xs">₹{item.dish.price} × {item.qty}</p>
                        </div>
                        <span className="font-bold text-stone-800 ml-2">₹{item.dish.price * item.qty}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-stone-100 pt-4 mb-4">
                    <div className="flex justify-between font-bold text-stone-800">
                      <span>Total ({totalItems} items)</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-colors">
                    Place Order
                  </button>
                  <p className="text-xs text-stone-400 text-center mt-2">Pickup or self-arranged delivery</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
