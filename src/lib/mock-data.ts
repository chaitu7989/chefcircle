import type { Kitchen, Dish, Order, User } from './types'

export const mockChefs: User[] = [
  { id: 'chef1', name: 'Lakshmi Devi', email: 'lakshmi@mail.com', phone: '9876543210', role: 'chef', avatar: 'https://i.pravatar.cc/150?img=47', created_at: '2024-01-01' },
  { id: 'chef2', name: 'Ravi Kumar', email: 'ravi@mail.com', phone: '9876543211', role: 'chef', avatar: 'https://i.pravatar.cc/150?img=12', created_at: '2024-01-02' },
  { id: 'chef3', name: 'Sunitha Rao', email: 'sunitha@mail.com', phone: '9876543212', role: 'chef', avatar: 'https://i.pravatar.cc/150?img=48', created_at: '2024-01-03' },
  { id: 'chef4', name: 'Venkat Reddy', email: 'venkat@mail.com', phone: '9876543213', role: 'chef', avatar: 'https://i.pravatar.cc/150?img=15', created_at: '2024-01-04' },
]

export const mockKitchens: Kitchen[] = [
  {
    id: 'k1',
    chef_id: 'chef1',
    name: "Lakshmi's Home Kitchen",
    description: 'Authentic Andhra meals cooked with love. Specializing in traditional recipes passed down through generations.',
    address: '12-3-456, Kondapur',
    area: 'Kondapur',
    city: 'Hyderabad',
    categories: ['Veg', 'Andhra Specials', 'Breakfast'],
    status: 'approved',
    is_online: true,
    rating: 4.8,
    total_orders: 234,
    profile_photo: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400',
    cover_photo: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
    availability: {
      monday: ['breakfast', 'lunch'],
      tuesday: ['breakfast', 'lunch'],
      wednesday: ['lunch'],
      thursday: ['breakfast', 'lunch', 'dinner'],
      friday: ['lunch', 'dinner'],
      saturday: ['breakfast', 'lunch', 'dinner'],
      sunday: ['lunch', 'dinner'],
    },
    created_at: '2024-01-01',
    chef: mockChefs[0],
  },
  {
    id: 'k2',
    chef_id: 'chef2',
    name: "Ravi's Biryani House",
    description: 'Best Hyderabadi Biryani in town. Fresh ingredients, authentic dum cooking every day.',
    address: '45-6-789, Madhapur',
    area: 'Madhapur',
    city: 'Hyderabad',
    categories: ['Non Veg', 'Andhra Specials'],
    status: 'approved',
    is_online: true,
    rating: 4.9,
    total_orders: 512,
    profile_photo: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
    cover_photo: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
    availability: {
      monday: ['lunch', 'dinner'],
      tuesday: ['lunch', 'dinner'],
      wednesday: ['lunch', 'dinner'],
      thursday: ['lunch', 'dinner'],
      friday: ['lunch', 'dinner'],
      saturday: ['lunch', 'dinner'],
      sunday: ['lunch', 'dinner'],
    },
    created_at: '2024-01-02',
    chef: mockChefs[1],
  },
  {
    id: 'k3',
    chef_id: 'chef3',
    name: "Sunitha's Seafood Corner",
    description: 'Fresh seafood from Vizag ports. Fish fry, prawn curry, and crab masala like never before.',
    address: '78-9-012, Miyapur',
    area: 'Miyapur',
    city: 'Hyderabad',
    categories: ['Seafood', 'Non Veg'],
    status: 'approved',
    is_online: false,
    rating: 4.7,
    total_orders: 189,
    profile_photo: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400',
    cover_photo: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800',
    availability: {
      monday: [],
      tuesday: ['dinner'],
      wednesday: ['dinner'],
      thursday: ['dinner'],
      friday: ['lunch', 'dinner'],
      saturday: ['lunch', 'dinner'],
      sunday: ['lunch', 'dinner'],
    },
    created_at: '2024-01-03',
    chef: mockChefs[2],
  },
  {
    id: 'k4',
    chef_id: 'chef4',
    name: "Venkat's Sweet World",
    description: 'Traditional Telugu sweets and snacks. Bobbatlu, Pootharekulu, Kakinada Kaja and more.',
    address: '34-5-678, KPHB',
    area: 'KPHB',
    city: 'Hyderabad',
    categories: ['Desserts', 'Snacks'],
    status: 'approved',
    is_online: true,
    rating: 4.6,
    total_orders: 98,
    profile_photo: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400',
    cover_photo: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
    availability: {
      monday: ['breakfast'],
      tuesday: ['breakfast'],
      wednesday: ['breakfast'],
      thursday: ['breakfast'],
      friday: ['breakfast', 'lunch'],
      saturday: ['breakfast', 'lunch'],
      sunday: ['breakfast', 'lunch'],
    },
    created_at: '2024-01-04',
    chef: mockChefs[3],
  },
]

