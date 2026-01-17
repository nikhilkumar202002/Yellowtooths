'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { fetchVisionImages, fetchTeamMembersPhotos } from '../../api/services/services';
import Loading from '../common/Loading';
import Error from '../common/Error';
import { Separator } from '../ui/separator'; // Or standard separator
import RetroGridDemo from '../common/RetroGridDemo';
import LightUpBoard from '../common/LightUpBoard';
import FloatingCardsCarousel from '../common/FloatingCardsCarousel';
import TextAnimation from '../common/TextAnimation';
import { logVisit } from '../../lib/logVisit';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const AboutPageContent = () => {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const teamGridRef = useRef<HTMLDivElement>(null);
  const teamSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logVisit();
    // Refresh ScrollTrigger on load
    const timer = setTimeout(() => ScrollTrigger.refresh(), 1000);
    return () => clearTimeout(timer);
  }, []);

  const queries = useQueries({
    queries: [
      {
        queryKey: ['about-page_get-vision-images'],
        queryFn: fetchVisionImages,
        refetchInterval: 10000,
      },
      {
        queryKey: ['about-page_get-team-members'],
        queryFn: fetchTeamMembersPhotos,
        refetchInterval: 10000,
      },
    ],
  });

  const [visionQuery, teamMembersQuery] = queries;

  // Map Data
  const teamMembers = (teamMembersQuery.data?.data?.map((member: any) => ({
    id: member.id,
    name: member.name,
    role: member.designation,
    image_path: member.photo,
    position: member.position_number,
  })) || []).sort((a: any, b: any) => a.position - b.position);

  const visionImages = visionQuery.data?.data?.map((img: any) => ({
    id: img.id,
    title: img.title,
    image_path: img.image,
  })) || [];

  if (teamMembersQuery.isLoading || visionQuery.isLoading) return <Loading />;
  if (teamMembersQuery.error || visionQuery.error) return <Error />;

  return (
    <div ref={mainContainerRef} className="flex min-h-screen w-full flex-col overflow-hidden px-0 pt-0 md:px-0 md:pt-0">
      
      {/* 1. Retro Grid Hero */}
      <div className="relative flex flex-col">
        <section className="container relative max-w-full self-center px-[0%] py-0 md:py-0">
          <RetroGridDemo />
          
          <div className="hidden max-w-full px-0 text-sm text-neutral-300 lg:text-[1.5vw] absolute bottom-10 left-0 w-full text-center">
             {/* Tagline overlay if needed */}
          </div>
        </section>

        {/* 2. Light Up Board (Alchemy) */}
        <div>
          <LightUpBoard
            headingTextPosition="center"
            contentTextPosition="center"
            headingLines={[
              { text: '15 Years of ', staggerType: 'word', className: 'font-beckman font-bold uppercase', yPositionInitial: 200, delay: 0, duration: 1.5 },
              { text: 'Cinematic Alchemy', staggerType: 'word', className: 'font-beckman font-bold uppercase', yPositionInitial: 200, delay: 0, duration: 1.5 },
            ]}
            contentLines={[
              {
                text: 'Every story begins with a spark, a moment of inspiration. Ours was born 15 years ago from a love of cinema and the art of visual storytelling. Design is our language, and we speak it exceptionally.',
                blurInitial: 10,
                staggerType: 'word',
                delay: 0.7,
                clipPathBottom: 0,
                duration: 1,
                staggerEachAmount: 0.01,
              },
            ]}
            backgroundColor="#fec52d"
            textColor="black"
          />
        </div>
      </div>

      {/* 3. Vision Section */}
      <section className="px-4 pb-20 pt-20 md:pb-10 md:pt-16">
        <FloatingCardsCarousel images={visionImages} />
      </section>

      {/* 4. Team Section */}
      <section ref={teamSectionRef} className="container mb-10 max-w-[3/4] self-center px-2 md:mt-32 md:px-5">
        <h2 className="mb-4 text-center font-beckman text-4xl uppercase md:mb-10 md:text-[6vw]">
          <TextAnimation
            classname="text-neutral-300"
            delay={0.5}
            duration={1.6}
            yPositionInitial={20}
            staggerEachAmount={0.04}
            blurInitial={20}
            staggerType="letter"
            textPosition="center"
            string="Meet the Masters"
          />
        </h2>
        
        <div ref={teamGridRef} className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {teamMembers.map((teamMember: any) => (
            <div key={teamMember.id} className="group relative aspect-square overflow-hidden rounded-md cursor-pointer">
              <img
                src={teamMember.image_path}
                alt={`${teamMember.name} - ${teamMember.role}`}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-50 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="group absolute bottom-0 left-0 right-0 translate-y-0 transform p-4 transition-transform duration-300 group-hover:translate-y-0">
                <h3 className="text-sm font-bold text-white transition-transform duration-500 group-hover:translate-x-5 group-hover:scale-110 md:text-lg md:group-hover:translate-x-10">
                  {teamMember.name}
                </h3>
                <p className="md:text-md text-xs text-neutral-300">{teamMember.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPageContent;