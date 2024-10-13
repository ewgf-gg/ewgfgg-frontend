import { Header, Footer } from '@/components/layout'

export default function StatisticsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center mb-12">All Statistics</h1>
        {/* Add your statistics content here */}
      </main>
      <Footer />
    </div>
  )
}