'use client';

import React from 'react';
import TextAnimation from '../common/TextAnimation';

interface ClientsMarqueeProps {
  clients: any[];
  title?: string;
}

const ClientsMarquee = ({ clients, title = 'Our Clients' }: ClientsMarqueeProps) => {
  const midIndex = Math.ceil(clients.length / 2);
  const firstRowClients = clients.slice(0, midIndex);
  const secondRowClients = clients.slice(midIndex);

  return (
    <section className="relative py-20">
      <div className="w-full">
        <TextAnimation textPosition={'center'} classname={'tracking-tight text-h2-lg mb-10'} yPositionInitial={200} string={title} />
        
        {/* Row 1 */}
        <div className="mb-4 overflow-hidden">
          <div className="flex animate-scroll-left">
            {[...firstRowClients, ...firstRowClients, ...firstRowClients, ...firstRowClients].map((client, index) => (
              <div key={`row1-${client.id}-${index}`} className="flex justify-center items-center flex-shrink-0 mx-2 p-2 bg-neutral-900 rounded-lg w-32">
                <img src={client.logo_path} alt={client.name} className="h-20 object-contain" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Row 2 */}
        <div className="overflow-hidden">
          <div className="flex animate-scroll-right">
            {[...secondRowClients, ...secondRowClients, ...secondRowClients, ...secondRowClients].map((client, index) => (
              <div key={`row2-${client.id}-${index}-rtl`} className="flex justify-center items-center flex-shrink-0 mx-2 p-2 bg-neutral-900 rounded-lg w-32">
                <img src={client.logo_path} alt={client.name} className="h-20 object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsMarquee;