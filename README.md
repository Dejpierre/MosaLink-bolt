# Bento Grid Editor with Stripe Subscriptions

A premium Bento Grid editor with complete Stripe subscription management, freemium model, and advanced features.

## 🚀 Features

### Core Features
- **Drag & Drop Grid Editor**: Create beautiful bento grids with intuitive drag-and-drop
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Apple Music Integration**: Add songs, albums, and artists to your cards
- **Video Backgrounds**: Support for video backgrounds with custom settings
- **Advanced Typography**: 8 font families with customizable weights and sizes
- **Custom Colors**: Full color picker with preset options
- **Export/Import**: Save and share your grid configurations

### Subscription Management
- **Freemium Model**: Free plan with upgrade options
- **Stripe Integration**: Complete payment processing with Stripe
- **Plan Enforcement**: Real-time feature restrictions based on subscription
- **Billing Portal**: Customer portal for subscription management
- **Usage Tracking**: Monitor card usage and plan limits
- **Upgrade Prompts**: Smart prompts when users hit plan limits

## 📋 Subscription Plans

### Free Plan (€0/month)
- 3 cards maximum
- Basic grid sizes (1x1, 2x1 only)
- 6 preset colors only
- "Powered by BentoLink" branding
- Basic analytics (total views only)
- Subdomain only (username.bentolink.com)

### Starter Plan (€3.99/month or €39.99/year)
- 25 cards maximum
- All grid sizes (1x1, 2x1, 1x2, 2x2)
- Unlimited custom colors + color picker
- Remove branding
- Advanced analytics (clicks, referrers, devices)
- Custom domain support
- 5 premium themes

### Pro Plan (€8.99/month or €89.99/year)
- Unlimited cards
- A/B testing layouts
- Advanced analytics with funnels
- API access
- White-label complete
- Export/backup features
- Priority support

## 🛠 Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App Configuration
VITE_APP_URL=http://localhost:5173
```

### 2. Stripe Setup

1. **Create Stripe Account**: Sign up at [stripe.com](https://stripe.com)
2. **Get API Keys**: Copy your publishable and secret keys from the Stripe dashboard
3. **Create Products**: Set up your subscription products in Stripe
4. **Configure Webhooks**: Set up webhook endpoints for subscription events
5. **Update Price IDs**: Replace the placeholder price IDs in `src/config/plans.ts`

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

## 🔧 Stripe Configuration

### Required Webhook Events

Configure these webhook events in your Stripe dashboard:

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `customer.subscription.trial_will_end`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `invoice.payment_action_required`
- `customer.subscription.past_due`

### Price IDs Setup

Update the price IDs in `src/config/plans.ts`:

```typescript
stripePriceIds: {
  monthly: 'price_your_monthly_price_id',
  yearly: 'price_your_yearly_price_id'
}
```

## 🏗 Architecture

### Frontend Components
- **PricingTable**: Beautiful pricing page with plan comparison
- **BillingDashboard**: Complete billing management interface
- **UpgradePrompt**: Smart upgrade prompts when hitting limits
- **UsageMeter**: Real-time usage tracking display
- **PlanBadge**: Current plan indicator

### Subscription Management
- **useSubscription**: React hook for subscription state
- **stripeService**: Stripe API integration service
- **planEnforcement**: Middleware for feature restrictions
- **Plan validation**: Real-time feature access control

### Security Features
- **Webhook verification**: Secure webhook signature validation
- **Plan enforcement**: Server-side feature restrictions
- **Payment security**: PCI-compliant payment processing
- **Data protection**: GDPR-compliant data handling

## 🎨 Customization

### Adding New Plans

1. Update `src/config/plans.ts` with new plan configuration
2. Add corresponding Stripe products and prices
3. Update plan enforcement rules in `src/middleware/planEnforcement.ts`
4. Add new plan styling in components

### Custom Features

1. Define feature flags in plan configuration
2. Add enforcement logic in `planEnforcement.ts`
3. Create upgrade prompts for new features
4. Update UI components to respect new restrictions

## 📊 Analytics & Monitoring

### Business Metrics
- Monthly Recurring Revenue (MRR)
- Annual Recurring Revenue (ARR)
- Churn rate tracking
- Plan conversion rates
- Failed payment monitoring

### User Analytics
- Feature usage tracking
- Upgrade conversion funnels
- User engagement metrics
- Support ticket correlation

## 🚀 Deployment

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to your preferred hosting (Vercel, Netlify, etc.)
3. Configure environment variables in production

### Backend Requirements
- Webhook endpoint for Stripe events
- Database for subscription and usage tracking
- User authentication system
- API endpoints for subscription management

## 🔒 Security Considerations

- **PCI Compliance**: Never store payment data directly
- **Webhook Security**: Always verify webhook signatures
- **Plan Enforcement**: Implement server-side restrictions
- **Rate Limiting**: Protect API endpoints from abuse
- **Data Encryption**: Encrypt sensitive user data

## 📞 Support

### Customer Support Features
- **Priority Support**: For Pro plan subscribers
- **Billing Support**: Automated billing issue resolution
- **Feature Requests**: Plan-based feature request handling
- **Documentation**: Comprehensive help documentation

## 🔄 Subscription Lifecycle

### Trial Management
- 7-day free trial for all paid plans
- Trial expiration notifications
- Automatic conversion to paid subscription
- Trial extension capabilities

### Payment Recovery
- Failed payment retry logic
- Dunning management system
- Grace period handling (3 days)
- Automatic downgrade after grace period

### Cancellation Flow
- Retention offers during cancellation
- Data retention policies (30 days)
- Win-back email campaigns
- Reactivation incentives

## 📈 Conversion Optimization

### Upgrade Strategies
- Smart upgrade prompts at feature limits
- Social proof on pricing page
- Limited-time upgrade offers
- Feature previews for higher tiers
- Money-back guarantee messaging

### User Experience
- Smooth payment flows
- Clear value propositions
- Transparent pricing
- Easy plan switching
- Comprehensive billing portal

This implementation provides a complete, production-ready subscription system with all the features needed for a successful SaaS business model.