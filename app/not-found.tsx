import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export default function NotFound() {
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
          <h1 className="text-6xl font-bold text-red-500">404</h1>
          <p className="text-xl text-gray-300">
            The page does not exist or could not be found
          </p>
          <Link
            href="/"
            className="inline-block mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
          >
            Return Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
