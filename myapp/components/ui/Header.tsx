import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-gray-800 shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <ul className="flex justify-center space-x-8">
          <li>
            <Link href="/" className="text-white hover:text-blue-400 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link href="/statistics" className="text-white hover:text-blue-400 transition-colors">
              All Statistics
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
