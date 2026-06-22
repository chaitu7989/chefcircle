'use client'

import { useState } from 'react'
import { CheckCircle, ChefHat, ArrowRight, ArrowLeft, Plus, X } from 'lucide-react'

const STEPS = ['Personal Info', 'Food Type & Dishes', 'Availability', 'Review & Submit']

const FOOD_TYPES = ['Veg', 'Non Veg', 'Egg', 'Seafood']

const SPECIALIZATIONS: Record<string, string[]> = {
  'Veg': ['Andhra Meals', 'Pulihora', 'Sambar Rice', 'Curd Rice', 'Bisibelebath', 'Paneer Dishes', 'Dal', 'Rasam', 'Veg Biryani', 'Upma', 'Pongal'],
  'Non Veg': ['Chicken Biryani', 'Chicken Curry', 'Chicken Fry', 'Mutton Curry', 'Mutton Biryani', 'Egg Curry', 'Keema'],
  'Egg': ['Egg Curry', 'Egg Fried Rice', 'Omelette', 'Egg Bhurji', 'Egg Biryani'],
  'Seafood': ['Fish Fry', 'Fish Curry', 'Prawn Curry', 'Crab Masala', 'Prawn Biryani', 'Rohu Curry'],
}

const EXTRA_SPECIALIZATIONS = ['Desserts / Sweets', 'Snacks', 'Breakfast Items', 'Healthy / Diet Food', 'Telugu Specials', 'Tiffins']

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const
const MEAL_TIMES = ['Breakfast', 'Lunch', 'Dinner'] as const

type Day = typeof DAYS[number]
type MealTime = typeof MEAL_TIMES[number]

type FormData = {
  name: string
  phone: string
  email: string
  address: string
  area: string
  kitchenName: string
  description: string
  foodTypes: string[]
  dishes: string[]
  customDish: string
  availability: Record<Day, MealTime[]>
  isOnline: boolean
}

