import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage = ({ title }: PlaceholderPageProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Helmet>
        <title>{title} | Farmy Back Office</title>
      </Helmet>
      
      <div className="bg-accent-primary/10 p-8 rounded-full mb-6">
        <Construction className="h-16 w-16 text-accent-primary animate-bounce" />
      </div>
      
      <h1 className="text-3xl tracking-tight mb-2">{title}</h1>
      <p className="text-text-muted max-w-md">
        This module is currently under active development. Our AI agents are building the logic to connect this section with the backend services.
      </p>
      
      <button 
        onClick={() => window.history.back()}
        className="btn-primary mt-8"
      >
        Go Back
      </button>
    </div>
  );
};

export default PlaceholderPage;
