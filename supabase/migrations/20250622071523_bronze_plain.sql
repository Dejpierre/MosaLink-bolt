/*
# Update Transaction Function

This stored procedure updates a transaction and its line items in a single database operation.
It ensures data integrity by using a transaction to make sure all operations succeed or fail together.
*/

CREATE OR REPLACE FUNCTION update_transaction(
  transaction_id UUID,
  transaction_data JSONB,
  transaction_items_data JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  transaction_item JSONB;
  result JSONB;
  user_id UUID;
BEGIN
  -- Get the user_id of the transaction to ensure ownership
  SELECT t.user_id INTO user_id
  FROM transactions t
  WHERE t.id = transaction_id;
  
  -- Check if the transaction exists and belongs to the current user
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Transaction not found or you do not have permission to update it';
  END IF;
  
  IF user_id != auth.uid() THEN
    RAISE EXCEPTION 'You do not have permission to update this transaction';
  END IF;

  -- Start a transaction
  BEGIN
    -- Update the transaction
    UPDATE transactions
    SET
      transaction_date = COALESCE((transaction_data->>'transaction_date')::DATE, transaction_date),
      transaction_type = COALESCE(transaction_data->>'transaction_type', transaction_type),
      reference_number = COALESCE(transaction_data->>'reference_number', reference_number),
      description = COALESCE(transaction_data->>'description', description),
      contact_id = COALESCE((transaction_data->>'contact_id')::UUID, contact_id),
      currency_id = COALESCE((transaction_data->>'currency_id')::UUID, currency_id),
      exchange_rate = COALESCE((transaction_data->>'exchange_rate')::DECIMAL, exchange_rate),
      total_amount = COALESCE((transaction_data->>'total_amount')::DECIMAL, total_amount),
      status = COALESCE(transaction_data->>'status', status),
      fiscal_year_id = COALESCE((transaction_data->>'fiscal_year_id')::UUID, fiscal_year_id),
      payment_method_id = COALESCE((transaction_data->>'payment_method_id')::UUID, payment_method_id),
      due_date = COALESCE((transaction_data->>'due_date')::DATE, due_date),
      is_recurring = COALESCE((transaction_data->>'is_recurring')::BOOLEAN, is_recurring),
      recurring_pattern = COALESCE(transaction_data->>'recurring_pattern', recurring_pattern),
      updated_at = NOW()
    WHERE id = transaction_id;

    -- Delete existing transaction items
    DELETE FROM transaction_items
    WHERE transaction_id = transaction_id;

    -- Insert updated transaction items
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

    -- Return the updated transaction
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