export default function ChefRegisterPage() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState<FormData>({
    name: '', phone: '', email: '', address: '', area: '', kitchenName: '', description: '',
    foodTypes: [],
    dishes: [],
    customDish: '',
    availability: {
      Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [],
    },
    isOnline: false,
  })

  const toggle = <T extends string>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]

  const toggleFoodType = (type: string) =>
    setForm(p => ({ ...p, foodTypes: toggle(p.foodTypes, type) }))

  const toggleDish = (dish: string) =>
    setForm(p => ({ ...p, dishes: toggle(p.dishes, dish) }))

  const toggleMeal = (day: Day, meal: MealTime) =>
    setForm(p => ({
      ...p,
      availability: { ...p.availability, [day]: toggle(p.availability[day], meal) },
    }))

  const toggleAllMeals = (day: Day) => {
    const all = (p: FormData) => {
      const current = p.availability[day]
      const isAllOn = MEAL_TIMES.every(m => current.includes(m))
      return {
        ...p,
        availability: { ...p.availability, [day]: isAllOn ? [] : [...MEAL_TIMES] },
      }
    }
    setForm(all)
  }

  const addCustomDish = () => {
    const d = form.customDish.trim()
    if (!d || form.dishes.includes(d)) return
    setForm(p => ({ ...p, dishes: [...p.dishes, d], customDish: '' }))
  }

  const canProceed = () => {
    if (step === 0) return form.name && form.phone && form.kitchenName && form.address
    if (step === 1) return form.foodTypes.length > 0 && form.dishes.length > 0
    if (step === 2) return Object.values(form.availability).some(m => m.length > 0)
    return true
  }

  const availableDishes = form.foodTypes.flatMap(t => SPECIALIZATIONS[t] || [])

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-extrabold text-stone-800 mb-2">Application Submitted!</h2>
          <p className="text-stone-500 mb-1">Welcome to ChefCircle, <strong>{form.name}</strong>!</p>
          <p className="text-stone-400 text-sm mb-8">
            Your kitchen <strong>"{form.kitchenName}"</strong> is under review. We will approve within 24–48 hours and notify you on <strong>{form.phone}</strong>.
          </p>
          <div className="bg-orange-50 rounded-2xl p-4 text-left mb-8 space-y-2">
            <p className="text-sm font-semibold text-stone-700">What happens next?</p>
            <p className="text-sm text-stone-500">✅ Admin reviews your profile</p>
            <p className="text-sm text-stone-500">✅ Aadhaar verification</p>
            <p className="text-sm text-stone-500">✅ Kitchen approved and activated</p>
            <p className="text-sm text-stone-500">✅ You go online and start earning!</p>
          </div>
          <a href="/" className="block w-full py-3 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-colors">
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-stone-800">Join ChefCircle</h1>
          <p className="text-stone-500 mt-2">Turn your home kitchen into a business</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-orange-500 text-white' : 'bg-stone-200 text-stone-400'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              {i < STEPS.length - 1 && <div className={`w-10 h-0.5 ${i < step ? 'bg-green-400' : 'bg-stone-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-stone-800 mb-1">Step {step + 1}: {STEPS[step]}</h2>
          <p className="text-stone-400 text-sm mb-6">
            {step === 0 && 'Tell us about you and your kitchen'}
            {step === 1 && 'What do you cook? Select your food type and signature dishes'}
            {step === 2 && 'Set the days and meal times you are available to cook'}
            {step === 3 && 'Review your details before submitting'}
          </p>

          {/* ── STEP 1: Personal Info ── */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">Full Name *</label>
                  <input type="text" placeholder="Your full name" value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">Phone Number *</label>
                  <input type="tel" placeholder="10-digit mobile number" value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">Email Address</label>
                <input type="email" placeholder="your@email.com" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">Kitchen Name *</label>
                  <input type="text" placeholder='e.g. "Lakshmi Home Kitchen"' value={form.kitchenName}
                    onChange={e => setForm(p => ({ ...p, kitchenName: e.target.value }))}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">Area *</label>
                  <input type="text" placeholder='e.g. Kondapur, Madhapur' value={form.area}
                    onChange={e => setForm(p => ({ ...p, area: e.target.value }))}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">Full Address *</label>
                <input type="text" placeholder="Door no, Street, Area, Hyderabad" value={form.address}
                  onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">About Your Kitchen</label>
                <textarea rows={3} placeholder="Tell customers what makes your food special..." value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 resize-none" />
              </div>
            </div>
          )}

          {/* ── STEP 2: Food Type & Dishes ── */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Food Type — like skills */}
              <div>
                <p className="text-sm font-semibold text-stone-700 mb-1">What type of food do you cook? *</p>
                <p className="text-xs text-stone-400 mb-3">Select all that apply — like skills on a resume</p>
                <div className="flex flex-wrap gap-2">
                  {FOOD_TYPES.map(type => {
                    const selected = form.foodTypes.includes(type)
                    return (
                      <button key={type} onClick={() => toggleFoodType(type)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${selected ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-stone-200 text-stone-600 hover:border-orange-300'}`}>
                        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${selected ? 'bg-orange-500 border-orange-500' : 'border-stone-300'}`}>
                          {selected && <span className="text-white text-xs">✓</span>}
                        </span>
                        {type === 'Veg' && '🥦 '}
                        {type === 'Non Veg' && '🍗 '}
                        {type === 'Egg' && '🥚 '}
                        {type === 'Seafood' && '🐟 '}
                        {type}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Dish Specializations */}
              {form.foodTypes.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-stone-700 mb-1">Your Signature Dishes *</p>
                  <p className="text-xs text-stone-400 mb-3">Tap to select dishes you cook best</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {availableDishes.map(dish => {
                      const sel = form.dishes.includes(dish)
                      return (
                        <button key={dish} onClick={() => toggleDish(dish)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${sel ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-stone-600 border-stone-200 hover:border-orange-300 hover:text-orange-600'}`}>
                          {dish}
                        </button>
                      )
                    })}
                  </div>

                  {/* Extra Specializations */}
                  <p className="text-xs text-stone-400 mb-2">Also cook:</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {EXTRA_SPECIALIZATIONS.map(dish => {
                      const sel = form.dishes.includes(dish)
                      return (
                        <button key={dish} onClick={() => toggleDish(dish)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${sel ? 'bg-stone-700 text-white border-stone-700' : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'}`}>
                          {dish}
                        </button>
                      )
                    })}
                  </div>

                  {/* Custom dish input */}
                  <div className="border-t border-stone-100 pt-4">
                    <p className="text-xs text-stone-500 mb-2">Add a dish not listed above:</p>
                    <div className="flex gap-2">
                      <input type="text" placeholder="e.g. Gongura Chicken" value={form.customDish}
                        onChange={e => setForm(p => ({ ...p, customDish: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && addCustomDish()}
                        className="flex-1 px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
                      <button onClick={addCustomDish} className="px-4 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-semibold text-sm">
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Selected Dishes Summary */}
              {form.dishes.length > 0 && (
                <div className="bg-orange-50 rounded-2xl p-4">
                  <p className="text-sm font-semibold text-stone-700 mb-2">{form.dishes.length} dishes selected</p>
                  <div className="flex flex-wrap gap-2">
                    {form.dishes.map(d => (
                      <span key={d} className="flex items-center gap-1 px-2.5 py-1 bg-white border border-orange-200 text-orange-700 rounded-full text-xs font-medium">
                        {d}
                        <button onClick={() => toggleDish(d)} className="ml-1 text-orange-400 hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 3: Availability ── */}
          {step === 2 && (
            <div className="space-y-3">
              <p className="text-xs text-stone-400 mb-4">
                Toggle the meal times you are available each day. Customers will see this schedule on your kitchen page.
              </p>

              {/* Column headers */}
              <div className="flex items-center gap-3 px-1 mb-1">
                <div className="w-24 flex-shrink-0" />
                <div className="flex gap-2 flex-1">
                  {MEAL_TIMES.map(m => (
                    <div key={m} className="flex-1 text-center text-xs font-semibold text-stone-400 uppercase tracking-wide">{m}</div>
                  ))}
                </div>
                <div className="w-16 text-center text-xs font-semibold text-stone-400 uppercase tracking-wide">All Day</div>
              </div>

              {DAYS.map(day => {
                const dayMeals = form.availability[day]
                const allOn = MEAL_TIMES.every(m => dayMeals.includes(m))
                return (
                  <div key={day} className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${dayMeals.length > 0 ? 'bg-orange-50 border-orange-100' : 'bg-stone-50 border-stone-100'}`}>
                    <div className="w-24 flex-shrink-0">
                      <span className="text-sm font-semibold text-stone-700">{day.slice(0, 3)}</span>
                      {dayMeals.length === 0 && <span className="block text-xs text-stone-400">Off</span>}
                    </div>
                    <div className="flex gap-2 flex-1">
                      {MEAL_TIMES.map(meal => {
                        const on = dayMeals.includes(meal)
                        return (
                          <button key={meal} onClick={() => toggleMeal(day, meal)}
                            className="flex-1 relative">
                            <div className={`w-full py-2 rounded-xl text-xs font-semibold transition-all ${on ? 'bg-orange-500 text-white shadow-sm' : 'bg-white text-stone-400 border border-stone-200 hover:border-orange-300'}`}>
                              {on ? '✓' : '—'}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                    {/* All Day toggle */}
                    <button onClick={() => toggleAllMeals(day)} className="w-16 flex justify-center">
                      <div className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${allOn ? 'bg-orange-500' : 'bg-stone-200'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${allOn ? 'left-7' : 'left-1'}`} />
                      </div>
                    </button>
                  </div>
                )
              })}

              <div className="bg-stone-50 rounded-2xl p-3 mt-3 flex gap-4 text-xs text-stone-500">
                <span><strong className="text-orange-500">B</strong> = Breakfast</span>
                <span><strong className="text-orange-500">L</strong> = Lunch</span>
                <span><strong className="text-orange-500">D</strong> = Dinner</span>
                <span>Toggle "All Day" to enable all 3 at once</span>
              </div>
            </div>
          )}

          {/* ── STEP 4: Review ── */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-orange-50 rounded-2xl p-4 space-y-1">
                <p className="font-bold text-stone-700 text-sm mb-2">Personal & Kitchen Info</p>
                <p className="text-sm text-stone-600"><span className="font-medium">Name:</span> {form.name}</p>
                <p className="text-sm text-stone-600"><span className="font-medium">Phone:</span> {form.phone}</p>
                {form.email && <p className="text-sm text-stone-600"><span className="font-medium">Email:</span> {form.email}</p>}
                <p className="text-sm text-stone-600"><span className="font-medium">Kitchen:</span> {form.kitchenName}</p>
                <p className="text-sm text-stone-600"><span className="font-medium">Area:</span> {form.area}</p>
                <p className="text-sm text-stone-600"><span className="font-medium">Address:</span> {form.address}</p>
              </div>

              <div className="bg-orange-50 rounded-2xl p-4">
                <p className="font-bold text-stone-700 text-sm mb-2">Food Types</p>
                <div className="flex flex-wrap gap-2">
                  {form.foodTypes.map(t => <span key={t} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">{t}</span>)}
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-4">
                <p className="font-bold text-stone-700 text-sm mb-2">Dishes ({form.dishes.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {form.dishes.map(d => <span key={d} className="px-2 py-0.5 bg-white border border-orange-200 text-stone-600 rounded-full text-xs">{d}</span>)}
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-4">
                <p className="font-bold text-stone-700 text-sm mb-3">Availability</p>
                <div className="space-y-1.5">
                  {DAYS.map(day => {
                    const meals = form.availability[day]
                    return (
                      <div key={day} className="flex items-center gap-3 text-sm">
                        <span className="w-16 font-medium text-stone-600">{day.slice(0, 3)}</span>
                        {meals.length === 0
                          ? <span className="text-stone-300 text-xs">Not available</span>
                          : <div className="flex gap-1">
                            {meals.map(m => <span key={m} className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">{m}</span>)}
                          </div>
                        }
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-2xl p-3">
                <p className="text-sm text-green-700">✅ By submitting, you agree to ChefCircle's terms. Our team will verify your profile within 24–48 hours.</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-stone-100">
            <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
              className="flex items-center gap-2 px-5 py-2.5 border border-stone-200 rounded-xl text-sm font-semibold text-stone-600 hover:bg-stone-50 disabled:opacity-40 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 disabled:opacity-40 transition-colors">
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={() => setSubmitted(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-600 transition-colors">
                <CheckCircle className="w-4 h-4" /> Submit Application
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
