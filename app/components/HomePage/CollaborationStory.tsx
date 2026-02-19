'use client';

import React from 'react';
import TextAnimation from '../common/TextAnimation';

interface CollaborationStoryProps {
  lines?: string[];
}

const CollaborationStory = ({ lines = ['Every Collaboration', 'is a Unique Tale.', "Let's Write Yours."] }: CollaborationStoryProps) => {
  return (
    <section className="relative">
      <div className="clients-wrapper relative min-h-screen w-full flex-col px-1 py-2 will-change-transform md:px-0 md:py-0">
        <section className="grid-cols-2">
          <div className={'relative h-[calc(100vh-1rem)] md:h-screen'}>
            <img className={'absolute inset-0 h-full w-full rounded-lg object-cover p-0 md:rounded-3xl md:p-2'} src="/IMAGES/COVER1.webp" alt="Services Banner Image" />
            <div className={'flex h-full flex-col items-start justify-end py-[4%] pl-[5%] font-semibold'}>
              {lines.map((line, index) => (
                <TextAnimation
                  key={`collab-line-${index}`}
                  classname={'text-h2-sm'}
                  clipPathBottom={0}
                  yPositionInitial={200}
                  staggerEachAmount={0.05}
                  staggerType={'word'}
                  string={line}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default CollaborationStory;