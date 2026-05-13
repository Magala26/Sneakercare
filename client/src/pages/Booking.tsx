import { useState, useMemo, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import { CalendarWithTime } from '@/components/CalendarWithTime';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    bookingEndTime: '',
    callType: 'incall' as 'incall' | 'outcall',
    specialRequests: '',
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedStartTime, setSelectedStartTime] = useState<string>('');
  const [selectedEndTime, setSelectedEndTime] = useState<string>('');

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

  // Update end time automatically when start time or call type changes
  useEffect(() => {
    if (selectedStartTime) {
      const [hours, mins] = selectedStartTime.split(':').map(Number);
      let durationMinutes = 30; // Default duration

      if (formData.callType === 'outcall') {
        durationMinutes = 60; // Out-call is 1 hour long
      } else if (formData.selectedService) {
        const service = services.find(s => s.id === formData.selectedService);
        if (service) durationMinutes = service.duration;
      }

      const totalMins = hours * 60 + mins + durationMinutes;
      const endHours = Math.floor(totalMins / 60);
      const endMins = totalMins % 60;
      const endTimeStr = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
      
      setSelectedEndTime(endTimeStr);
      setFormData(prev => ({ ...prev, bookingTime: selectedStartTime, bookingEndTime: endTimeStr }));
    }
  }, [selectedStartTime, formData.callType, formData.selectedService, services]);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      setFormData({ ...formData, bookingDate: dateStr });
    }
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

      // WhatsApp Notification Logic (Simulated via notification service which alerts owner)
      // The server-side already calls notifyOwner which can be configured to alert via WhatsApp/SMS
      
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

  const selectedServiceData = formData.selectedService
    ? services.find((s) => s.id === formData.selectedService)
    : null;

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
        <div className="container max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
              <div>
                <label className="block font-bold uppercase mb-3">Select Service *</label>
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

              <div>
                <label className="block font-bold uppercase mb-3">Booking Type *</label>
                <Select value={formData.callType} onValueChange={handleCallTypeChange}>
                  <SelectTrigger className="w-full border-2 border-foreground h-12 font-bold">
                    <SelectValue placeholder="Select booking type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incall">In-call (At our studio)</SelectItem>
                    <SelectItem value="outcall">Out-call (We come to you - 1hr duration)</SelectItem>
                  </SelectContent>
                </Select>
                {formData.callType === 'outcall' && (
                  <p className="text-xs text-accent mt-2 font-bold uppercase tracking-wider">
                    * Out-call bookings include travel time and are set to 1 hour duration.
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold uppercase mb-3">Select Date & Time *</label>
                <CalendarWithTime
                  selectedDate={selectedDate}
                  onDateChange={handleDateChange}
                  selectedStartTime={selectedStartTime}
                  onStartTimeChange={setSelectedStartTime}
                  selectedEndTime={selectedEndTime}
                  onEndTimeChange={setSelectedEndTime}
                  minDate={minDate}
                  maxDate={maxDate}
                  availableTimeSlots={availableTimeSlots}
                />
              </div>

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

              <div>
                <label className="block font-bold uppercase mb-3">Full Name *</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className="w-full border-2 border-foreground bg-background p-3 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold uppercase mb-3">Email *</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full border-2 border-foreground bg-background p-3 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold uppercase mb-3">Phone Number *</label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  placeholder="+27 (123) 456-7890"
                  className="w-full border-2 border-foreground bg-background p-3 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold uppercase mb-3">Special Requests</label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  placeholder="Any special instructions or concerns?"
                  className="w-full border-2 border-foreground bg-background p-3 min-h-24 font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={createBooking.isPending}
                className="btn-primary w-full font-bold uppercase disabled:opacity-50"
              >
                {createBooking.isPending ? 'Processing...' : 'Confirm Booking'}
              </button>
            </form>

            <div className="md:col-span-1">
              <div className="border-2 border-foreground p-6 sticky top-32 bg-white shadow-xl rounded-xl">
                <h3 className="font-bold uppercase mb-6 border-b-2 border-foreground pb-2">Booking Summary</h3>

                {selectedServiceData ? (
                  <>
                    <div className="space-y-3 mb-6 pb-6 border-b-2 border-muted">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <p className="font-bold text-sm">{selectedServiceData.name}</p>
                          <p className="text-xs text-muted">Type: {formData.callType.toUpperCase()}</p>
                        </div>
                        <p className="font-bold text-accent">R {((selectedServiceData.price || 0) / 100).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6 pb-6 border-b-2 border-muted">
                      <p className="text-sm">
                        <strong>Date:</strong> {formData.bookingDate || 'Not selected'}
                      </p>
                      <p className="text-sm">
                        <strong>Time:</strong> {formData.bookingTime ? `${formData.bookingTime} - ${formData.bookingEndTime}` : 'Not selected'}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="font-bold uppercase">Total</p>
                      <p className="text-2xl font-bold text-accent">R {((selectedServiceData.price || 0) / 100).toFixed(2)}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-muted text-sm">Select a service to see summary</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
