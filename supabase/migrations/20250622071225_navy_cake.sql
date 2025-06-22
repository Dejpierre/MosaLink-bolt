/*
# Accounting Database Schema

1. New Tables
   - `accounts` - Chart of accounts
   - `transactions` - Financial transactions
   - `transaction_items` - Line items for transactions
   - `categories` - Transaction categories
   - `fiscal_years` - Fiscal year periods
   - `tax_rates` - Tax rates for transactions
   - `currencies` - Currency definitions
   - `contacts` - Customers, vendors, and other contacts
   - `payment_methods` - Payment methods
   - `reports` - Saved report configurations

2. Security
   - Enable RLS on all tables
   - Add policies for authenticated users to manage their own data
   - Add policies for admin users to manage all data

3. Changes
   - Initial schema creation
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create accounts table (Chart of Accounts)
CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  parent_id uuid REFERENCES accounts(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(7),
  parent_id uuid REFERENCES categories(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Create fiscal_years table
CREATE TABLE IF NOT EXISTS fiscal_years (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_closed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Create tax_rates table
CREATE TABLE IF NOT EXISTS tax_rates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  rate DECIMAL(10, 4) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Create currencies table
CREATE TABLE IF NOT EXISTS currencies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(3) NOT NULL,
  name VARCHAR(100) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  decimal_places SMALLINT DEFAULT 2,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Create contacts table (customers, vendors, etc.)
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  contact_type VARCHAR(20) NOT NULL CHECK (contact_type IN ('customer', 'vendor', 'employee', 'other')),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  tax_number VARCHAR(50),
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_date DATE NOT NULL,
  transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('income', 'expense', 'transfer', 'journal', 'invoice', 'bill', 'credit_note', 'debit_note')),
  reference_number VARCHAR(50),
  description TEXT,
  contact_id uuid REFERENCES contacts(id),
  currency_id uuid REFERENCES currencies(id),
  exchange_rate DECIMAL(10, 6) DEFAULT 1,
  total_amount DECIMAL(15, 2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'posted', 'void')),
  fiscal_year_id uuid REFERENCES fiscal_years(id),
  payment_method_id uuid REFERENCES payment_methods(id),
  due_date DATE,
  is_recurring BOOLEAN DEFAULT false,
  recurring_pattern VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Create transaction_items table
CREATE TABLE IF NOT EXISTS transaction_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id uuid NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  account_id uuid NOT NULL REFERENCES accounts(id),
  description TEXT,
  amount DECIMAL(15, 2) NOT NULL,
  quantity DECIMAL(15, 2) DEFAULT 1,
  unit_price DECIMAL(15, 2),
  tax_rate_id uuid REFERENCES tax_rates(id),
  tax_amount DECIMAL(15, 2),
  category_id uuid REFERENCES categories(id),
  is_debit BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('balance_sheet', 'income_statement', 'cash_flow', 'trial_balance', 'tax_summary', 'custom')),
  parameters JSONB,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Create budget_items table
CREATE TABLE IF NOT EXISTS budget_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  budget_id uuid NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  account_id uuid NOT NULL REFERENCES accounts(id),
  category_id uuid REFERENCES categories(id),
  amount DECIMAL(15, 2) NOT NULL,
  period VARCHAR(20) NOT NULL CHECK (period IN ('monthly', 'quarterly', 'yearly')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create attachments table for documents
CREATE TABLE IF NOT EXISTS attachments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_size INTEGER,
  file_path TEXT NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id uuid NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL,
  color VARCHAR(7),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Create entity_tags junction table
CREATE TABLE IF NOT EXISTS entity_tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL,
  entity_id uuid NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Create reconciliations table
CREATE TABLE IF NOT EXISTS reconciliations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id uuid NOT NULL REFERENCES accounts(id),
  statement_date DATE NOT NULL,
  statement_balance DECIMAL(15, 2) NOT NULL,
  is_reconciled BOOLEAN DEFAULT false,
  reconciled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Create reconciliation_items table
CREATE TABLE IF NOT EXISTS reconciliation_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  reconciliation_id uuid NOT NULL REFERENCES reconciliations(id) ON DELETE CASCADE,
  transaction_id uuid NOT NULL REFERENCES transactions(id),
  is_cleared BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Enable Row Level Security on all tables
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE fiscal_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE reconciliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reconciliation_items ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for accounts
CREATE POLICY "Users can view their own accounts"
  ON accounts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own accounts"
  ON accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own accounts"
  ON accounts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own accounts"
  ON accounts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS Policies for categories
CREATE POLICY "Users can view their own categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
  ON categories
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS Policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON transactions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON transactions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS Policies for transaction_items
CREATE POLICY "Users can view their own transaction items"
  ON transaction_items
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM transactions
    WHERE transactions.id = transaction_items.transaction_id
    AND transactions.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own transaction items"
  ON transaction_items
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM transactions
    WHERE transactions.id = transaction_items.transaction_id
    AND transactions.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own transaction items"
  ON transaction_items
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM transactions
    WHERE transactions.id = transaction_items.transaction_id
    AND transactions.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM transactions
    WHERE transactions.id = transaction_items.transaction_id
    AND transactions.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own transaction items"
  ON transaction_items
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM transactions
    WHERE transactions.id = transaction_items.transaction_id
    AND transactions.user_id = auth.uid()
  ));

-- Create RLS Policies for contacts
CREATE POLICY "Users can view their own contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own contacts"
  ON contacts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contacts"
  ON contacts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contacts"
  ON contacts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_parent_id ON accounts(parent_id);
CREATE INDEX idx_accounts_account_type ON accounts(account_type);

CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_transaction_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_contact_id ON transactions(contact_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_transaction_type ON transactions(transaction_type);

CREATE INDEX idx_transaction_items_transaction_id ON transaction_items(transaction_id);
CREATE INDEX idx_transaction_items_account_id ON transaction_items(account_id);
CREATE INDEX idx_transaction_items_category_id ON transaction_items(category_id);

CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_contact_type ON contacts(contact_type);

-- Create functions for common operations

-- Function to calculate account balance
CREATE OR REPLACE FUNCTION get_account_balance(account_uuid UUID, end_date DATE DEFAULT CURRENT_DATE)
RETURNS DECIMAL AS $$
DECLARE
  balance DECIMAL(15, 2);
BEGIN
  SELECT COALESCE(SUM(
    CASE WHEN ti.is_debit THEN ti.amount ELSE -ti.amount END
  ), 0) INTO balance
  FROM transaction_items ti
  JOIN transactions t ON ti.transaction_id = t.id
  WHERE ti.account_id = account_uuid
  AND t.transaction_date <= end_date
  AND t.status = 'posted';
  
  RETURN balance;
END;
$$ LANGUAGE plpgsql;

-- Function to get trial balance
CREATE OR REPLACE FUNCTION get_trial_balance(user_uuid UUID, as_of_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
  account_id UUID,
  account_code VARCHAR(20),
  account_name VARCHAR(100),
  account_type VARCHAR(50),
  debit_amount DECIMAL(15, 2),
  credit_amount DECIMAL(15, 2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id AS account_id,
    a.code AS account_code,
    a.name AS account_name,
    a.account_type,
    CASE WHEN SUM(
      CASE WHEN ti.is_debit THEN ti.amount ELSE 0 END
    ) > SUM(
      CASE WHEN NOT ti.is_debit THEN ti.amount ELSE 0 END
    ) THEN 
      SUM(
        CASE WHEN ti.is_debit THEN ti.amount ELSE 0 END
      ) - SUM(
        CASE WHEN NOT ti.is_debit THEN ti.amount ELSE 0 END
      )
    ELSE 0 END AS debit_amount,
    CASE WHEN SUM(
      CASE WHEN NOT ti.is_debit THEN ti.amount ELSE 0 END
    ) > SUM(
      CASE WHEN ti.is_debit THEN ti.amount ELSE 0 END
    ) THEN 
      SUM(
        CASE WHEN NOT ti.is_debit THEN ti.amount ELSE 0 END
      ) - SUM(
        CASE WHEN ti.is_debit THEN ti.amount ELSE 0 END
      )
    ELSE 0 END AS credit_amount
  FROM accounts a
  LEFT JOIN transaction_items ti ON a.id = ti.account_id
  LEFT JOIN transactions t ON ti.transaction_id = t.id AND t.transaction_date <= as_of_date AND t.status = 'posted'
  WHERE a.user_id = user_uuid
  GROUP BY a.id, a.code, a.name, a.account_type
  ORDER BY a.code;
END;
$$ LANGUAGE plpgsql;

-- Function to get income statement
CREATE OR REPLACE FUNCTION get_income_statement(user_uuid UUID, start_date DATE, end_date DATE)
RETURNS TABLE (
  account_id UUID,
  account_code VARCHAR(20),
  account_name VARCHAR(100),
  account_type VARCHAR(50),
  amount DECIMAL(15, 2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id AS account_id,
    a.code AS account_code,
    a.name AS account_name,
    a.account_type,
    COALESCE(SUM(
      CASE 
        WHEN a.account_type = 'revenue' AND NOT ti.is_debit THEN ti.amount
        WHEN a.account_type = 'revenue' AND ti.is_debit THEN -ti.amount
        WHEN a.account_type = 'expense' AND ti.is_debit THEN ti.amount
        WHEN a.account_type = 'expense' AND NOT ti.is_debit THEN -ti.amount
        ELSE 0
      END
    ), 0) AS amount
  FROM accounts a
  LEFT JOIN transaction_items ti ON a.id = ti.account_id
  LEFT JOIN transactions t ON ti.transaction_id = t.id 
    AND t.transaction_date BETWEEN start_date AND end_date 
    AND t.status = 'posted'
  WHERE a.user_id = user_uuid
  AND a.account_type IN ('revenue', 'expense')
  GROUP BY a.id, a.code, a.name, a.account_type
  ORDER BY a.account_type DESC, a.code;
END;
$$ LANGUAGE plpgsql;

-- Function to get balance sheet
CREATE OR REPLACE FUNCTION get_balance_sheet(user_uuid UUID, as_of_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
  account_id UUID,
  account_code VARCHAR(20),
  account_name VARCHAR(100),
  account_type VARCHAR(50),
  amount DECIMAL(15, 2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id AS account_id,
    a.code AS account_code,
    a.name AS account_name,
    a.account_type,
    COALESCE(SUM(
      CASE 
        WHEN a.account_type IN ('asset', 'expense') AND ti.is_debit THEN ti.amount
        WHEN a.account_type IN ('asset', 'expense') AND NOT ti.is_debit THEN -ti.amount
        WHEN a.account_type IN ('liability', 'equity', 'revenue') AND NOT ti.is_debit THEN ti.amount
        WHEN a.account_type IN ('liability', 'equity', 'revenue') AND ti.is_debit THEN -ti.amount
        ELSE 0
      END
    ), 0) AS amount
  FROM accounts a
  LEFT JOIN transaction_items ti ON a.id = ti.account_id
  LEFT JOIN transactions t ON ti.transaction_id = t.id 
    AND t.transaction_date <= as_of_date
    AND t.status = 'posted'
  WHERE a.user_id = user_uuid
  AND a.account_type IN ('asset', 'liability', 'equity')
  GROUP BY a.id, a.code, a.name, a.account_type
  ORDER BY a.account_type, a.code;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_accounts_timestamp
BEFORE UPDATE ON accounts
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_categories_timestamp
BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_fiscal_years_timestamp
BEFORE UPDATE ON fiscal_years
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_tax_rates_timestamp
BEFORE UPDATE ON tax_rates
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_currencies_timestamp
BEFORE UPDATE ON currencies
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_contacts_timestamp
BEFORE UPDATE ON contacts
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_payment_methods_timestamp
BEFORE UPDATE ON payment_methods
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_transactions_timestamp
BEFORE UPDATE ON transactions
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_transaction_items_timestamp
BEFORE UPDATE ON transaction_items
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_reports_timestamp
BEFORE UPDATE ON reports
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_budgets_timestamp
BEFORE UPDATE ON budgets
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_budget_items_timestamp
BEFORE UPDATE ON budget_items
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_attachments_timestamp
BEFORE UPDATE ON attachments
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_tags_timestamp
BEFORE UPDATE ON tags
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_reconciliations_timestamp
BEFORE UPDATE ON reconciliations
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_reconciliation_items_timestamp
BEFORE UPDATE ON reconciliation_items
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Insert default data for new users
CREATE OR REPLACE FUNCTION create_default_accounting_data()
RETURNS TRIGGER AS $$
DECLARE
  default_currency_id UUID;
BEGIN
  -- Create default currency
  INSERT INTO currencies (code, name, symbol, is_default, user_id)
  VALUES ('USD', 'US Dollar', '$', true, NEW.id)
  RETURNING id INTO default_currency_id;
  
  -- Create default categories
  INSERT INTO categories (name, description, user_id) VALUES
    ('Uncategorized', 'Default category for uncategorized transactions', NEW.id),
    ('Salary', 'Income from employment', NEW.id),
    ('Rent', 'Housing expenses', NEW.id),
    ('Utilities', 'Electricity, water, gas, etc.', NEW.id),
    ('Groceries', 'Food and household supplies', NEW.id),
    ('Transportation', 'Car, public transport, etc.', NEW.id),
    ('Entertainment', 'Movies, dining out, etc.', NEW.id),
    ('Healthcare', 'Medical expenses', NEW.id);
  
  -- Create default accounts
  INSERT INTO accounts (code, name, description, account_type, user_id) VALUES
    ('1000', 'Cash', 'Physical cash on hand', 'asset', NEW.id),
    ('1100', 'Bank Account', 'Primary checking account', 'asset', NEW.id),
    ('1200', 'Accounts Receivable', 'Money owed by customers', 'asset', NEW.id),
    ('2000', 'Accounts Payable', 'Money owed to vendors', 'liability', NEW.id),
    ('3000', 'Owner''s Equity', 'Owner''s investment in the business', 'equity', NEW.id),
    ('4000', 'Sales Revenue', 'Income from sales', 'revenue', NEW.id),
    ('5000', 'Cost of Goods Sold', 'Direct costs of products sold', 'expense', NEW.id),
    ('6000', 'Rent Expense', 'Office or retail space rent', 'expense', NEW.id),
    ('6100', 'Utilities Expense', 'Electricity, water, etc.', 'expense', NEW.id),
    ('6200', 'Salaries Expense', 'Employee salaries', 'expense', NEW.id);
  
  -- Create default payment methods
  INSERT INTO payment_methods (name, description, user_id) VALUES
    ('Cash', 'Physical cash payments', NEW.id),
    ('Bank Transfer', 'Direct bank transfers', NEW.id),
    ('Credit Card', 'Credit card payments', NEW.id),
    ('Debit Card', 'Debit card payments', NEW.id),
    ('Check', 'Paper check payments', NEW.id);
  
  -- Create default tax rates
  INSERT INTO tax_rates (name, rate, description, user_id) VALUES
    ('No Tax', 0, 'No tax applied', NEW.id),
    ('Sales Tax', 7.5, 'Standard sales tax', NEW.id),
    ('VAT', 20, 'Value Added Tax', NEW.id);
  
  -- Create current fiscal year
  INSERT INTO fiscal_years (
    name, 
    start_date, 
    end_date, 
    user_id
  ) VALUES (
    EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || ' Fiscal Year',
    DATE_TRUNC('year', CURRENT_DATE)::DATE,
    (DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year - 1 day')::DATE,
    NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set up default data for new users
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION create_default_accounting_data();