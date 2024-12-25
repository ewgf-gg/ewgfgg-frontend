'use client'
import EWGFLoadingAnimation from '@/components/EWGFLoadingAnimation';
import { Header } from '@/components/ui/Header';
import  Footer  from '@/components/ui/Footer';
import React from 'react'

export default function Loading() {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Header />
        <main className="flex-grow flex justify-center items-center">
          <div className="transform scale-100">
            <EWGFLoadingAnimation />
          </div>
        </main>
        <Footer />
      </div>
    );
  }
