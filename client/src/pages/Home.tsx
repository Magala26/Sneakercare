import React from 'react';
import { trpc } from '@/lib/trpc';
import Layout from '@/components/Layout';
import { Sparkles } from 'lucide-react';
import InstagramReelsSlider from '@/components/InstagramReelsSlider';
import { workImages } from '@/data/sneakercareImages';
import logoUrl from '@/assets/logo.jpg';
import rotationSneakerUrl from '@/assets/rotation-sneaker.png';

function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

const WorkGallery = () => {
    const [stopScroll, setStopScroll] = React.useState(false);
    const cardData = workImages.slice(0, 8);

    return (
        <section className="bg-white py-20 md:py-28 overflow-hidden">
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{
                        background: 'linear-gradient(135deg, #0b0d12 0%, #2563eb 48%, #bf616a 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Our Work
                    </h2>
                    <p className="text-gray-600 text-lg">A showcase of our premium sneaker restorations</p>
                </div>

                <style>{`
                    .marquee-inner {
                        animation: marqueeScroll linear infinite;
                    }

                    @keyframes marqueeScroll {
                        0% {
                            transform: translateX(0%);
                        }

                        100% {
                            transform: translateX(-50%);
                        }
                    }
                `}</style>

                <div className="overflow-hidden w-full relative max-w-6xl mx-auto" onMouseEnter={() => setStopScroll(true)} onMouseLeave={() => setStopScroll(false)}>
                    <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
                    <div className="marquee-inner flex w-fit" style={{ animationPlayState: stopScroll ? "paused" : "running", animationDuration: cardData.length * 2500 + "ms" }}>
                        <div className="flex">
                            {[...cardData, ...cardData].map((card, index) => (
                                <div key={index} className="w-56 mx-4 h-[20rem] relative group hover:scale-90 transition-all duration-300 rounded-xl overflow-hidden shadow-md">
                                    <img src={card.src} alt={card.alt} className="w-full h-full object-cover" loading="lazy" />
                                    <div className="flex items-center justify-center px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-0 backdrop-blur-md left-0 w-full h-full bg-black/40">
                                        <p className="text-white text-lg font-bold text-center uppercase">{card.caption}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
                </div>
            </div>
        </section>
    );
};

export default function Home() {
  const { data: services = [], isLoading } = trpc.sneaker.services.list.useQuery();
  const { data: testimonials = [] } = trpc.sneaker.testimonials.list.useQuery();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white via-blue-50 to-white py-16 md:py-32 relative overflow-hidden border-b border-blue-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#bf616a]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" />
        
        <div className="container text-center relative z-10">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src={logoUrl} 
              alt="Sneaker Care Department" 
              className="h-32 md:h-40 w-auto mx-auto rounded-2xl shadow-[0_20px_55px_rgba(15,23,42,0.10)]"
            />
          </div>
          
          <div className="inline-flex items-center gap-2 mb-6 bg-white border border-blue-100 px-4 py-2 rounded-full shadow-sm">
            <Sparkles size={16} className="text-accent" />
            <span className="text-sm font-semibold text-accent uppercase tracking-[0.16em]">Premium Sneaker Care</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-foreground drop-shadow-sm">Professional Sneaker</span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #0b0d12 0%, #2563eb 48%, #bf616a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Cleaning & Restoration
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Professional cleaning, restoration, and premium care for your most prized sneaker collection.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link href="/booking" className="btn-primary inline-block">
              Book Your Clean
            </Link>
            <Link href="/services" className="btn-outline inline-block">
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* Blue Divider */}
      <div className="red-divider" />

      {/* Service Highlights */}
      <section className="bg-white py-20 md:py-28 relative overflow-hidden" id="our-services">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-50/70 to-transparent pointer-events-none" />
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{
              background: 'linear-gradient(135deg, #0b0d12 0%, #2563eb 48%, #bf616a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Our Services
            </h2>
            <p className="text-gray-600 text-lg">Premium sneaker care packages tailored to your collection's needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Standard Clean', price: 'R100', desc: 'For pairs that just need a refresh. We handle the upper, mid sole, and laces.' },
              { name: 'The 95 Deluxe', price: 'R220', desc: 'Our signature service. Nothing is left behind. The full reset your pair has been waiting for.', featured: true },
              { name: 'Deep Clean', price: 'R120', desc: "When a standard clean isn't enough. We go into the inset stains and inner sole." },
              { name: 'Intense Deep Clean', price: 'R240', desc: 'Maximum effort for maximum neglect. An intensified upper clean that goes further.' },
              { name: 'Suede/Nubuck Maintenance Clean', price: 'R200', desc: "Suede and nubuck demand specialist handling. A dedicated maintenance protocol." }
            ].map((service, idx) => (
              <div key={idx} className={`card-modern flex flex-col group ${service.featured ? 'border-2 border-accent transform md:scale-105 z-10 shadow-xl' : ''}`}>
                <div className="w-full h-48 bg-gradient-to-br from-blue-50 via-white to-[#bf616a]/10 rounded-xl flex items-center justify-center border-2 border-dashed border-blue-200 text-gray-500 font-semibold mb-6 group-hover:border-[#bf616a]/50">
                  Photo — {service.name}
                </div>
                <h3 className="font-bold text-xl mb-2 text-foreground">{service.name}</h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow">{service.desc}</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 mb-4">
                  <span className="text-[#bf616a] font-black text-lg tracking-wide">{service.price}</span>
                </div>
                <Link href="/main-services" className={`w-full text-center py-3 px-4 rounded-xl font-bold uppercase transition-all duration-300 ${service.featured ? 'bg-gradient-to-r from-[#bf616a] via-blue-600 to-[#0b0d12] text-white shadow-lg' : 'bg-white border-2 border-foreground text-foreground hover:bg-foreground hover:text-white hover:border-[#bf616a]'}`}>
                  View Details
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/additional-services" className="btn-outline inline-block text-center">
              Explore Additional Services
            </Link>
            <Link href="/products" className="btn-outline inline-block text-center">
              Shop Sneaker Products
            </Link>
          </div>
        </div>
      </section>

      {/* Blue Divider */}
      <div className="red-divider" />

      {/* Rotation Refresh Plan Teaser */}
      <section id="rotation-refresh-preview" className="rrp-home-teaser bg-gradient-to-br from-[#0b0d12] via-blue-950 to-white py-20 md:py-28 overflow-hidden text-white">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left Copy */}
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center gap-2 mb-6 bg-white border border-blue-100 px-4 py-2 rounded-full shadow-sm">
                <Sparkles size={16} className="text-accent" />
                <span className="text-sm font-semibold text-accent uppercase tracking-wider">Premium Sneaker Care Membership</span>
              </div>
              
              <p className="text-xl md:text-2xl font-bold mb-3 tracking-widest uppercase" style={{ color: '#bf616a' }}>
                The Rotation Refresh Plan
              </p>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white" style={{
                fontFamily: '"Playfair Display", Georgia, serif'
              }}>
                Keep every pair in your rotation looking box-fresh — every month.
              </h2>
              
              <p className="text-lg text-white/75 mb-8 leading-relaxed">
                Stop letting dirty sneakers kill the look, value, and confidence of your collection. Get monthly professional sneaker care built for collectors, resellers, athletes, and serious sneaker lovers who refuse to let their rotation fall off.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link href="/rotation-refresh-plan" className="btn-primary flex-1 sm:flex-none text-center inline-block">
                  View The Full Offer
                </Link>
                <a href="https://wa.me/27665884466" className="btn-outline flex-1 sm:flex-none text-center inline-block">
                  Ask On WhatsApp
                </a>
              </div>
              
              {/* Proof Points */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-blue-200 bg-white/95 p-2 rounded-2xl shadow-sm text-foreground">
                <div className="p-4 bg-blue-50/50 rounded-xl sm:rounded-r-none sm:rounded-l-xl">
                  <strong className="block text-foreground text-sm mb-1">Month-to-month</strong>
                  <span className="text-gray-500 text-xs">No long contract</span>
                </div>
                <div className="p-4 bg-blue-50/50 border-t sm:border-t-0 sm:border-l border-white">
                  <strong className="block text-foreground text-sm mb-1">From R1499</strong>
                  <span className="text-gray-500 text-xs">Built for real rotations</span>
                </div>
                <div className="p-4 bg-blue-50/50 rounded-xl sm:rounded-l-none sm:rounded-r-xl border-t sm:border-t-0 sm:border-l border-white">
                  <strong className="block text-foreground text-sm mb-1">Bonus included</strong>
                  <span className="text-gray-500 text-xs">Free gift on sign-up</span>
                </div>
              </div>
            </div>
            
            {/* Right Visual */}
            <div className="w-full lg:w-1/2">
              <div className="relative w-full rounded-[2rem] overflow-hidden shadow-2xl min-h-[400px] md:min-h-[500px] group border border-blue-100">
                <img 
                  src={rotationSneakerUrl} 
                  alt="The Rotation Refresh Plan Premium Sneaker Care"
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                {/* Soft overlay to make it look premium and blend slightly */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blue Divider */}
      <div className="red-divider" />

      {/* Price List Summary */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20 md:py-28">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{
              background: 'linear-gradient(135deg, #0b0d12 0%, #2563eb 48%, #bf616a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Pricing Guide
            </h2>
            <p className="text-gray-600 text-lg">Explore our service and product ranges</p>
          </div>
          
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {[
              {
                title: 'Sneaker Cleaning',
                priceRange: services.length > 0 
                  ? `R${Math.min(...services.map(s => s.price / 100))} - R${Math.max(...services.map(s => s.price / 100))}`
                  : 'R100 - R240',
                link: '/services',
                linkText: 'View All Cleaning Services'
              },
              {
                title: 'Sneaker Products',
                priceRange: 'R60 - R180',
                link: '/products',
                linkText: 'Shop Products'
              },
              {
                title: 'Additional Services',
                priceRange: 'R50 - R500',
                link: '/additional-services',
                linkText: 'View Additional Services'
              },
              {
                title: 'Special Offer',
                priceRange: 'From R1499 / month',
                link: '/rotation-refresh-plan',
                linkText: 'View Subscription'
              }
            ].map((pkg, idx) => {
              const isOdd = (idx + 1) % 2 !== 0;
              return (
                <div 
                  key={idx} 
                  className={`flex flex-col md:flex-row items-center justify-between p-4 md:p-5 rounded-3xl md:rounded-full transition-transform hover:scale-[1.02] duration-300 shadow-md ${
                    isOdd 
                      ? 'bg-blue-600 text-white border-2 border-blue-600' 
                      : 'bg-white text-blue-600 border-2 border-blue-600'
                  }`}
                >
                  <div className="text-center md:text-left mb-4 md:mb-0 md:ml-4">
                    <h3 className="text-xl md:text-2xl font-bold mb-1">{pkg.title}</h3>
                    <p className={`text-base font-semibold tracking-wide ${isOdd ? 'text-blue-100' : 'text-blue-500'}`}>
                      {pkg.priceRange}
                    </p>
                  </div>
                  <Link 
                    href={pkg.link} 
                    className={`px-5 py-2.5 rounded-full font-bold uppercase text-xs transition-colors whitespace-nowrap md:mr-4 shadow-sm ${
                      isOdd 
                        ? 'bg-white text-blue-600 hover:bg-gray-100' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {pkg.linkText}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blue Divider */}
      <div className="red-divider" />



      {false && (
        <>
          {/* Instagram Reels Testimonials */}
          <section className="bg-white py-20 md:py-28 overflow-hidden">
            <div className="container">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{
                  background: 'linear-gradient(135deg, #0b0d12 0%, #2563eb 48%, #bf616a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Watch Us Work
                </h2>
                <p className="text-gray-600 text-lg">See our incredible sneaker transformations in action</p>
              </div>
              
              <div className="-mx-4 md:mx-0">
                <InstagramReelsSlider />
              </div>
            </div>
          </section>

          {/* Blue Divider */}
          <div className="red-divider" />
        </>
      )}

      {/* Our Work Section */}
      <WorkGallery />

      {/* Blue Divider */}
      <div className="red-divider" />

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20 md:py-28 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        <div className="container relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Refresh Your Kicks?</h2>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Join hundreds of sneaker enthusiasts who trust us with their prized collections.
          </p>
          <Link href="/booking" className="inline-block bg-white text-blue-600 px-8 py-4 font-bold uppercase rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            Schedule Your Clean
          </Link>
        </div>
      </section>
    </Layout>
  );
}
