import EWGFLoadingAnimation from '@/components/EWGFLoadingAnimation';
import { Header } from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="flex justify-center items-center my-12">
          <EWGFLoadingAnimation />
        </div>
      </main>
      <Footer />
    </div>
  );
}
