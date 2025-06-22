/*
# Create Transaction Function

This stored procedure creates a transaction and its line items in a single database operation.
It ensures data integrity by using a transaction to make sure all operations succeed or fail together.
*/

CREATE OR REPLACE FUNCTION create_transaction(
  transaction_data JSONB,
  transaction_items_data JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  transaction_id UUID;
  transaction_item JSONB;
  result JSONB;
BEGIN
  -- Start a transaction
  BEGIN
    -- Insert the transaction
    INSERT INTO transactions (
      transaction_date,
      transaction_type,
      reference_number,
      description,
      contact_id,
      currency_id,
      exchange_rate,
      total_amount,
      status,
      fiscal_year_id,
      payment_method_id,
      due_date,
      is_recurring,
      recurring_pattern,
      user_id
    )
    SELECT
      (transaction_data->>'transaction_date')::DATE,
      transaction_data->>'transaction_type',
      transaction_data->>'reference_number',
      transaction_data->>'description',
      (transaction_data->>'contact_id')::UUID,
      (transaction_data->>'currency_id')::UUID,
      COALESCE((transaction_data->>'exchange_rate')::DECIMAL, 1),
      (transaction_data->>'total_amount')::DECIMAL,
      transaction_data->>'status',
      (transaction_data->>'fiscal_year_id')::UUID,
      (transaction_data->>'payment_method_id')::UUID,
      (transaction_data->>'due_date')::DATE,
      COALESCE((transaction_data->>'is_recurring')::BOOLEAN, FALSE),
      transaction_data->>'recurring_pattern',
      auth.uid()
    RETURNING id INTO transaction_id;

    -- Insert transaction items
    FOR transaction_item IN SELECT * FROM jsonb_array_elements(transaction_items_data)
    LOOP
      INSERT INTO transaction_items (
        transaction_id,
        account_id,
        description,
        amount,
        quantity,
        unit_price,
        tax_rate_id,
        tax_amount,
        category_id,
        is_debit
      )
      VALUES (
        transaction_id,
        (transaction_item->>'account_id')::UUID,
        transaction_item->>'description',
        (transaction_item->>'amount')::DECIMAL,
        COALESCE((transaction_item->>'quantity')::DECIMAL, 1),
        (transaction_item->>'unit_price')::DECIMAL,
        (transaction_item->>'tax_rate_id')::UUID,
        (transaction_item->>'tax_amount')::DECIMAL,
        (transaction_item->>'category_id')::UUID,
        (transaction_item->>'is_debit')::BOOLEAN
      );
    END LOOP;

    -- Return the created transaction
    SELECT jsonb_build_object(
      'id', id,
      'transaction_date', transaction_date,
      'transaction_type', transaction_type,
      'reference_number', reference_number,
      'total_amount', total_amount,
      'status', status
    ) INTO result
    FROM transactions
    WHERE id = transaction_id;

    RETURN result;
  EXCEPTION
    WHEN OTHERS THEN
      -- Roll back the transaction on error
      RAISE;
  END;
END;
$$;