export const mockDishes: Dish[] = [
  // Lakshmi's Kitchen
  { id: 'd1', kitchen_id: 'k1', name: 'Andhra Meals', description: 'Full thali with rice, sambar, rasam, dal, 4 curries, papad, pickle', price: 120, category: 'Andhra Specials', is_veg: true, is_available_today: true, quantity_total: 30, quantity_sold: 18, demand_count: 42, created_at: '2024-01-01' },
  { id: 'd2', kitchen_id: 'k1', name: 'Pulihora', description: 'Tamarind rice with peanuts and curry leaves', price: 60, category: 'Andhra Specials', is_veg: true, is_available_today: true, quantity_total: 20, quantity_sold: 15, demand_count: 28, created_at: '2024-01-01' },
  { id: 'd3', kitchen_id: 'k1', name: 'Bobbatlu', description: 'Sweet flatbread stuffed with jaggery and dal', price: 40, category: 'Desserts', is_veg: true, is_available_today: false, quantity_total: 15, quantity_sold: 0, demand_count: 19, group_unlock_target: 20, created_at: '2024-01-01' },
  { id: 'd4', kitchen_id: 'k1', name: 'Pesarattu', description: 'Green moong dal crepe served with ginger chutney', price: 50, category: 'Breakfast', is_veg: true, is_available_today: true, quantity_total: 25, quantity_sold: 10, demand_count: 15, created_at: '2024-01-01' },

  // Ravi's Biryani
  { id: 'd5', kitchen_id: 'k2', name: 'Chicken Biryani', description: 'Hyderabadi dum biryani with tender chicken, aromatic spices', price: 180, category: 'Non Veg', is_veg: false, is_available_today: true, quantity_total: 50, quantity_sold: 32, demand_count: 89, created_at: '2024-01-02' },
  { id: 'd6', kitchen_id: 'k2', name: 'Mutton Biryani', description: 'Slow-cooked mutton dum biryani, weekend special', price: 250, category: 'Non Veg', is_veg: false, is_available_today: false, quantity_total: 20, quantity_sold: 0, demand_count: 56, group_unlock_target: 20, created_at: '2024-01-02' },
  { id: 'd7', kitchen_id: 'k2', name: 'Chicken Fry Piece Biryani', description: 'Biryani with crispy fried chicken pieces on top', price: 200, category: 'Non Veg', is_veg: false, is_available_today: true, quantity_total: 30, quantity_sold: 22, demand_count: 45, created_at: '2024-01-02' },
  { id: 'd8', kitchen_id: 'k2', name: 'Veg Biryani', description: 'Fragrant basmati rice with fresh vegetables and spices', price: 130, category: 'Veg', is_veg: true, is_available_today: true, quantity_total: 20, quantity_sold: 8, demand_count: 22, created_at: '2024-01-02' },

  // Sunitha's Seafood
  { id: 'd9', kitchen_id: 'k3', name: 'Fish Fry', description: 'Crispy Rohu fish marinated in Andhra spices', price: 160, category: 'Seafood', is_veg: false, is_available_today: true, quantity_total: 25, quantity_sold: 14, demand_count: 38, created_at: '2024-01-03' },
  { id: 'd10', kitchen_id: 'k3', name: 'Prawn Curry', description: 'Juicy prawns in rich coconut and tomato gravy', price: 220, category: 'Seafood', is_veg: false, is_available_today: true, quantity_total: 15, quantity_sold: 9, demand_count: 31, created_at: '2024-01-03' },
  { id: 'd11', kitchen_id: 'k3', name: 'Crab Masala', description: 'Whole crab cooked in spicy Andhra masala', price: 350, category: 'Seafood', is_veg: false, is_available_today: false, quantity_total: 10, quantity_sold: 0, demand_count: 24, group_unlock_target: 10, created_at: '2024-01-03' },

  // Venkat's Sweets
  { id: 'd12', kitchen_id: 'k4', name: 'Pootharekulu', description: 'Paper thin rice starch sheets with sugar and ghee', price: 30, category: 'Desserts', is_veg: true, is_available_today: true, quantity_total: 50, quantity_sold: 22, demand_count: 18, created_at: '2024-01-04' },
  { id: 'd13', kitchen_id: 'k4', name: 'Kakinada Kaja', description: 'Flaky pastry soaked in sugar syrup', price: 25, category: 'Desserts', is_veg: true, is_available_today: true, quantity_total: 40, quantity_sold: 15, demand_count: 12, created_at: '2024-01-04' },
  { id: 'd14', kitchen_id: 'k4', name: 'Chegodilu', description: 'Crispy ring-shaped rice flour snack', price: 20, category: 'Snacks', is_veg: true, is_available_today: true, quantity_total: 60, quantity_sold: 30, demand_count: 9, created_at: '2024-01-04' },
]

export const mockOrders: Order[] = [
  {
    id: 'ord1',
    customer_id: 'cust1',
    kitchen_id: 'k2',
    items: [{ dish_id: 'd5', dish_name: 'Chicken Biryani', quantity: 2, price: 180 }],
    status: 'preparing',
    total_amount: 360,
    created_at: new Date().toISOString(),
    kitchen: mockKitchens[1],
  },
  {
    id: 'ord2',
    customer_id: 'cust1',
    kitchen_id: 'k1',
    items: [
      { dish_id: 'd1', dish_name: 'Andhra Meals', quantity: 1, price: 120 },
      { dish_id: 'd4', dish_name: 'Pesarattu', quantity: 2, price: 50 },
    ],
    status: 'delivered',
    total_amount: 220,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    kitchen: mockKitchens[0],
  },
]

export const foodCategories = [
  'Veg', 'Non Veg', 'Seafood', 'Desserts', 'Snacks', 'Andhra Specials', 'Healthy Meals', 'Breakfast'
] as const

export const popularDishes = [
  { name: 'Chicken Biryani', requests: 89, icon: '🍗' },
  { name: 'Andhra Meals', requests: 42, icon: '🍱' },
  { name: 'Fish Fry', requests: 38, icon: '🐟' },
  { name: 'Pulihora', requests: 28, icon: '🍚' },
  { name: 'Prawn Curry', requests: 31, icon: '🦐' },
  { name: 'Mutton Biryani', requests: 56, icon: '🥘' },
]
