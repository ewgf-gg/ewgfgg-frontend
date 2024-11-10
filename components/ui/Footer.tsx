import Link from 'next/link'
import { FaGithub, FaDiscord } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gray-800 shadow-md mt-8">
      <div className="container mx-auto px-4 py-4 text-center text-white">
        <div className="text-sm text-gray-400 space-y-1">
          <p>ewgf.gg is a fan-made website and is not affiliated with, endorsed, or sponsored by Bandai Namco Entertainment Inc. or any of its subsidiaries.</p>
          <p>All trademarks are property of their respective owners.</p>
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          <Link href="https://Github.com" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
            <FaGithub className="w-6 h-6" />
          </Link>
          <Link href="https://discord.com" className="text-gray-400 hover:text-white transition-colors" aria-label="Discord">
            <FaDiscord className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </footer>
  )
}