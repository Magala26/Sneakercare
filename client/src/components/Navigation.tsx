import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X } from 'lucide-react';
import logoUrl from '@/assets/logo.jpg';

const LOGO_URL = logoUrl;

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Booking', href: '/booking' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container flex items-center justify-between py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img 
            src={LOGO_URL} 
            alt="Sneaker Care Department Logo" 
            className="h-16 md:h-20 w-auto"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-bold uppercase text-sm tracking-wider text-foreground hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-gray-100 transition-colors rounded-lg"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} className="text-foreground" /> : <Menu size={24} className="text-foreground" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="container py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-bold uppercase text-sm tracking-wider text-foreground hover:text-accent transition-colors block py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Blue Divider */}
      <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 w-full" />
    </nav>
  );
}
