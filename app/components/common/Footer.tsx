'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { postNewsletterSubscription } from '../../api/services/services';
import Logo from "../../../public/Logo/logo_full_size.svg"

import { 
  MapPin, 
  Mail, 
  Phone, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin 
} from 'lucide-react';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterLoading(true);
    setNewsletterStatus('loading');

    try {
      // Assuming postNewsletterSubscription returns { ok: boolean }
      const result: any = await postNewsletterSubscription(newsletterEmail);
      if (result.ok) {
        setNewsletterStatus('success');
        setNewsletterEmail('');
      } else {
        setNewsletterStatus('error');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setNewsletterStatus('error');
    } finally {
      setNewsletterLoading(false);
      // Reset status after 3 seconds
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    }
  };

  return (
    <footer className='footer-main bg-black text-white border-t border-gray-800'>
      <div className="footer-main-container container mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Column 1: Logo & Subscribe */}
          <div className="flex flex-col space-y-6">
            <div>
              <img 
                src={Logo.src}
                alt="Yellowtooths Logo" 
                className="mb-4 w-[150px] h-auto"
              />
              <p className="text-sm text-gray-400 leading-relaxed">
                Crafting compelling narratives and top-notch content with unmatched expertise.
              </p>
            </div>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col space-y-3">
              {newsletterStatus === 'success' ? (
                <div className="p-3 rounded bg-green-900/50 text-green-400 text-center text-sm border border-green-800">
                  Subscribed successfully!
                </div>
              ) : (
                <>
                  <input 
                    type="email" 
                    placeholder='Enter Mail to Subscribe' 
                    className="p-3 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fec52d]"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    disabled={newsletterLoading}
                    required
                  />
                  <button 
                    type="submit"
                    disabled={newsletterLoading}
                    className="bg-[#fec52d] text-black font-semibold py-3 rounded hover:bg-[#eeb115] transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
                  </button>
                  {newsletterStatus === 'error' && (
                    <span className="text-red-400 text-xs">Subscription failed. Please try again.</span>
                  )}
                </>
              )}
            </form>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col space-y-4 px-0 md:px-20">
            <h3 className="text-lg font-bold text-[#fec52d]">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition text-sm">Home</Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition text-sm">About Us</Link>
              </li>
              <li>
                <Link href="/works" className="text-gray-400 hover:text-white transition text-sm">Services</Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-400 hover:text-white transition text-sm">Gallery</Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition text-sm">Blog</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition text-sm">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Our Services */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold text-[#fec52d]">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/works/film-poster-design" className="text-gray-400 hover:text-white transition text-sm">Film Poster Design</Link>
              </li>
              <li>
                <Link href="/works/film-promotion" className="text-gray-400 hover:text-white transition text-sm">Film Promotion</Link>
              </li>
              <li>
                <Link href="/works/branding" className="text-gray-400 hover:text-white transition text-sm">Branding</Link>
              </li>
              <li>
                <Link href="/works/digital-marketing" className="text-gray-400 hover:text-white transition text-sm">Digital Marketing</Link>
              </li>
              <li>
                <Link href="/works/technology-&-experience-design" className="text-gray-400 hover:text-white transition text-sm">Technology & Experience Design</Link>
              </li>
              <li>
                <Link href="/works/video-production" className="text-gray-400 hover:text-white transition text-sm">Video Production</Link>
              </li>
              <li>
                <Link href="/works/thinkery" className="text-gray-400 hover:text-white transition text-sm">Thinkery</Link>
              </li>
              <li>
                <Link href="/works/global-academy-of-artistry" className="text-gray-400 hover:text-white transition text-sm">Global Academy of Artistry</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Get in Touch */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold text-[#fec52d]">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-400 text-sm">
                <MapPin className="text-[#fec52d] shrink-0" size={20} />
                <span>
                  Yellowtooths<br />
                  32/2493 A1, 1st Floor,<br />
                  Bhavana, K P Vallon Road,<br />
                  Kadavanthra, Kochi - 682020
                </span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400 text-sm">
                <Mail className="text-[#fec52d] shrink-0" size={20} />
                <a href="mailto:yellowtooths@gmail.com" className="hover:text-white transition">yellowtooths@gmail.com</a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-[#fec52d] shrink-0" size={20} />
                <a href="tel:+919048326777" className="text-gray-400 hover:text-white transition text-sm">+91 9048 326 777</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright & Socials */}
        <div className="mt-10 pt-4 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Yellowtooths. All rights reserved.
          </div>

          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-[#fec52d] transition transform hover:scale-110">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#fec52d] transition transform hover:scale-110">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#fec52d] transition transform hover:scale-110">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#fec52d] transition transform hover:scale-110">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;