'use client'

import { useState } from 'react'
import { Users, ChefHat, Package, TrendingUp, CheckCircle, XCircle, Eye, ShieldAlert, Star, MapPin } from 'lucide-react'
import { mockKitchens, mockOrders } from '@/lib/mock-data'
import type { Kitchen, KitchenStatus } from '@/lib/types'

type Tab = 'overview' | 'kitchens' | 'orders'

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('overview')
  const [kitchens, setKitchens] = useState(mockKitchens)
  const [statusFilter, setStatusFilter] = useState<KitchenStatus | 'all'>('all')

  const approveKitchen = (id: string) => setKitchens(prev => prev.map(k => k.id === id ? { ...k, status: 'approved' } : k))
  const rejectKitchen = (id: string) => setKitchens(prev => prev.map(k => k.id === id ? { ...k, status: 'rejected' } : k))
  const suspendKitchen = (id: string) => setKitchens(prev => prev.map(k => k.id === id ? { ...k, status: 'suspended' } : k))

  const stats = {
    totalKitchens: kitchens.length,
    approvedKitchens: kitchens.filter(k => k.status === 'approved').length,
    onlineKitchens: kitchens.filter(k => k.is_online).length,
    totalOrders: mockOrders.length,
    revenue: mockOrders.reduce((s, o) => s + o.total_amount, 0),
    pendingKitchens: kitchens.filter(k => k.status === 'pending').length,
  }

  const filteredKitchens = statusFilter === 'all' ? kitchens : kitchens.filter(k => k.status === statusFilter)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-800">Admin Dashboard</h1>
          <p className="text-stone-500 mt-1">Manage ChefCircle platform</p>
        </div>
        <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-2xl">
          <ShieldAlert className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-semibold text-orange-600">Admin Access</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-stone-200">
        {(['overview', 'kitchens', 'orders'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-semibold capitalize border-b-2 -mb-px transition-colors ${tab === t ? 'border-orange-500 text-orange-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Kitchens', value: stats.totalKitchens, icon: ChefHat, color: 'text-orange-600', bg: 'bg-orange-50' },
              { label: 'Approved Kitchens', value: stats.approvedKitchens, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Online Now', value: stats.onlineKitchens, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Total Revenue', value: `₹${stats.revenue}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Pending Approvals', value: stats.pendingKitchens, icon: ShieldAlert, color: 'text-amber-600', bg: 'bg-amber-50' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-stone-100 p-5">
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div className="text-2xl font-extrabold text-stone-800">{s.value}</div>
                <div className="text-xs text-stone-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Kitchens */}
            <div className="bg-white rounded-2xl border border-stone-100 p-5">
              <h3 className="font-bold text-stone-800 mb-4">Top Kitchens by Orders</h3>
              <div className="space-y-3">
                {[...kitchens].sort((a, b) => b.total_orders - a.total_orders).map((k, i) => (
                  <div key={k.id} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                    <img src={k.chef?.avatar} alt="" className="w-8 h-8 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-700 text-sm truncate">{k.name}</p>
                      <p className="text-xs text-stone-400">{k.area}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-stone-800">{k.total_orders}</p>
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-stone-400">{k.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl border border-stone-100 p-5">
              <h3 className="font-bold text-stone-800 mb-4">Recent Orders</h3>
              {mockOrders.length === 0 ? (
                <p className="text-stone-400 text-sm text-center py-8">No orders yet</p>
              ) : (
                <div className="space-y-3">
                  {mockOrders.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-stone-700">#{order.id.toUpperCase()}</p>
                        <p className="text-xs text-stone-400">{order.kitchen?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-stone-800">₹{order.total_amount}</p>
                        <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                          order.status === 'preparing' ? 'bg-orange-100 text-orange-600' :
                          'bg-stone-100 text-stone-500'
                        }`}>{order.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Kitchens Tab */}
      {tab === 'kitchens' && (
        <div>
          <div className="flex gap-2 mb-6 flex-wrap">
            {(['all', 'pending', 'approved', 'rejected', 'suspended'] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-colors ${statusFilter === s ? 'bg-orange-500 text-white' : 'bg-white text-stone-600 border border-stone-200 hover:border-orange-300'}`}>
                {s} {s !== 'all' && `(${kitchens.filter(k => k.status === s).length})`}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredKitchens.map(kitchen => (
              <div key={kitchen.id} className="bg-white rounded-2xl border border-stone-100 p-5">
                <div className="flex items-start gap-4">
                  <img src={kitchen.chef?.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover border border-stone-100" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h3 className="font-bold text-stone-800">{kitchen.name}</h3>
                        <p className="text-sm text-stone-500">{kitchen.chef?.name} · {kitchen.chef?.phone}</p>
                        <div className="flex items-center gap-1 text-stone-400 text-xs mt-1">
                          <MapPin className="w-3 h-3" /> {kitchen.address}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                          kitchen.status === 'approved' ? 'bg-green-100 text-green-700' :
                          kitchen.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          kitchen.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-stone-100 text-stone-600'
                        }`}>{kitchen.status}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${kitchen.is_online ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                          {kitchen.is_online ? '● Online' : '○ Offline'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {kitchen.categories.map(c => <span key={c} className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded-full">{c}</span>)}
                    </div>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-stone-100 flex-wrap">
                  <button className="flex items-center gap-1.5 px-4 py-2 border border-stone-200 text-stone-600 rounded-xl text-sm font-semibold hover:bg-stone-50">
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                  {kitchen.status !== 'approved' && (
                    <button onClick={() => approveKitchen(kitchen.id)} className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600">
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                  )}
                  {kitchen.status !== 'rejected' && (
                    <button onClick={() => rejectKitchen(kitchen.id)} className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  )}
                  {kitchen.status === 'approved' && (
                    <button onClick={() => suspendKitchen(kitchen.id)} className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600">
                      <ShieldAlert className="w-3.5 h-3.5" /> Suspend
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div>
          {mockOrders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-12 h-12 text-stone-200 mx-auto mb-4" />
              <p className="text-stone-400">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mockOrders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl border border-stone-100 p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <span className="text-lg font-extrabold text-stone-800">#{order.id.toUpperCase()}</span>
                      <p className="text-sm text-stone-500 mt-0.5">From: {order.kitchen?.name}</p>
                      <p className="text-xs text-stone-400">{new Date(order.created_at).toLocaleString('en-IN')}</p>
                    </div>
                    <span className={`text-sm font-bold capitalize px-3 py-1.5 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'preparing' ? 'bg-orange-100 text-orange-700' :
                      'bg-stone-100 text-stone-600'
                    }`}>{order.status}</span>
                  </div>
                  <div className="space-y-1 border-t border-stone-50 pt-3">
                    {order.items.map(item => (
                      <div key={item.dish_id} className="flex justify-between text-sm">
                        <span className="text-stone-600">{item.dish_name} × {item.quantity}</span>
                        <span className="font-medium">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-stone-800 pt-2 border-t border-stone-100">
                      <span>Total</span>
                      <span>₹{order.total_amount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
