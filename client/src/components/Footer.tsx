import { Phone, Mail, MapPin, MessageCircle, Instagram, Music } from 'lucide-react';
import logoUrl from '@/assets/logo.jpg';

export default function Footer() {
  const operatingHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 5:00 PM' },
    { day: 'Saturday', hours: '9:00 AM - 3:00 PM' },
    { day: 'Sunday', hours: 'Closed' },
    { day: 'Public Holidays', hours: '9:00 AM - 1:00 PM' },
  ];

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200 mt-auto">
      <div className="red-divider" />
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <img 
              src={logoUrl} 
              alt="Sneaker Care Department" 
              className="h-20 w-auto mb-4"
            />
            <p className="text-sm text-gray-600 leading-relaxed">
              Professional sneaker cleaning, restoration, and premium care services for your most prized collection.
            </p>
          </div>

          {/* Operating Hours */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-foreground">Operating Hours</h3>
            <div className="text-sm space-y-2">
              {operatingHours.map((item, idx) => (
                <div key={idx} className="flex justify-between text-gray-600">
                  <span className="font-semibold">{item.day}:</span>
                  <span className="text-accent font-semibold">{item.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-foreground">Contact</h3>
            <div className="text-sm space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail size={18} className="text-accent flex-shrink-0" />
                <a href="mailto:sneakercaredepartment@yahoo.com" className="hover:text-accent transition-colors">
                  sneakercaredepartment@yahoo.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone size={18} className="text-accent flex-shrink-0" />
                <a href="tel:0665884466" className="hover:text-accent transition-colors">
                  0665884466
                </a>
              </div>
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin size={18} className="text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p>96 Vorster Avenue</p>
                  <p>Glenanda, Johannesburg South</p>
                  <p>South Africa</p>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-3 text-foreground">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href="https://wa.me/27665884466"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                title="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href="https://www.instagram.com/weluvsneakercare/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                title="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.tiktok.com/@weluvsneakercare"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                title="TikTok"
              >
                <Music size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Blue Divider */}
        <div className="red-divider my-8" />

        {/* Copyright */}
        <div className="text-center text-sm text-gray-600">
          <p>&copy; 2026 Sneaker Care Department. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
