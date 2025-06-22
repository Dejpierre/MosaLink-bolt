'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown, ArrowRight } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../../config/plans';
import { useSubscription } from '../../hooks/useSubscription';
import { CheckoutButton } from './CheckoutButton';

export const PricingTable: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { subscription, currentPlan } = useSubscription();

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return Star;
      case 'starter': return Zap;
      case 'pro': return Crown;
      default: return Star;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'free': return 'from-gray-500 to-gray-600';
      case 'starter': return 'from-indigo-500 to-purple-600';
      case 'pro': return 'from-purple-600 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getYearlySavings = (plan: typeof SUBSCRIPTION_PLANS[keyof typeof SUBSCRIPTION_PLANS]) => {
    const monthlyTotal = plan.price.monthly * 12;
    const yearlyPrice = plan.price.yearly;
    const savings = monthlyTotal - yearlyPrice;
    const percentage = Math.round((savings / monthlyTotal) * 100);
    return { savings, percentage };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4"
        >
          Choose Your Plan
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          Start for free and upgrade as you grow. All paid plans include a 7-day free trial.
        </motion.p>
      </div>

      {/* Billing Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center mb-12"
      >
        <div className="flex items-center gap-4 p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white text-gray-900 shadow-lg'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-3 rounded-lg font-medium transition-all relative ${
              billingCycle === 'yearly'
                ? 'bg-white text-gray-900 shadow-lg'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Yearly
            <span className="absolute -top-2 -right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
              Save 17%
            </span>
          </button>
        </div>
      </motion.div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {Object.values(SUBSCRIPTION_PLANS).map((plan, index) => {
          const Icon = getPlanIcon(plan.id);
          const isCurrentPlan = currentPlan.id === plan.id;
          const { savings, percentage } = getYearlySavings(plan);

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`relative rounded-2xl border-2 p-8 ${
                plan.popular
                  ? 'border-indigo-500 bg-gradient-to-b from-indigo-500/10 to-purple-600/10'
                  : 'border-gray-200 bg-white'
              } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-white text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan && (
                <div className="absolute -top-4 right-4">
                  <div className="px-3 py-1 bg-green-500 rounded-full text-white text-xs font-medium">
                    Current Plan
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${getPlanColor(plan.id)} mb-4`}>
                  <Icon size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    €{billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                  </span>
                  <span className="text-gray-600 ml-2">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                  <div className="text-green-600 text-sm">
                    Save €{savings} ({percentage}% off)
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Check size={16} className="text-green-500" />
                  <span className="text-gray-700">
                    {plan.features.maxCards === Infinity ? 'Unlimited' : plan.features.maxCards} cards
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Check size={16} className="text-green-500" />
                  <span className="text-gray-700">
                    {plan.features.gridSizes.length} grid sizes
                  </span>
                </div>

                {plan.features.customColors && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-green-500" />
                    <span className="text-gray-700">Custom colors & picker</span>
                  </div>
                )}

                {plan.features.removeBranding && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-green-500" />
                    <span className="text-gray-700">Remove branding</span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Check size={16} className="text-green-500" />
                  <span className="text-gray-700">
                    {plan.features.analytics} analytics
                  </span>
                </div>

                {plan.features.customDomain && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-green-500" />
                    <span className="text-gray-700">Custom domain</span>
                  </div>
                )}

                {plan.features.themes > 0 && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-green-500" />
                    <span className="text-gray-700">
                      {plan.features.themes === Infinity ? 'Unlimited' : plan.features.themes} premium themes
                    </span>
                  </div>
                )}

                {plan.features.abTesting && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-green-500" />
                    <span className="text-gray-700">A/B testing</span>
                  </div>
                )}

                {plan.features.apiAccess && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-green-500" />
                    <span className="text-gray-700">API access</span>
                  </div>
                )}

                {plan.features.whiteLabel && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-green-500" />
                    <span className="text-gray-700">White label</span>
                  </div>
                )}

                {plan.features.exportBackup && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-green-500" />
                    <span className="text-gray-700">Export & backup</span>
                  </div>
                )}

                {plan.features.prioritySupport && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-green-500" />
                    <span className="text-gray-700">Priority support</span>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              {isCurrentPlan ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled
                  className="w-full py-4 rounded-xl font-medium bg-green-500/20 text-green-600 cursor-not-allowed"
                >
                  Current Plan
                </motion.button>
              ) : plan.id === 'free' ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl font-medium transition-all bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                  Start for Free
                </motion.button>
              ) : (
                <CheckoutButton
                  priceId={plan.stripePriceIds[billingCycle]}
                  planName={plan.name}
                  className="w-full py-4 rounded-xl"
                >
                  {plan.popular ? (
                    <>
                      <span>Get {plan.name}</span>
                      <ArrowRight size={16} />
                    </>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </CheckoutButton>
              )}

              {plan.id !== 'free' && !isCurrentPlan && (
                <p className="text-center text-xs text-gray-500 mt-3">
                  7-day free trial • Cancel anytime
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Stripe Integration Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-600/10 border border-indigo-500/20"
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">🔒 Secure Payments with Stripe</h3>
          <p className="text-gray-600 text-sm">
            Your payments are securely processed by Stripe, the world's leading online payment processor.
            We never store your credit card information.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>✅ SSL Encryption</span>
            <span>✅ PCI DSS Compliant</span>
            <span>✅ Bank-level Security</span>
          </div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-20 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Can I change plans at any time?</h3>
            <p className="text-gray-600 text-sm">
              Yes! You can upgrade or downgrade your plan at any time. Changes are automatically prorated.
            </p>
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 mb-2">What happens if I cancel?</h3>
            <p className="text-gray-600 text-sm">
              Your data is retained for 30 days after cancellation. You can reactivate your account at any time during this period.
            </p>
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
            <p className="text-gray-600 text-sm">
              Yes, we offer a 30-day money-back guarantee for all paid plans. No questions asked.
            </p>
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Is my payment information secure?</h3>
            <p className="text-gray-600 text-sm">
              Absolutely. We use Stripe for payment processing, which is PCI DSS compliant and bank-level secure.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};