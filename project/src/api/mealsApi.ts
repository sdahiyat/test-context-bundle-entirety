/**
 * API client for meal-related requests.
 * Uses fetch with auth headers from localStorage.
 */

export interface MealItem {
  tempId?: string;
  foodId: string;
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Meal {
  id: string;
  userId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  loggedAt: string;
  items: MealItem[];
  notes: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMealData {
  mealType: string;
  loggedAt?: string;
  items: MealItem[];
  notes?: string;
}

export interface MealsListParams {
  startDate?: string;
  endDate?: string;
  mealType?: string;
  page?: number;
  limit?: number;
}

function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('nutritrack_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(data.error || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function getMeals(params: MealsListParams = {}): Promise<{
  meals: Meal[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const query = new URLSearchParams();
  if (params.startDate) query.set('startDate', params.startDate);
  if (params.endDate) query.set('endDate', params.endDate);
  if (params.mealType) query.set('mealType', params.mealType);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  const res = await fetch(`/api/meals?${query.toString()}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function createMeal(mealData: CreateMealData): Promise<Meal> {
  const res = await fetch('/api/meals', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(mealData),
  });
  return handleResponse(res);
}

export async function getMeal(id: string): Promise<Meal> {
  const res = await fetch(`/api/meals/${id}`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function updateMeal(id: string, data: Partial<CreateMealData>): Promise<Meal> {
  const res = await fetch(`/api/meals/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteMeal(id: string): Promise<{ success: boolean; id: string }> {
  const res = await fetch(`/api/meals/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function getDailySummary(
  startDate: string,
  endDate: string
): Promise<{
  summary: Array<{
    date: string;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    totalFiber: number;
    mealCount: number;
  }>;
}> {
  const query = new URLSearchParams({ startDate, endDate });
  const res = await fetch(`/api/meals/summary/daily?${query.toString()}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}
