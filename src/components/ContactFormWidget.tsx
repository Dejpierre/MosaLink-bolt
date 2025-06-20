import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, User, MessageSquare, Check, AlertCircle, X } from 'lucide-react';
import { useStore } from '../store/useStore';

interface ContactFormWidgetProps {
  type?: 'contact' | 'newsletter';
  title?: string;
  description?: string;
  buttonText?: string;
  placeholderText?: string;
  successMessage?: string;
  errorMessage?: string;
  onSubmit?: (data: any) => Promise<boolean>;
  className?: string;
  accentColor?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export const ContactFormWidget: React.FC<ContactFormWidgetProps> = ({
  type = 'contact',
  title,
  description,
  buttonText,
  placeholderText,
  successMessage,
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
  
  // Default values based on type
  const defaultTitle = type === 'contact' ? "Contactez-moi" : "Newsletter";
  const defaultDescription = type === 'contact' 
    ? "Envoyez-moi un message et je vous répondrai dès que possible."
    : "Inscrivez-vous pour recevoir les dernières actualités.";
  const defaultButtonText = type === 'contact' ? "Envoyer" : "S'inscrire";
  const defaultPlaceholder = type === 'contact' ? "Votre message..." : "Votre email...";
  const defaultSuccessMessage = type === 'contact'
    ? "Message envoyé avec succès! Je vous répondrai bientôt."
    : "Merci pour votre inscription!";

  // Use provided values or defaults
  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalButtonText = buttonText || defaultButtonText;
  const finalPlaceholder = placeholderText || defaultPlaceholder;
  const finalSuccessMessage = successMessage || defaultSuccessMessage;
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [emailValue, setEmailValue] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(e.target.value);
    setEmailError(null);
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateContactForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateNewsletterForm = (): boolean => {
    if (!emailValue.trim()) {
      setEmailError('L\'email est requis');
      return false;
    }
    
    if (!validateEmail(emailValue)) {
      setEmailError('Email invalide');
      return false;
    }
    
    return true;
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateContactForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // If onSubmit function is provided, use it
      if (onSubmit) {
        const success = await onSubmit(formData);
        setSubmitStatus(success ? 'success' : 'error');
      } else {
        // Simulate submission for demo
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmitStatus('success');
        
        // Reset form after success
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateNewsletterForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // If onSubmit function is provided, use it
      if (onSubmit) {
        const success = await onSubmit({ email: emailValue });
        setSubmitStatus(success ? 'success' : 'error');
      } else {
        // Simulate submission for demo
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmitStatus('success');
        
        // Reset form after success
        setEmailValue('');
      }
    } catch (error) {
      console.error('Newsletter submission error:', error);
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
      {(finalTitle || finalDescription) && (
        <div className="mb-4">
          {finalTitle && <h3 className="text-xl font-semibold mb-2" style={{ color: getTextColor() }}>{finalTitle}</h3>}
          {finalDescription && <p className="text-sm" style={{ color: getTextColor(), opacity: 0.8 }}>{finalDescription}</p>}
        </div>
      )}
      
      {/* Status Messages */}
      <AnimatePresence>
        {submitStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-lg flex items-start gap-3 ${
              submitStatus === 'success' 
                ? 'bg-green-500/10 border border-green-500/20' 
                : 'bg-red-500/10 border border-red-500/20'
            }`}
          >
            {submitStatus === 'success' ? (
              <Check size={20} className="text-green-400 flex-shrink-0" />
            ) : (
              <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
            )}
            
            <div className="flex-1">
              <p className={`font-medium ${submitStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {submitStatus === 'success' ? 'Succès!' : 'Erreur'}
              </p>
              <p className="text-sm text-gray-300 mt-1">
                {submitStatus === 'success' ? finalSuccessMessage : errorMessage}
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={resetStatus}
              className={`p-1 rounded-full ${
                submitStatus === 'success' 
                  ? 'hover:bg-green-500/20' 
                  : 'hover:bg-red-500/20'
              }`}
            >
              <X size={16} className={submitStatus === 'success' ? 'text-green-400' : 'text-red-400'} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Form */}
      {type === 'contact' ? (
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: getTextColor() }}>
              <User size={16} className="opacity-80" />
              Nom
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-white/10 border ${
                errors.name ? 'border-red-500/50' : 'border-white/20 focus:border-white/40'
              } focus:outline-none transition-colors text-white`}
              placeholder="Votre nom"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name}</p>
            )}
          </div>
          
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: getTextColor() }}>
              <Mail size={16} className="opacity-80" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-white/10 border ${
                errors.email ? 'border-red-500/50' : 'border-white/20 focus:border-white/40'
              } focus:outline-none transition-colors text-white`}
              placeholder="votre@email.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: getTextColor() }}>
              <MessageSquare size={16} className="opacity-80" />
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-white/10 border ${
                errors.message ? 'border-red-500/50' : 'border-white/20 focus:border-white/40'
              } focus:outline-none transition-colors text-white resize-none`}
              placeholder={finalPlaceholder}
              rows={4}
              disabled={isSubmitting}
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-400">{errors.message}</p>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
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
            ) : (
              <>
                <Send size={16} />
                {finalButtonText}
              </>
            )}
          </motion.button>
        </form>
      ) : (
        <form onSubmit={handleNewsletterSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70" style={{ color: getTextColor() }} />
              <input
                type="email"
                value={emailValue}
                onChange={handleEmailChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border ${
                  emailError ? 'border-red-500/50' : 'border-white/20 focus:border-white/40'
                } focus:outline-none transition-colors text-white`}
                placeholder={finalPlaceholder}
                disabled={isSubmitting || submitStatus === 'success'}
              />
            </div>
            {emailError && (
              <p className="mt-1 text-xs text-red-400">{emailError}</p>
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
            ) : (
              <>
                <Send size={16} />
                {finalButtonText}
              </>
            )}
          </motion.button>
        </form>
      )}
      
      {/* Privacy Note */}
      <p className="text-xs text-center" style={{ color: getTextColor(), opacity: 0.6 }}>
        Nous respectons votre vie privée et ne partagerons jamais vos informations.
      </p>
    </div>
  );
};