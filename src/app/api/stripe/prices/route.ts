import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET() {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not properly configured' },
        { status: 500 }
      );
    }

    // Fetch all active prices from Stripe
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product']
    });

    // Format the prices for the frontend
    const formattedPrices = prices.data.map(price => {
      const product = price.product as Stripe.Product;
      
      return {
        id: price.id,
        productId: price.product,
        productName: product.name,
        description: product.description,
        unitAmount: price.unit_amount,
        currency: price.currency,
        type: price.type,
        interval: price.recurring?.interval,
        intervalCount: price.recurring?.interval_count,
        metadata: price.metadata,
        active: price.active
      };
    });

    return NextResponse.json(formattedPrices);
  } catch (error) {
    console.error('Error fetching prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prices' },
      { status: 500 }
    );
  }
}