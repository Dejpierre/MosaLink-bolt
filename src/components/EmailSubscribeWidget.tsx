import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Check, AlertCircle, X } from 'lucide-react';
import { useStore } from '../store/useStore';

interface EmailSubscribeWidgetProps {
  title?: string;
  description?: string;
  buttonText?: string;
  placeholder?: string;
  successMessage?: string;
  errorMessage?: string;
  onSubmit?: (email: string) => Promise<boolean>;
  className?: string;
  accentColor?: string;
}

export const EmailSubscribeWidget: React.FC<EmailSubscribeWidgetProps> = ({
  title = "Restez informé",
  description = "Inscrivez-vous à notre newsletter pour recevoir les dernières mises à jour.",
  buttonText = "S'inscrire",
  placeholder = "votre@email.com",
  successMessage = "Merci pour votre inscription!",
  errorMessage = "Une erreur est survenue. Veuillez réessayer.",
  onSubmit,
  className = "",
  accentColor = "#6366f1"
}) => {
  const { profile, userPlan } = useStore();
  
  // Check if we should use company colors (Pro plan only)
  const useCompanyColors = userPlan === 'pro' && profile.type === 'company';
  
  // Get the text color based on subscription and profile type
  const getTextColor = () => {
    if (useCompanyColors && profile.companySecondaryColor) {
      return profile.companySecondaryColor;
    }
    return "#ffffff";
  };
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email.trim()) {
      setError('Veuillez entrer votre email');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Veuillez entrer un email valide');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // If onSubmit function is provided, use it
      if (onSubmit) {
        const success = await onSubmit(email);
        setSubmitStatus(success ? 'success' : 'error');
      } else {
        // Simulate submission for demo
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmitStatus('success');
        
        // Reset form after success
        setEmail('');
      }
    } catch (error) {
      console.error('Email submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetStatus = () => {
    setSubmitStatus('idle');
  };

  // Generate styles based on accent color
  const getGradientStyle = () => {
    return {
      background: `linear-gradient(to right, ${accentColor}, ${adjustColor(accentColor, -20)})`,
      color: getTextColor()
    };
  };

  // Adjust color brightness
  const adjustColor = (color: string, amount: number): string => {
    // Simplified function to adjust color
    // In production, use a library like color-js or tinycolor2
    return color; // Return original color for this demo
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-xl font-semibold mb-2" style={{ color: getTextColor() }}>{title}</h3>}
          {description && <p className="text-sm" style={{ color: getTextColor(), opacity: 0.8 }}>{description}</p>}
        </div>
      )}
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70" style={{ color: getTextColor() }} />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border ${
                error ? 'border-red-500/50' : 'border-white/20 focus:border-white/40'
              } focus:outline-none transition-colors text-white`}
              placeholder={placeholder}
              disabled={isSubmitting || submitStatus === 'success'}
            />
          </div>
          {error && (
            <p className="mt-1 text-xs text-red-400">{error}</p>
          )}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting || submitStatus === 'success'}
          className="w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={getGradientStyle()}
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
              Envoi en cours...
            </>
          ) : submitStatus === 'success' ? (
            <>
              <Check size={16} />
              {successMessage}
            </>
          ) : (
            <>
              <Send size={16} />
              {buttonText}
            </>
          )}
        </motion.button>
      </form>
      
      {/* Privacy Note */}
      <p className="text-xs text-center" style={{ color: getTextColor(), opacity: 0.6 }}>
        Nous respectons votre vie privée et ne partagerons jamais votre email.
      </p>
    </div>
  );
};