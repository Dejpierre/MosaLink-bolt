import { useState, useEffect } from 'react';
import { SUBSCRIPTION_PLANS } from '../config/plans';
import { useStore } from '../store/useStore';

export const useSubscription = () => {
  const { userPlan } = useStore();
  
  // Get the current plan based on the user's plan in the store
  const currentPlan = SUBSCRIPTION_PLANS[userPlan] || SUBSCRIPTION_PLANS.free;
  
  // Mock usage data
  const usage = {
    cardsUsed: 0, // This will be updated dynamically
    lastUpdated: new Date()
  };
  
  // Get the current cards to calculate usage
  const { getCurrentDeviceCards } = useStore();
  const cards = getCurrentDeviceCards();
  
  // Update usage data
  useEffect(() => {
    usage.cardsUsed = cards.length;
  }, [cards]);
  
  // Check if user can add more cards based on their plan
  const canAddCard = cards.length < currentPlan.features.maxCards;
  
  // Check if user can use a specific grid size
  const canUseGridSize = (size: string): boolean => {
    return currentPlan.features.gridSizes.includes(size);
  };
  
  // Check if user can use custom colors
  const canUseCustomColors = currentPlan.features.customColors;
  
  // Check if user has a specific feature
  const hasFeature = (feature: keyof typeof SUBSCRIPTION_PLANS.free.features): boolean => {
    return Boolean(currentPlan.features[feature]);
  };
  
  // Mock subscription data
  const subscription = userPlan !== 'free' ? {
    planId: userPlan,
    status: 'active',
    billingCycle: 'monthly',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    cancelAtPeriodEnd: false
  } : null;
  
  return {
    subscription,
    usage,
    currentPlan,
    isLoading: false,
    error: null,
    canAddCard,
    canUseGridSize,
    canUseCustomColors,
    hasFeature,
    refreshSubscription: async () => {}
  };
};