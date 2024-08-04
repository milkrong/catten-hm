export interface Expense {
  id: string; // UUID
  user_id: string; // UUID of the user who owns this expense
  description: string;
  amount: number;
  category: string;
  date: string; // ISO 8601 date string (YYYY-MM-DD)
  platform: string;
  created_at: string; // ISO 8601 datetime string
  updated_at: string; // ISO 8601 datetime string
}

// You can also create a type for the form input, which might not include all fields
export type ExpenseInput = Omit<
  Expense,
  'id' | 'user_id' | 'created_at' | 'updated_at'
>;

// If you need a type for the response from Supabase, which might include additional metadata
export interface SupabaseExpenseResponse {
  data: Expense | null;
  error: Error | null;
}

// For bulk operations or queries that return multiple expenses
export interface SupabaseExpensesResponse {
  data: Expense[] | null;
  error: Error | null;
}
