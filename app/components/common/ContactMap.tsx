'use client';

import React, { memo } from 'react';
import { BorderGlowCard, BorderGlowCardContent } from '../common/BorderGlowCard';

const ContactMap = () => {
  return (
    <BorderGlowCard
      cardColor="bg-gradient-to-b from-[#0a0a0a] to-[#0a0a0a]"
      className="h-[400px] w-full overflow-hidden md:h-[500px]"
      cardBorderRadius="3xl"
    >
      <BorderGlowCardContent className="h-full w-full p-0">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          title="Yellowtooths Location"
          src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Ln-1,%20Kutty%20Sahib%20Layout%20Rd,%20near%20Model%20Engineering%20College,%20Thrikkakara,%20Edappally,%20Ernakulam,%20Kochi,%20Kerala%20682021+(Yellowtooths)&t=&z=15&ie=UTF8&iwloc=B&output=embed"
          className="h-full w-full opacity-80 grayscale invert filter transition-all duration-500 hover:filter-none"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </BorderGlowCardContent>
    </BorderGlowCard>
  );
};

export default memo(ContactMap);