import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Download, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Settings,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { stripeService } from '../../services/stripeService';
import { useSubscription } from '../../hooks/useSubscription';
import { BillingInfo } from '../../types/subscription';

export const BillingDashboard: React.FC = () => {
  const { subscription, currentPlan, refreshSubscription } = useSubscription();
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (subscription?.stripeCustomerId) {
      fetchBillingInfo();
    }
  }, [subscription]);

  const fetchBillingInfo = async () => {
    if (!subscription?.stripeCustomerId) return;

    try {
      setIsLoading(true);
      setError(null);
      const info = await stripeService.getBillingInfo(subscription.stripeCustomerId);
      setBillingInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch billing info');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    if (!subscription?.stripeCustomerId) return;

    try {
      await stripeService.redirectToPortal(subscription.stripeCustomerId);
    } catch (err) {
      alert('Failed to open billing portal. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'trialing': return 'text-blue-400';
      case 'past_due': return 'text-yellow-400';
      case 'canceled': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'trialing': return Calendar;
      case 'past_due': return AlertCircle;
      case 'canceled': return AlertCircle;
      default: return AlertCircle;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Failed to load billing info</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchBillingInfo}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white font-medium transition-colors"
        >
          Try Again
        </motion.button>
      </div>
    );
  }

  if (!subscription || subscription.planId === 'free') {
    return (
      <div className="text-center py-12">
        <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No billing information</h3>
        <p className="text-gray-400 mb-4">You're currently on the free plan</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/pricing'}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg text-white font-medium transition-all"
        >
          Upgrade Plan
        </motion.button>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(subscription.status);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Subscription Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-white/5 border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Subscription Overview</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleManageBilling}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors"
          >
            <Settings size={16} />
            Manage Billing
            <ExternalLink size={14} />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <StatusIcon size={20} className={getStatusColor(subscription.status)} />
              <span className="font-medium text-white">Status</span>
            </div>
            <p className={`text-lg font-semibold capitalize ${getStatusColor(subscription.status)}`}>
              {subscription.status}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard size={20} className="text-indigo-400" />
              <span className="font-medium text-white">Plan</span>
            </div>
            <p className="text-lg font-semibold text-white">
              {currentPlan.name}
            </p>
            <p className="text-sm text-gray-400">
              €{currentPlan.price[subscription.billingCycle]}/{subscription.billingCycle === 'monthly' ? 'month' : 'year'}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={20} className="text-purple-400" />
              <span className="font-medium text-white">Next Billing</span>
            </div>
            <p className="text-lg font-semibold text-white">
              {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </p>
            {subscription.cancelAtPeriodEnd && (
              <p className="text-sm text-yellow-400">Will cancel</p>
            )}
          </div>
        </div>

        {/* Trial Info */}
        {subscription.status === 'trialing' && subscription.trialEnd && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20"
          >
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Calendar size={16} />
              <span className="font-medium">Free Trial</span>
            </div>
            <p className="text-white">
              Your trial ends on {new Date(subscription.trialEnd).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              You'll be charged €{currentPlan.price[subscription.billingCycle]} after the trial ends.
            </p>
          </motion.div>
        )}

        {/* Past Due Warning */}
        {subscription.status === 'past_due' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20"
          >
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <AlertCircle size={16} />
              <span className="font-medium">Payment Required</span>
            </div>
            <p className="text-white mb-3">
              Your payment failed. Please update your payment method to continue using your subscription.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleManageBilling}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition-colors"
            >
              Update Payment Method
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Payment Methods */}
      {billingInfo?.paymentMethods && billingInfo.paymentMethods.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10"
        >
          <h3 className="text-xl font-bold text-white mb-4">Payment Methods</h3>
          <div className="space-y-3">
            {billingInfo.paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-gray-400" />
                  <div>
                    <p className="text-white font-medium">
                      {method.brand?.toUpperCase()} •••• {method.last4}
                    </p>
                    <p className="text-sm text-gray-400">
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </p>
                  </div>
                </div>
                {method.isDefault && (
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                    Default
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Upcoming Invoice */}
      {billingInfo?.upcomingInvoice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10"
        >
          <h3 className="text-xl font-bold text-white mb-4">Upcoming Invoice</h3>
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div>
              <p className="text-white font-medium">
                €{billingInfo.upcomingInvoice.amount} {billingInfo.upcomingInvoice.currency.toUpperCase()}
              </p>
              <p className="text-sm text-gray-400">
                Due {new Date(billingInfo.upcomingInvoice.periodStart).toLocaleDateString()} - {new Date(billingInfo.upcomingInvoice.periodEnd).toLocaleDateString()}
              </p>
            </div>
            <Calendar size={20} className="text-gray-400" />
          </div>
        </motion.div>
      )}

      {/* Invoice History */}
      {billingInfo?.invoices && billingInfo.invoices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10"
        >
          <h3 className="text-xl font-bold text-white mb-4">Invoice History</h3>
          <div className="space-y-3">
            {billingInfo.invoices.slice(0, 5).map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <div>
                  <p className="text-white font-medium">
                    Invoice #{invoice.number}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(invoice.created).toLocaleDateString()} • €{invoice.amount} {invoice.currency.toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    invoice.status === 'paid' 
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {invoice.status}
                  </span>
                  {invoice.pdfUrl && (
                    <motion.a
                      href={invoice.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <Download size={16} className="text-gray-400" />
                    </motion.a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};