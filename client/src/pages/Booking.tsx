import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";

const BOOKING_INTERVAL_MINUTES = 30;

export default function Booking() {
  const { data: services = [] } = trpc.sneaker.services.list.useQuery();
  const { data: operatingHours = [] } = trpc.sneaker.operatingHours.list.useQuery();
  const createBooking = trpc.sneaker.bookings.create.useMutation();

  const [formData, setFormData] = useState({
    selectedService: null as number | null,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    bookingDate: '',
    bookingTime: '',
    callType: 'incall' as 'incall' | 'outcall',
    specialRequests: '',
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Generate available time slots based on operating hours
  const availableTimeSlots = useMemo(() => {
    if (!selectedDate || operatingHours.length === 0) return [];

    const dayOfWeek = selectedDate.getDay();
    const dayHours = operatingHours.find((h) => h.day === dayOfWeek);

    if (!dayHours || dayHours.isClosed) return [];

    const slots = [];
    const [openHour, openMin] = dayHours.openTime.split(':').map(Number);
    const [closeHour, closeMin] = dayHours.closeTime.split(':').map(Number);

    let currentHour = openHour;
    let currentMin = openMin;
    const closeTimeInMinutes = closeHour * 60 + closeMin;

    while (currentHour * 60 + currentMin <= closeTimeInMinutes) {
      const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
      slots.push(timeStr);
      currentMin += BOOKING_INTERVAL_MINUTES;
      if (currentMin >= 60) {
        currentHour += Math.floor(currentMin / 60);
        currentMin = currentMin % 60;
      }
    }

    return slots;
  }, [selectedDate, operatingHours]);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      setFormData({ ...formData, bookingDate: dateStr });
    }
  };

  const handleTimeChange = (value: string) => {
    setSelectedTime(value);
    setFormData({ ...formData, bookingTime: value });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleServiceChange = (value: string) => {
    const serviceId = value ? Number(value) : null;
    setFormData({ ...formData, selectedService: serviceId });
  };

  const handleCallTypeChange = (value: string) => {
    setFormData({ ...formData, callType: value as 'incall' | 'outcall' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.selectedService) {
      toast.error('Please select a service');
      return;
    }

    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.bookingDate || !formData.bookingTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check operating hours restriction
    const dayOfWeek = selectedDate?.getDay();
    const dayHours = operatingHours.find((h) => h.day === dayOfWeek);
    if (dayHours && dayHours.isClosed) {
      toast.error('We are closed on the selected day');
      return;
    }

    try {
      const service = services.find(s => s.id === formData.selectedService);
      const result = await createBooking.mutateAsync({
        serviceId: formData.selectedService,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
        specialRequests: `${formData.callType.toUpperCase()} BOOKING. ${formData.specialRequests || ''}`,
      });

      toast.success('Booking created successfully! Redirecting to checkout...');
      
      // Construct WhatsApp message for the user to send as well
      const whatsappMsg = `Hi Sneaker Care Department, I've just made a booking!\n\nService: ${service?.name}\nDate: ${formData.bookingDate}\nTime: ${formData.bookingTime}\nType: ${formData.callType.toUpperCase()}\nName: ${formData.customerName}`;
      const whatsappUrl = `https://wa.me/27665884466?text=${encodeURIComponent(whatsappMsg)}`;

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        window.location.href = `/checkout?bookingIds=${result.bookingId}`;
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create booking');
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow;

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);

  return (
    <Layout>
      <section className="bg-background py-12 md:py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold uppercase mb-4">Book Your Service</h1>
          <p className="text-lg">Schedule your sneaker care appointment in just a few steps.</p>
        </div>
      </section>

      <div className="red-divider" />

      <section className="bg-background py-16 md:py-24">
        <div className="container max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Service Selection */}
            <div>
              <label className="block font-bold uppercase mb-3 text-foreground">Select Service *</label>
              <Select value={formData.selectedService?.toString() || ''} onValueChange={handleServiceChange}>
                <SelectTrigger className="w-full border-2 border-foreground h-12 font-bold">
                  <SelectValue placeholder="-- Choose a service --" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      {service.name} - R {(service.price / 100).toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Booking Type Selection */}
            <div>
              <label className="block font-bold uppercase mb-3 text-foreground">Booking Type *</label>
              <Select value={formData.callType} onValueChange={handleCallTypeChange}>
                <SelectTrigger className="w-full border-2 border-foreground h-12 font-bold">
                  <SelectValue placeholder="Select booking type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="incall">In-call (At our studio)</SelectItem>
                  <SelectItem value="outcall">Out-call (We come to you)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Calendar Selection */}
            <div>
              <label className="block font-bold uppercase mb-3 text-foreground">Select Date *</label>
              <div className="card-modern p-4 flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateChange}
                  disabled={(date) => {
                    if (minDate && date < minDate) return true;
                    if (maxDate && date > maxDate) return true;
                    return false;
                  }}
                  className="mx-auto"
                />
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <label className="block font-bold uppercase mb-3 text-foreground">Select Time *</label>
              <Select value={selectedTime} onValueChange={handleTimeChange}>
                <SelectTrigger className="w-full border-2 border-foreground h-12 font-bold">
                  <SelectValue placeholder="-- Choose a time --" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.length > 0 ? (
                    availableTimeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-slots" disabled>
                      No available times
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Operating Hours Info */}
            <div className="card-modern border-l-4 border-accent">
              <h3 className="font-bold text-foreground mb-4">Operating Hours</h3>
              <div className="text-sm space-y-2">
                {operatingHours.map((oh) => (
                  <div key={oh.id} className="flex justify-between text-gray-600">
                    <span className="font-semibold">{oh.dayName}:</span>
                    <span className="text-accent font-semibold">
                      {oh.isClosed ? 'Closed' : `${oh.openTime} - ${oh.closeTime}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <label className="block font-bold uppercase mb-3 text-foreground">Full Name *</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Your full name"
                className="w-full border-2 border-foreground bg-background p-3 font-bold rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block font-bold uppercase mb-3 text-foreground">Email *</label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="w-full border-2 border-foreground bg-background p-3 font-bold rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block font-bold uppercase mb-3 text-foreground">Phone Number *</label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                placeholder="+27 (123) 456-7890"
                className="w-full border-2 border-foreground bg-background p-3 font-bold rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block font-bold uppercase mb-3 text-foreground">Special Requests</label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                placeholder="Any special instructions or concerns?"
                className="w-full border-2 border-foreground bg-background p-3 min-h-24 font-bold rounded-lg"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={createBooking.isPending}
              className="btn-primary w-full font-bold uppercase disabled:opacity-50"
            >
              {createBooking.isPending ? 'Processing...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
