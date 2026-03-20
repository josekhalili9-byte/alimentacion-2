export interface FoodAnalysis {
  id: string;
  date: string;
  imageUrl: string;
  name: string;
  isHealthy: boolean;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  sugar: number;
  recommendation: 'saludable' | 'moderado' | 'poco saludable';
  healthScore: number; // 1-10
}
