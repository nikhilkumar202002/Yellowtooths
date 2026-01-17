'use client';

import React from 'react';

interface Step {
  title: string;
  description: string;
}

interface StepBlocksProps {
  steps: Step[];
}

const StepBlocks = ({ steps }: StepBlocksProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <div 
          key={index} 
          className="group relative flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 transition-colors hover:border-neutral-600"
        >
          <div>
            <span className="mb-4 block font-beckman text-5xl text-neutral-700 transition-colors group-hover:text-white">
              0{index + 1}
            </span>
            <h3 className="mb-2 text-xl font-bold uppercase text-white">{step.title}</h3>
          </div>
          <p className="text-sm text-neutral-400">{step.description}</p>
        </div>
      ))}
    </div>
  );
};

export default StepBlocks;