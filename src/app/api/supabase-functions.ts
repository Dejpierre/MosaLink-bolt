import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

// Create a Supabase client for server components
export const createServerSupabaseClient = () => {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
};

// Accounting functions for server components

// Get accounts
export async function getAccounts() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .order('code');
  
  if (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
  
  return data;
}

// Get transactions
export async function getTransactions(filters?: any) {
  const supabase = createServerSupabaseClient();
  
  let query = supabase
    .from('transactions')
    .select(`
      *,
      contact:contacts(*),
      payment_method:payment_methods(*),
      currency:currencies(*),
      transaction_items(*)
    `)
    .order('transaction_date', { ascending: false });
  
  if (filters) {
    if (filters.startDate) {
      query = query.gte('transaction_date', filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte('transaction_date', filters.endDate);
    }
    if (filters.type) {
      query = query.eq('transaction_type', filters.type);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.contactId) {
      query = query.eq('contact_id', filters.contactId);
    }
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
  
  return data;
}

// Get transaction by ID
export async function getTransactionById(id: string) {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      contact:contacts(*),
      payment_method:payment_methods(*),
      currency:currencies(*),
      transaction_items(
        *,
        account:accounts(*),
        category:categories(*),
        tax_rate:tax_rates(*)
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching transaction:', error);
    throw error;
  }
  
  return data;
}

// Get categories
export async function getCategories() {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
  
  return data;
}

// Get contacts
export async function getContacts(type?: string) {
  const supabase = createServerSupabaseClient();
  
  let query = supabase
    .from('contacts')
    .select('*')
    .order('name');
  
  if (type) {
    query = query.eq('contact_type', type);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
  
  return data;
}

// Get payment methods
export async function getPaymentMethods() {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
  
  return data;
}

// Get currencies
export async function getCurrencies() {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('currencies')
    .select('*')
    .order('code');
  
  if (error) {
    console.error('Error fetching currencies:', error);
    throw error;
  }
  
  return data;
}

// Get tax rates
export async function getTaxRates() {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('tax_rates')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching tax rates:', error);
    throw error;
  }
  
  return data;
}

// Get fiscal years
export async function getFiscalYears() {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('fiscal_years')
    .select('*')
    .order('start_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching fiscal years:', error);
    throw error;
  }
  
  return data;
}

// Get reports
export async function getReports() {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
  
  return data;
}

// Get trial balance
export async function getTrialBalance(asOfDate: string) {
  const supabase = createServerSupabaseClient();
  
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');
  
  const { data, error } = await supabase.rpc('get_trial_balance', {
    user_uuid: user.user.id,
    as_of_date: asOfDate
  });
  
  if (error) {
    console.error('Error fetching trial balance:', error);
    throw error;
  }
  
  return data;
}

// Get balance sheet
export async function getBalanceSheet(asOfDate: string) {
  const supabase = createServerSupabaseClient();
  
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');
  
  const { data, error } = await supabase.rpc('get_balance_sheet', {
    user_uuid: user.user.id,
    as_of_date: asOfDate
  });
  
  if (error) {
    console.error('Error fetching balance sheet:', error);
    throw error;
  }
  
  return data;
}

// Get income statement
export async function getIncomeStatement(startDate: string, endDate: string) {
  const supabase = createServerSupabaseClient();
  
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');
  
  const { data, error } = await supabase.rpc('get_income_statement', {
    user_uuid: user.user.id,
    start_date: startDate,
    end_date: endDate
  });
  
  if (error) {
    console.error('Error fetching income statement:', error);
    throw error;
  }
  
  return data;
}

// Get account balance
export async function getAccountBalance(accountId: string, endDate?: string) {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase.rpc('get_account_balance', {
    account_uuid: accountId,
    end_date: endDate || new Date().toISOString().split('T')[0]
  });
  
  if (error) {
    console.error('Error fetching account balance:', error);
    throw error;
  }
  
  return data;
}