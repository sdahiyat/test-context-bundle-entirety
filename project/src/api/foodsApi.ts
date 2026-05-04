/**
 * API client for food search and history requests.
 */

export interface FoodItem {
  id: string;
  name: string;
  brand: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  source?: string;
}

export interface FoodHistoryEntry {
  foodId: string;
  foodName: string;
  lastUsed: string;
  useCount: number;
  typicalQuantity: number;
  typicalUnit: string;
  food: FoodItem | null;
}

export interface CustomFoodData {
  name: string;
  brand?: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
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

export async function searchFoods(query: string): Promise<{ results: FoodItem[] }> {
  const q = encodeURIComponent(query);
  const res = await fetch(`/api/foods/search?q=${q}`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function getRecentFoods(): Promise<{ recent: FoodHistoryEntry[] }> {
  const res = await fetch('/api/foods/recent', { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function getFrequentFoods(): Promise<{ frequent: FoodHistoryEntry[] }> {
  const res = await fetch('/api/foods/frequent', { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function getFood(id: string): Promise<FoodItem> {
  const res = await fetch(`/api/foods/${id}`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function createCustomFood(data: CustomFoodData): Promise<FoodItem> {
  const res = await fetch('/api/foods', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}
