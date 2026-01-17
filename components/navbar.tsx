'use client'

import Link from 'next/link'
import { Github, Linkedin } from 'lucide-react'
import { usePostHog } from 'posthog-js/react'

export function Navbar() {
  const posthog = usePostHog()

  const trackClick = (eventName: string, properties: Record<string, any> = {}) => {
    posthog.capture(eventName, properties)
  }

  return (
    <nav className="w-full max-w-5xl mx-auto px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-4 flex justify-between items-center">

      {/* Left Side: Your Name/Logo */}
      <Link
        href="/"
        className="text-xl font-bold"
        onClick={() => trackClick('nav_logo_clicked')}
      >
        Fran Chaves
      </Link>

      {/* Right Side: Navigation Links */}
      <div className="flex items-center space-x-6">

        <Link
          href="/builds-and-strategy"
          className="text-gray-400 hover:text-white"
          onClick={() => trackClick('nav_link_clicked', { destination: 'builds-and-strategy' })}
        >
          Builds & Strategy
        </Link>
        {/* <Link href="/about" className="text-gray-400 hover:text-white">
          About
        </Link> */}

        {/* === HIDDEN LINKS === */}
        {/* These are commented out. To "un-hide" them, just remove the {/* and *\/}
        
        {/*
        <Link href="/blog" className="text-gray-400 hover:text-white">
          Blog
        </Link>

        <Link href="/resume.pdf" target="_blank" className="text-gray-400 hover:text-white">
          Resume
        </Link>
        */}
        {/* === END HIDDEN LINKS === */}


        {/* Social Icons */}
        <Link
          href="https://github.com/franchaves30"
          target="_blank"
          className="text-gray-400 hover:text-white transition-colors"
          onClick={() => trackClick('social_link_clicked', { platform: 'github' })}
        >
          <Github className="w-5 h-5" />
        </Link>
        <Link
          href="https://www.linkedin.com/in/francisco-chaves"
          target="_blank"
          className="text-gray-400 hover:text-white transition-colors"
          onClick={() => trackClick('social_link_clicked', { platform: 'linkedin' })}
        >
          <Linkedin className="w-5 h-5" />
        </Link>

        {/* CTA Button: Links to your LinkedIn */}
        <Link
          href="https://www.linkedin.com/in/francisco-chaves"
          target="_blank"
          className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          onClick={() => trackClick('cta_contact_clicked')}
        >
          Contact
        </Link>
      </div>
    </nav>
  )
}