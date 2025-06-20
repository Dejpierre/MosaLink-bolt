import { useState, useEffect } from 'react';
import { Subscription, Usage } from '../types/subscription';
import { SUBSCRIPTION_PLANS } from '../config/plans';

interface UseSubscriptionReturn {
  subscription: Subscription | null;
  usage: Usage | null;
  currentPlan: typeof SUBSCRIPTION_PLANS[keyof typeof SUBSCRIPTION_PLANS];
  isLoading: boolean;
  error: string | null;
  canAddCard: boolean;
  canUseGridSize: (size: string) => boolean;
  canUseCustomColors: boolean;
  hasFeature: (feature: keyof typeof SUBSCRIPTION_PLANS.free.features) => boolean;
  refreshSubscription: () => Promise<void>;
}

export const useSubscription = (): UseSubscriptionReturn => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentPlan = subscription 
    ? SUBSCRIPTION_PLANS[subscription.planId] 
    : SUBSCRIPTION_PLANS.free;

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [subscriptionResponse, usageResponse] = await Promise.all([
        fetch('/api/subscription/current'),
        fetch('/api/subscription/usage')
      ]);

      if (subscriptionResponse.ok) {
        const subscriptionData = await subscriptionResponse.json();
        setSubscription(subscriptionData);
      }

      if (usageResponse.ok) {
        const usageData = await usageResponse.json();
        setUsage(usageData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const canAddCard = usage ? usage.cardsUsed < currentPlan.features.maxCards : true;

  const canUseGridSize = (size: string): boolean => {
    return currentPlan.features.gridSizes.includes(size);
  };

  const canUseCustomColors = currentPlan.features.customColors;

  const hasFeature = (feature: keyof typeof SUBSCRIPTION_PLANS.free.features): boolean => {
    return Boolean(currentPlan.features[feature]);
  };

  return {
    subscription,
    usage,
    currentPlan,
    isLoading,
    error,
    canAddCard,
    canUseGridSize,
    canUseCustomColors,
    hasFeature,
    refreshSubscription: fetchSubscription,
  };
};