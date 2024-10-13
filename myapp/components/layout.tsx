import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-gray-800 shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <ul className="flex space-x-4">
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
  )
}

export function Footer() {
  return (
    <footer className="bg-gray-800 shadow-md mt-8">
      <div className="container mx-auto px-4 py-4 text-center text-white">
      <p>This website is a fan-made project and is not affiliated or endorsed by Bandai Namco Inc. or any of its subsidiaries.</p>
      <p className="mt-2">Suggestions? Join our <a href="#" className="text-blue-400 hover:underline">Discord</a>!</p>
      </div>
    </footer>
  )
}