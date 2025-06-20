import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown, ArrowRight } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../../config/plans';
import { stripeService } from '../../services/stripeService';
import { useSubscription } from '../../hooks/useSubscription';

export const PricingTable: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { subscription, currentPlan } = useSubscription();

  const handleUpgrade = async (planId: string) => {
    if (loadingPlan) return;

    // Pour le plan gratuit, pas besoin de Stripe
    if (planId === 'free') {
      alert('Vous êtes déjà sur le plan gratuit !');
      return;
    }

    setLoadingPlan(planId);
    try {
      // Simuler le processus de checkout pour la démo
      console.log('🚀 Simulation du checkout Stripe pour le plan:', planId);
      
      // En production, vous utiliseriez ceci :
      // const plan = SUBSCRIPTION_PLANS[planId];
      // const priceId = plan.stripePriceIds[billingCycle];
      // const { sessionId } = await stripeService.createCheckoutSession(
      //   priceId,
      //   subscription?.stripeCustomerId
      // );
      // await stripeService.redirectToCheckout(sessionId);

      // Pour la démo, on simule un succès après 2 secondes
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`✅ Simulation réussie ! Vous seriez redirigé vers Stripe pour le plan ${SUBSCRIPTION_PLANS[planId].name}`);
      
    } catch (error) {
      console.error('Failed to start checkout:', error);
      alert('Erreur lors du démarrage du checkout. Veuillez réessayer.');
    } finally {
      setLoadingPlan(null);
    }
  };

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
          Choisissez Votre Plan Mosalink
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto"
        >
          Commencez gratuitement et évoluez selon vos besoins. Tous les plans payants incluent un essai gratuit de 7 jours.
        </motion.p>
      </div>

      {/* Billing Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center mb-12"
      >
        <div className="flex items-center gap-4 p-1 bg-white/5 rounded-xl">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-3 rounded-lg font-medium transition-all relative ${
              billingCycle === 'yearly'
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Annuel
            <span className="absolute -top-2 -right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
              Économisez 17%
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
                  : 'border-white/20 bg-white/5'
              } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-white text-sm font-medium">
                    Le Plus Populaire
                  </div>
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan && (
                <div className="absolute -top-4 right-4">
                  <div className="px-3 py-1 bg-green-500 rounded-full text-white text-xs font-medium">
                    Plan Actuel
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${getPlanColor(plan.id)} mb-4`}>
                  <Icon size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">
                    €{billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                  </span>
                  <span className="text-gray-400 ml-2">
                    /{billingCycle === 'monthly' ? 'mois' : 'an'}
                  </span>
                </div>
                {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                  <div className="text-green-400 text-sm">
                    Économisez €{savings} ({percentage}% de réduction)
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Check size={16} className="text-green-400" />
                  <span className="text-gray-300">
                    {plan.features.maxCards === Infinity ? 'Illimité' : plan.features.maxCards} cartes
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Check size={16} className="text-green-400" />
                  <span className="text-gray-300">
                    {plan.features.gridSizes.length} tailles de grille
                  </span>
                </div>

                {plan.features.customColors && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-green-400" />
                    <span className="text-gray-300">Couleurs personnalisées & sélecteur</span>
                  </div>
                )}

                {plan.features.removeBranding && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-green-400" />
                    <span className="text-gray-300">Suppression du branding</span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Check size={16} className="text-green-400" />
                  <span className="text-gray-300">
                    Analytics {plan.features.analytics}
                  </span>
                </div>

                {plan.features.customDomain && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-green-400" />
                    <span className="text-gray-300">Domaine personnalisé</span>
                  </div>
                )}

                {plan.features.themes > 0 && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-green-400" />
                    <span className="text-gray-300">
                      {plan.features.themes === Infinity ? 'Illimité' : plan.features.themes} thèmes premium
                    </span>
                  </div>
                )}

                {plan.features.abTesting && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-green-400" />
                    <span className="text-gray-300">Tests A/B</span>
                  </div>
                )}

                {plan.features.apiAccess && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-green-400" />
                    <span className="text-gray-300">Accès API</span>
                  </div>
                )}

                {plan.features.whiteLabel && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-green-400" />
                    <span className="text-gray-300">Marque blanche</span>
                  </div>
                )}

                {plan.features.exportBackup && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-green-400" />
                    <span className="text-gray-300">Export & sauvegarde</span>
                  </div>
                )}

                {plan.features.prioritySupport && (
                  <div className="flex items-center gap-3">
                    <Check size={16} className="text-green-400" />
                    <span className="text-gray-300">Support prioritaire</span>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleUpgrade(plan.id)}
                disabled={isCurrentPlan || loadingPlan === plan.id}
                className={`w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  isCurrentPlan
                    ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {loadingPlan === plan.id ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isCurrentPlan ? (
                  'Plan Actuel'
                ) : plan.id === 'free' ? (
                  'Commencer'
                ) : (
                  <>
                    Essai Gratuit 7 Jours
                    <ArrowRight size={16} />
                  </>
                )}
              </motion.button>

              {plan.id !== 'free' && !isCurrentPlan && (
                <p className="text-center text-xs text-gray-400 mt-3">
                  Essai gratuit 7 jours • Annulation à tout moment
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
          <h3 className="text-lg font-semibold text-white mb-2">🔒 Paiements Sécurisés avec Stripe</h3>
          <p className="text-gray-400 text-sm">
            Vos paiements sont traités de manière sécurisée par Stripe, leader mondial du paiement en ligne.
            Nous ne stockons jamais vos informations de carte bancaire.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>✅ Chiffrement SSL</span>
            <span>✅ Conforme PCI DSS</span>
            <span>✅ Sécurité bancaire</span>
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
        <h2 className="text-2xl font-bold text-white mb-8">Questions Fréquentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="text-left">
            <h3 className="font-semibold text-white mb-2">Puis-je changer de plan à tout moment ?</h3>
            <p className="text-gray-400 text-sm">
              Oui ! Vous pouvez passer à un plan supérieur ou inférieur à tout moment. Les changements sont calculés au prorata automatiquement.
            </p>
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-white mb-2">Que se passe-t-il si j'annule ?</h3>
            <p className="text-gray-400 text-sm">
              Vos données sont conservées pendant 30 jours après l'annulation. Vous pouvez réactiver votre compte à tout moment pendant cette période.
            </p>
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-white mb-2">Proposez-vous des remboursements ?</h3>
            <p className="text-gray-400 text-sm">
              Oui, nous offrons une garantie de remboursement de 30 jours pour tous les plans payants. Sans questions posées.
            </p>
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-white mb-2">Mes informations de paiement sont-elles sécurisées ?</h3>
            <p className="text-gray-400 text-sm">
              Absolument. Nous utilisons Stripe pour le traitement des paiements, qui est conforme PCI DSS et sécurisé au niveau bancaire.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};