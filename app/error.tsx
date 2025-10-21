'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { Header } from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

// Helper function to determine error type and details
function getErrorDetails(error: Error & { digest?: string }) {
  const errorMessage = error.message.toLowerCase();
  
  // Check for specific error patterns
  if (errorMessage.includes('502') || errorMessage.includes('bad gateway')) {
    return {
      code: '502',
      title: 'Bad Gateway',
      description: 'The server received an invalid response from a downstream server.'
    };
  }
  
  if (errorMessage.includes('503') || errorMessage.includes('service unavailable')) {
    return {
      code: '503',
      title: 'Service Unavailable',
      description: 'The server is temporarily unable to handle the request. This could be due to maintenance or overload.'
    };
  }
  
  if (errorMessage.includes('504') || errorMessage.includes('gateway timeout')) {
    return {
      code: '504',
      title: 'Gateway Timeout',
      description: 'The server did not receive a timely response from downstream server.'
    };
  }
  
  if (errorMessage.includes('501') || errorMessage.includes('not implemented')) {
    return {
      code: '501',
      title: 'Not Implemented',
      description: 'The server does not support the functionality required to fulfill the request.'
    };
  }
  
  if (errorMessage.includes('505') || errorMessage.includes('http version')) {
    return {
      code: '505',
      title: 'HTTP Version Not Supported',
      description: 'The server does not support the HTTP protocol version used in the request.'
    };
  }
  
  // Default to 500 for any other server errors
  return {
    code: '500',
    title: 'Internal Server Error',
    description: 'Something went wrong on our end. We\'re working to fix it.'
  };
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const errorDetails = useMemo(() => getErrorDetails(error), [error]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-8">
            <Image
              src="/static/hachi.webp"
              alt="Hachi"
              width={300}
              height={300}
              className="rounded-lg"
            />
          </div>
          <h1 className="text-6xl font-bold text-red-500">{errorDetails.code}</h1>
          <p className="text-2xl font-semibold text-gray-200">{errorDetails.title}</p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">{errorDetails.description}</p>
          <div className="flex gap-4 justify-center mt-6">
            <button
              onClick={reset}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-300"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
