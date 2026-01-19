'use client';

import React, { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { postEnquiry } from '../../api/services/services';
import {
  BorderGlowCard,
  BorderGlowCardContent,
  BorderGlowCardHeader,
  BorderGlowCardTitle,
} from '../../components/common/BorderGlowCard';
import AnimatedWrapper from '../../components/common/AnimatedWrapper';
import GradientTextAnimation from '../../components/common/GradientTextAnimation';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
// 1. Import Textarea
import { Textarea } from '../../components/ui/textarea'; 
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

interface ContactFormData {
  full_name: string;
  email_address: string;
  phone_number: string;
  message: string;
}

const GRID_WIDTHS: Record<string, string> = {
  'max-w-xs': 'max-w-xs',
  'max-w-sm': 'max-w-sm',
  'max-w-md': 'max-w-md',
  'max-w-lg': 'max-w-lg',
  'max-w-xl': 'max-w-xl',
  'max-w-2xl': 'max-w-2xl',
  'max-w-3xl': 'max-w-3xl',
  'max-w-4xl': 'max-w-4xl',
  'max-w-5xl': 'max-w-5xl',
  'max-w-6xl': 'max-w-6xl',
  'max-w-7xl': 'max-w-7xl',
  'max-w-full': 'max-w-full',
};

interface ContactFormProps {
  gridTitle?: string;
  gridWidth?: string;
}

const ContactForm = ({ 
  gridTitle = 'Tell us your Story.', 
  gridWidth = 'max-w-6xl' 
}: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ContactFormData>({
    mode: 'onChange',
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await postEnquiry({
        name: data.full_name,
        email: data.email_address,
        phone: data.phone_number,
        message: data.message,
      });

      toast.success('Message Sent', {
        description: "Thank you for contacting us. We'll get back to you soon!",
      });

      setIsSuccess(true);
      reset();
      
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error(error);
      toast.error('Submission Failed', {
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`container mx-auto ${GRID_WIDTHS[gridWidth] || 'max-w-6xl'}`}>
      <BorderGlowCard
        cardColor="bg-gradient-to-b from-[#0a0a0a] to-[#0a0a0a]"
        className="h-full justify-between"
        cardBorderRadius="3xl"
      >
        <BorderGlowCardHeader headerPadding="lg">
          <BorderGlowCardTitle className="text-4xl md:text-5xl">
            <GradientTextAnimation
              textPosition="center"
              delay={0.5}
              yPositionInitial={100}
              blurInitial={10}
              classname="tracking-tight font-normal"
              string={gridTitle}
            />
          </BorderGlowCardTitle>
        </BorderGlowCardHeader>

        <AnimatedWrapper delay={0.5} blurInitial={10}>
          <BorderGlowCardContent className="p-6 pt-0 md:p-8 md:pt-0">
            {isSuccess && (
              <div className="mb-4 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-center text-green-400">
                <strong>We will contact you shortly.</strong>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <AnimatedWrapper delay={0.5} yPositionInitial={60} blurInitial={10}>
                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <Input
                      {...register('full_name', { 
                        required: 'Full name is required',
                        pattern: {
                           value: /^[a-zA-Z\s.]+$/,
                           message: 'Invalid name format'
                        }
                      })}
                      className="h-12 rounded-2xl border-white/10 bg-gradient-to-t from-white/5 text-white placeholder:text-neutral-500 focus-visible:ring-yellow-400"
                      placeholder="Enter your full name"
                    />
                    {errors.full_name && (
                      <p className="px-3.5 text-sm text-red-500 md:px-4">{errors.full_name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <Input
                      {...register('email_address', {
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      type="email"
                      className="h-12 rounded-2xl border-white/10 bg-gradient-to-t from-white/5 text-white placeholder:text-neutral-500 focus-visible:ring-yellow-400"
                      placeholder="Enter your email address"
                    />
                    {errors.email_address && (
                      <p className="px-3.5 text-sm text-red-500 md:px-4">{errors.email_address.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <Input
                      {...register('phone_number', {
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[0-9+\-\s()]*$/,
                          message: 'Invalid phone number',
                        },
                      })}
                      type="tel"
                      inputMode="numeric"
                      className="h-12 rounded-2xl border-white/10 bg-gradient-to-t from-white/5 text-white placeholder:text-neutral-500 focus-visible:ring-yellow-400"
                      placeholder="Enter your phone number"
                    />
                    {errors.phone_number && (
                      <p className="px-3.5 text-sm text-red-500 md:px-4">{errors.phone_number.message}</p>
                    )}
                  </div>

                  {/* Message - Updated with new design */}
                  <div className="space-y-1">
                    <Textarea
                      {...register('message', { required: 'Message is required' })}
                      className="resize-none rounded-2xl bg-gradient-to-t from-white/5 text-white placeholder:text-neutral-500 border-white/10 focus-visible:ring-yellow-400"
                      rows={17}
                      placeholder="Your Message"
                    />
                    {errors.message && (
                      <p className="px-3.5 text-sm text-red-500 md:px-4">{errors.message.message}</p>
                    )}
                  </div>
                </div>
              </AnimatedWrapper>

              {/* Submit Button */}
              <div>
                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="mt-4 h-12 w-full rounded-2xl border border-white/25 bg-yellow-400 text-black hover:bg-yellow-500 md:text-lg font-bold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </BorderGlowCardContent>
        </AnimatedWrapper>
      </BorderGlowCard>
    </div>
  );
};

export default memo(ContactForm);