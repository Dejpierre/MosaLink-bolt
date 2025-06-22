export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string
          code: string
          name: string
          description: string | null
          account_type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
          parent_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          description?: string | null
          account_type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
          parent_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          description?: string | null
          account_type?: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
          parent_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string | null
          parent_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color?: string | null
          parent_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string | null
          parent_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      fiscal_years: {
        Row: {
          id: string
          name: string
          start_date: string
          end_date: string
          is_closed: boolean
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          start_date: string
          end_date: string
          is_closed?: boolean
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          start_date?: string
          end_date?: string
          is_closed?: boolean
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      tax_rates: {
        Row: {
          id: string
          name: string
          rate: number
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          rate: number
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          rate?: number
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      currencies: {
        Row: {
          id: string
          code: string
          name: string
          symbol: string
          decimal_places: number
          is_default: boolean
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          symbol: string
          decimal_places?: number
          is_default?: boolean
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          symbol?: string
          decimal_places?: number
          is_default?: boolean
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      contacts: {
        Row: {
          id: string
          name: string
          contact_type: 'customer' | 'vendor' | 'employee' | 'other'
          email: string | null
          phone: string | null
          address: string | null
          tax_number: string | null
          notes: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          contact_type: 'customer' | 'vendor' | 'employee' | 'other'
          email?: string | null
          phone?: string | null
          address?: string | null
          tax_number?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          contact_type?: 'customer' | 'vendor' | 'employee' | 'other'
          email?: string | null
          phone?: string | null
          address?: string | null
          tax_number?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      payment_methods: {
        Row: {
          id: string
          name: string
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      transactions: {
        Row: {
          id: string
          transaction_date: string
          transaction_type: 'income' | 'expense' | 'transfer' | 'journal' | 'invoice' | 'bill' | 'credit_note' | 'debit_note'
          reference_number: string | null
          description: string | null
          contact_id: string | null
          currency_id: string | null
          exchange_rate: number
          total_amount: number
          status: 'draft' | 'posted' | 'void'
          fiscal_year_id: string | null
          payment_method_id: string | null
          due_date: string | null
          is_recurring: boolean
          recurring_pattern: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          transaction_date: string
          transaction_type: 'income' | 'expense' | 'transfer' | 'journal' | 'invoice' | 'bill' | 'credit_note' | 'debit_note'
          reference_number?: string | null
          description?: string | null
          contact_id?: string | null
          currency_id?: string | null
          exchange_rate?: number
          total_amount: number
          status: 'draft' | 'posted' | 'void'
          fiscal_year_id?: string | null
          payment_method_id?: string | null
          due_date?: string | null
          is_recurring?: boolean
          recurring_pattern?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          transaction_date?: string
          transaction_type?: 'income' | 'expense' | 'transfer' | 'journal' | 'invoice' | 'bill' | 'credit_note' | 'debit_note'
          reference_number?: string | null
          description?: string | null
          contact_id?: string | null
          currency_id?: string | null
          exchange_rate?: number
          total_amount?: number
          status?: 'draft' | 'posted' | 'void'
          fiscal_year_id?: string | null
          payment_method_id?: string | null
          due_date?: string | null
          is_recurring?: boolean
          recurring_pattern?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      transaction_items: {
        Row: {
          id: string
          transaction_id: string
          account_id: string
          description: string | null
          amount: number
          quantity: number
          unit_price: number | null
          tax_rate_id: string | null
          tax_amount: number | null
          category_id: string | null
          is_debit: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          transaction_id: string
          account_id: string
          description?: string | null
          amount: number
          quantity?: number
          unit_price?: number | null
          tax_rate_id?: string | null
          tax_amount?: number | null
          category_id?: string | null
          is_debit: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          transaction_id?: string
          account_id?: string
          description?: string | null
          amount?: number
          quantity?: number
          unit_price?: number | null
          tax_rate_id?: string | null
          tax_amount?: number | null
          category_id?: string | null
          is_debit?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          name: string
          report_type: 'balance_sheet' | 'income_statement' | 'cash_flow' | 'trial_balance' | 'tax_summary' | 'custom'
          parameters: Json | null
          is_favorite: boolean
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          report_type: 'balance_sheet' | 'income_statement' | 'cash_flow' | 'trial_balance' | 'tax_summary' | 'custom'
          parameters?: Json | null
          is_favorite?: boolean
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          report_type?: 'balance_sheet' | 'income_statement' | 'cash_flow' | 'trial_balance' | 'tax_summary' | 'custom'
          parameters?: Json | null
          is_favorite?: boolean
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      budgets: {
        Row: {
          id: string
          name: string
          start_date: string
          end_date: string
          description: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          start_date: string
          end_date: string
          description?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          start_date?: string
          end_date?: string
          description?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      budget_items: {
        Row: {
          id: string
          budget_id: string
          account_id: string
          category_id: string | null
          amount: number
          period: 'monthly' | 'quarterly' | 'yearly'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          budget_id: string
          account_id: string
          category_id?: string | null
          amount: number
          period: 'monthly' | 'quarterly' | 'yearly'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          budget_id?: string
          account_id?: string
          category_id?: string | null
          amount?: number
          period?: 'monthly' | 'quarterly' | 'yearly'
          created_at?: string
          updated_at?: string
        }
      }
      attachments: {
        Row: {
          id: string
          file_name: string
          file_type: string | null
          file_size: number | null
          file_path: string
          entity_type: string
          entity_id: string
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          file_name: string
          file_type?: string | null
          file_size?: number | null
          file_path: string
          entity_type: string
          entity_id: string
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          file_name?: string
          file_type?: string | null
          file_size?: number | null
          file_path?: string
          entity_type?: string
          entity_id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          color: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          color?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          color?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      entity_tags: {
        Row: {
          id: string
          tag_id: string
          entity_type: string
          entity_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          tag_id: string
          entity_type: string
          entity_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          tag_id?: string
          entity_type?: string
          entity_id?: string
          created_at?: string
          user_id?: string
        }
      }
      reconciliations: {
        Row: {
          id: string
          account_id: string
          statement_date: string
          statement_balance: number
          is_reconciled: boolean
          reconciled_at: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          account_id: string
          statement_date: string
          statement_balance: number
          is_reconciled?: boolean
          reconciled_at?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          account_id?: string
          statement_date?: string
          statement_balance?: number
          is_reconciled?: boolean
          reconciled_at?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      reconciliation_items: {
        Row: {
          id: string
          reconciliation_id: string
          transaction_id: string
          is_cleared: boolean
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          reconciliation_id: string
          transaction_id: string
          is_cleared?: boolean
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          reconciliation_id?: string
          transaction_id?: string
          is_cleared?: boolean
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_account_balance: {
        Args: {
          account_uuid: string
          end_date?: string
        }
        Returns: number
      }
      get_trial_balance: {
        Args: {
          user_uuid: string
          as_of_date?: string
        }
        Returns: {
          account_id: string
          account_code: string
          account_name: string
          account_type: string
          debit_amount: number
          credit_amount: number
        }[]
      }
      get_income_statement: {
        Args: {
          user_uuid: string
          start_date: string
          end_date: string
        }
        Returns: {
          account_id: string
          account_code: string
          account_name: string
          account_type: string
          amount: number
        }[]
      }
      get_balance_sheet: {
        Args: {
          user_uuid: string
          as_of_date?: string
        }
        Returns: {
          account_id: string
          account_code: string
          account_name: string
          account_type: string
          amount: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}