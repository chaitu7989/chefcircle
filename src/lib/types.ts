export type Role = 'customer' | 'chef' | 'admin'

export type KitchenStatus = 'pending' | 'approved' | 'rejected' | 'suspended'

export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'

export type MealTime = 'breakfast' | 'lunch' | 'dinner'

export type FoodCategory =
  | 'Veg'
  | 'Non Veg'
  | 'Seafood'
  | 'Desserts'
  | 'Snacks'
  | 'Andhra Specials'
  | 'Healthy Meals'
  | 'Breakfast'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: Role
  avatar?: string
  created_at: string
}

export interface Kitchen {
  id: string
  chef_id: string
  name: string
  description: string
  address: string
  area: string
  city: string
  categories: FoodCategory[]
  status: KitchenStatus
  is_online: boolean
  rating: number
  total_orders: number
  profile_photo?: string
  cover_photo?: string
  availability: WeeklyAvailability
  created_at: string
  chef?: User
}

export interface WeeklyAvailability {
  monday: MealTime[]
  tuesday: MealTime[]
  wednesday: MealTime[]
  thursday: MealTime[]
  friday: MealTime[]
  saturday: MealTime[]
  sunday: MealTime[]
}

export interface Dish {
  id: string
  kitchen_id: string
  name: string
  description: string
  price: number
  category: FoodCategory
  image?: string
  is_veg: boolean
  is_available_today: boolean
  quantity_total: number
  quantity_sold: number
  demand_count: number
  group_unlock_target?: number
  created_at: string
}

export interface Order {
  id: string
  customer_id: string
  kitchen_id: string
  items: OrderItem[]
  status: OrderStatus
  total_amount: number
  special_instructions?: string
  created_at: string
  customer?: User
  kitchen?: Kitchen
}

export interface OrderItem {
  dish_id: string
  dish_name: string
  quantity: number
  price: number
}

export interface DemandRequest {
  id: string
  dish_id: string
  customer_id: string
  kitchen_id: string
  created_at: string
}

export interface NotifyRequest {
  id: string
  dish_id: string
  customer_id: string
  created_at: string
}
