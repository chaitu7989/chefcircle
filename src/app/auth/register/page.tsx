'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChefHat, Eye, EyeOff, UserPlus } from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [done, setDone] = useState(false)

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-10 text-center max-w-sm">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-extrabold text-stone-800 mb-2">Welcome, {name}!</h2>
          <p className="text-stone-500 text-sm mb-6">Your account has been created. Start exploring home-cooked food in Hyderabad.</p>
          <Link href="/customer" className="block w-full py-3 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-colors">
            Browse Kitchens
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-800">Create Account</h1>
          <p className="text-stone-500 mt-1">Join ChefCircle and order authentic home food</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Full Name</label>
              <input type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} required
                className="w-full px-4 py-3 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Phone Number</label>
              <input type="tel" placeholder="10-digit mobile number" value={phone} onChange={e => setPhone(e.target.value)} required
                className="w-full px-4 py-3 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full px-4 py-3 border border-stone-200 rounded-2xl text-sm focus:outline-none focus:border-orange-400 pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="bg-orange-50 rounded-2xl p-3 text-xs text-stone-500">
              By creating an account, you agree to ChefCircle's Terms of Service and Privacy Policy.
            </div>
            <button type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-colors">
              <UserPlus className="w-4 h-4" /> Create Account
            </button>
          </form>

          <p className="text-center text-sm text-stone-400 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-orange-500 font-semibold hover:text-orange-600">Sign in</Link>
          </p>
          <p className="text-center text-sm text-stone-400 mt-2">
            Want to cook and earn?{' '}
            <Link href="/chef/register" className="text-orange-500 font-semibold hover:text-orange-600">Register as Chef</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
