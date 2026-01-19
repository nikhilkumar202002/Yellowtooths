'use client';

import React, { useEffect, memo,Suspense } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { logVisit } from '../lib/logVisit';
import { useLenis } from 'lenis/react';

// Components
import TextAnimation from '../components/common/TextAnimation';
import GradientTextAnimation from '../components/common/GradientTextAnimation';
import Spacer from '../components/common/Spacer';
import BorderGlowContactCard from '../components/common/BorderGlowContactCard';
import ContactForm from '../components/common/ContactForm';
import ContactMap from '../components/common/ContactMap'; // Ensure you created this component

const ContactPage = () => {

  useEffect(() => {
    logVisit();
  }, []);

 const CONTACT_DETAILS = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'info@yellowtooths.in',
      link: 'mailto:info@yellowtooths.in',
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+91 9048326777',
      link: 'tel:+919048326777',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content:
        'Ln-1, Kutty Sahib Layout Rd, near Model Engineering College, Thrikkakara, Edappally, Ernakulam, Kochi, Kerala 682021',
        // 'B, First Floor, 46/2299, near Pallipadi Juma Masjid, Chakkaraparambu, Vennala, Kerala, 682028',
      link: 'https://maps.app.goo.gl/MdPt4Z7JEARE5a34A',
    },
  ];


  return (
    <div className="padding-primary container mx-auto flex min-h-screen max-w-7xl flex-col overflow-hidden pt-24 md:pt-40">
      <section className="px-primary container mx-auto mb-20">
         <TextAnimation
          clipPathBottom={0}
          blurInitial={10}
          classname={'font-semibold font-beckman uppercase text-h1-sm'}
          string={'Contact'}
        />
        
        {/* --- Header Section --- */}
       <h2 className="text-h2-sm mt-6 font-normal tracking-tighter md:mt-10">
          <GradientTextAnimation
            delay={0.2}
            blurInitial={10}
            yPositionInitial={200}
            staggerEachAmount={0.05}
            string={`Let's create something`}/>

          <GradientTextAnimation
            delay={0.8}
            blurInitial={10}
            classname={'px-0.5 md:px-1'}
            yPositionInitial={200}
            staggerEachAmount={0.05}
            string="Groundbreaking."
            gradient={'linear-gradient(to bottom, #fce39d, #fec52d)'}/>
        </h2>

        {/* --- Hidden Subtext (Preserved from original) --- */}
       <div className="hidden max-w-full px-1 pt-3 text-justify font-geist-sans text-sm text-neutral-400 md:px-2 lg:text-lg">
          <TextAnimation
            delay={1.2}
            clipPathBottom={0}
            staggerEachAmount={0.01}
            blurInitial={5}
            staggerType={'letter'}
            string={
              'Scroll down to see the full spectrum of our featured works that cover every aspect of your path towards excellence.'
            }
          />
        </div>

        <Spacer />

        {/* --- Main Grid: Contact Info & Form --- */}
     <section className="gap-primary grid grid-cols-1 lg:grid-cols-2">
          {/* Contact Cards */}
          <Suspense fallback={<div className="min-h-[200px] flex items-center justify-center">Loading...</div>}>
            <BorderGlowContactCard gridTitle={'Reach out to us.'} gridItems={CONTACT_DETAILS} />
          </Suspense>

          {/* Contact Form */}
          <Suspense fallback={<div className="min-h-[200px] flex items-center justify-center">Loading...</div>}>
            <ContactForm gridTitle={'Tell us your Story.'} />
          </Suspense>
        </section>


      </section>
        <Spacer />

    </div>
  );
};

export default memo(ContactPage);