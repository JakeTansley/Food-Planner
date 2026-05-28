export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
export type MealType = 'breakfast' | 'lunch' | 'dinner'

export interface Meal {
  id?: string
  week_start: string
  day: Day
  meal_type: MealType
  dish: string
  ingredients: string
  is_leftovers: boolean
  auto_filled: boolean
}
