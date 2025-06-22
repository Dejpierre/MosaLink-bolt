import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { stripe } from '@/lib/stripe';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get the current user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in to access subscription data' },
        { status: 401 }
      );
    }

    // Get subscription data from your database
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (subscriptionError && subscriptionError.code !== 'PGRST116') {
      console.error('Error fetching subscription:', subscriptionError);
      return NextResponse.json(
        { error: 'Failed to fetch subscription data' },
        { status: 500 }
      );
    }

    // If no subscription found, return free plan
    if (!subscriptionData) {
      return NextResponse.json({
        planId: 'free',
        status: 'active',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false
      });
    }

    // If we have Stripe configured and a subscription, get the latest data from Stripe
    if (stripe && subscriptionData.stripe_subscription_id) {
      try {
        const stripeSubscription = await stripe.subscriptions.retrieve(
          subscriptionData.stripe_subscription_id
        );
        
        // Update local data with the latest from Stripe
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            status: stripeSubscription.status,
            current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: stripeSubscription.cancel_at_period_end,
            updated_at: new Date().toISOString()
          })
          .eq('id', subscriptionData.id);
          
        if (updateError) {
          console.error('Error updating subscription:', updateError);
        }
        
        // Return the updated subscription data
        return NextResponse.json({
          id: subscriptionData.id,
          planId: subscriptionData.plan_id,
          status: stripeSubscription.status,
          stripeCustomerId: subscriptionData.stripe_customer_id,
          stripeSubscriptionId: subscriptionData.stripe_subscription_id,
          currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
          currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
          cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
          billingCycle: stripeSubscription.items.data[0]?.plan.interval === 'year' ? 'yearly' : 'monthly'
        });
      } catch (error) {
        console.error('Error retrieving subscription from Stripe:', error);
        // Fall back to database data if Stripe API fails
      }
    }

    // Return subscription data from the database
    return NextResponse.json({
      id: subscriptionData.id,
      planId: subscriptionData.plan_id,
      status: subscriptionData.status,
      stripeCustomerId: subscriptionData.stripe_customer_id,
      stripeSubscriptionId: subscriptionData.stripe_subscription_id,
      currentPeriodStart: subscriptionData.current_period_start,
      currentPeriodEnd: subscriptionData.current_period_end,
      cancelAtPeriodEnd: subscriptionData.cancel_at_period_end,
      billingCycle: subscriptionData.billing_cycle || 'monthly'
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription data' },
      { status: 500 }
    );
  }
}