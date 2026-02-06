'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowUp, MessageCircle, Phone, Mail, Plus, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const FloatingActionMenu = () => {
  const [showScroll, setShowScroll] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // 1. Get scroll progress (0 to 1)
  const { scrollYProgress } = useScroll();
  
  // 2. Map scroll progress to a rotation or dash offset if needed
  // For a "filling" effect on a circle, we'll use a circular SVG path
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  useEffect(() => {
    const checkScroll = () => {
      // Using window.scrollY as pageYOffset is deprecated
      if (!showScroll && window.scrollY > 400) {
        setShowScroll(true);
      } else if (showScroll && window.scrollY <= 400) {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, [showScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const contactLinks = [
    { 
      icon: MessageCircle, 
      href: "https://wa.me/919048326777", 
      label: "WhatsApp", 
      color: "bg-green-500",
      delay: 0.1 
    },
    { 
      icon: Phone, 
      href: "tel:+919048326777", 
      label: "Call", 
      color: "bg-blue-500",
      delay: 0.2 
    },
    { 
      icon: Mail, 
      href: "mailto:info@yellowtooths.in", 
      label: "Mail", 
      color: "bg-red-500",
      delay: 0.3 
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-center gap-4">
      
      {/* Floating Contact Toggle */}
      <div className="relative flex flex-col items-center">
        <AnimatePresence>
          {isOpen && (
            <div className="mb-4 flex flex-col items-center gap-3">
              {contactLinks.map((link, idx) => (
                <motion.a
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.5 }}
                  transition={{ delay: link.delay }}
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-110",
                    link.color
                  )}
                  title={link.label}
                >
                  <link.icon size={20} />
                </motion.a>
              ))}
            </div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full bg-[#fec52d] text-black shadow-[0_0_20px_rgba(254,197,45,0.4)] transition-all duration-300 hover:scale-110",
            isOpen ? "rotate-45" : "rotate-0"
          )}
        >
          {isOpen ? <X size={28} /> : <Plus size={28} />}
        </button>
      </div>

      {/* Rotating Scroll Top Button with Scroll-Synced Border Fill */}
      <AnimatePresence>
        {showScroll && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-black border border-white/10"
          >
            {/* 3. SVG for Synced Border Fill */}
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
              {/* Background Path (Light gray/transparent) */}
              <circle
                cx="50"
                cy="50"
                r="48"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-white/5"
              />
              {/* Progress Path (Yellow fill) */}
              <motion.circle
                cx="50"
                cy="50"
                r="48"
                stroke="#fec52d"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="301.59" // Circumference of r=48 (2 * pi * 48)
                style={{ pathLength: scrollYProgress }} // Fills as you scroll
              />
            </svg>
            
            {/* The Inner Glow (Glows more on hover) */}
            <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(254,197,45,0.3)] group-hover:shadow-[0_0_25px_rgba(254,197,45,0.6)] transition-all" />
            
            <ArrowUp size={24} className="relative z-10 text-[#fec52d] transition-transform group-hover:-translate-y-1" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActionMenu;