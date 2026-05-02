import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import { X } from 'lucide-react';

const BOOKING_INTERVAL_MINUTES = 30;

export default function Booking() {
  const { data: services = [] } = trpc.sneaker.services.list.useQuery();
  const { data: operatingHours = [] } = trpc.sneaker.operatingHours.list.useQuery();
  const createBooking = trpc.sneaker.bookings.create.useMutation();

  const [formData, setFormData] = useState({
    selectedServices: [] as number[],
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    bookingDate: '',
    bookingTime: '',
    specialRequests: '',
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Generate available time slots
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

    while (currentHour * 60 + currentMin < closeTimeInMinutes) {
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    setSelectedDate(date);
    setFormData({ ...formData, bookingDate: e.target.value });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleServiceToggle = (serviceId: number) => {
    setFormData((prev) => {
      const isSelected = prev.selectedServices.includes(serviceId);
      return {
        ...prev,
        selectedServices: isSelected
          ? prev.selectedServices.filter((id) => id !== serviceId)
          : [...prev.selectedServices, serviceId],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.selectedServices.length === 0) {
      toast.error('Please select at least one service');
      return;
    }

    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.bookingDate || !formData.bookingTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Create a booking for each selected service
      const bookingIds: number[] = [];
      for (const serviceId of formData.selectedServices) {
        const result = await createBooking.mutateAsync({
          serviceId,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          bookingDate: formData.bookingDate,
          bookingTime: formData.bookingTime,
          specialRequests: formData.specialRequests || undefined,
        });
        bookingIds.push(result.bookingId);
      }

      toast.success('Bookings created successfully! Redirecting to checkout...');
      setTimeout(() => {
        window.location.href = `/checkout?bookingIds=${bookingIds.join(',')}`;
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create booking');
    }
  };

  // Calculate total price for selected services
  const totalPrice = formData.selectedServices.reduce((sum, serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    return sum + (service?.price || 0);
  }, 0);

  // Get tomorrow's date as minimum
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Get date 30 days from now as maximum
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <Layout>
      {/* Header */}
      <section className="bg-background py-12 md:py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold uppercase mb-4">Book Your Service</h1>
          <p className="text-lg">Schedule your sneaker care appointment in just a few steps.</p>
        </div>
      </section>

      {/* Red Divider */}
      <div className="red-divider" />

      {/* Booking Form */}
      <section className="bg-background py-16 md:py-24">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
              {/* Service Selection */}
              <div>
                <label className="block font-bold uppercase mb-3">Select Services *</label>
                <p className="text-sm text-muted mb-3">You can select multiple services</p>
                <div className="space-y-2">
                  {services.map((service) => (
                    <label key={service.id} className="flex items-center gap-3 p-3 border-2 border-foreground cursor-pointer hover:bg-muted transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.selectedServices.includes(service.id)}
                        onChange={() => handleServiceToggle(service.id)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <div className="flex-1">
                        <p className="font-bold">{service.name}</p>
                        <p className="text-sm text-muted">{service.duration} min</p>
                      </div>
                      <p className="font-bold text-accent">R {(service.price / 100).toFixed(2)}</p>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block font-bold uppercase mb-3">Booking Date *</label>
                <input
                  type="date"
                  name="bookingDate"
                  value={formData.bookingDate}
                  onChange={handleDateChange}
                  min={minDate}
                  max={maxDateStr}
                  className="w-full border-2 border-foreground bg-background p-3 font-bold"
                  required
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="block font-bold uppercase mb-3">Booking Time *</label>
                {availableTimeSlots.length > 0 ? (
                  <select
                    name="bookingTime"
                    value={formData.bookingTime}
                    onChange={handleInputChange}
                    className="w-full border-2 border-foreground bg-background p-3 font-bold"
                    required
                  >
                    <option value="">Choose a time...</option>
                    {availableTimeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-muted">Please select a date to see available times</p>
                )}
              </div>

              {/* Operating Hours Info */}
              <div className="card-modern border-l-4 border-accent">
                <h3 className="font-bold text-foreground mb-4">Operating Hours</h3>
                <div className="text-sm space-y-2">
                  {[
                    { day: 'Monday - Friday', hours: '9:00 AM - 5:00 PM' },
                    { day: 'Saturday', hours: '9:00 AM - 3:00 PM' },
                    { day: 'Sunday', hours: 'Closed' },
                    { day: 'Public Holidays', hours: '9:00 AM - 1:00 PM' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between text-gray-600">
                      <span className="font-semibold">{item.day}:</span>
                      <span className="text-accent font-semibold">{item.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <label className="block font-bold uppercase mb-3">Full Name *</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className="w-full border-2 border-foreground bg-background p-3"
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
                  className="w-full border-2 border-foreground bg-background p-3"
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
                  className="w-full border-2 border-foreground bg-background p-3"
                  required
                />
              </div>

              {/* Special Requests */}
              <div>
                <label className="block font-bold uppercase mb-3">Special Requests</label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  placeholder="Any special instructions or concerns?"
                  className="w-full border-2 border-foreground bg-background p-3 min-h-24"
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

            {/* Booking Summary Sidebar */}
            <div className="md:col-span-1">
              <div className="border-2 border-foreground p-6 sticky top-32">
                <h3 className="font-bold uppercase mb-6">Booking Summary</h3>

                {formData.selectedServices.length > 0 ? (
                  <>
                    <div className="space-y-3 mb-6 pb-6 border-b-2 border-muted">
                      {formData.selectedServices.map((serviceId) => {
                        const service = services.find((s) => s.id === serviceId);
                        return (
                          <div key={serviceId} className="flex justify-between items-start gap-2">
                            <div className="flex-1">
                              <p className="font-bold text-sm">{service?.name}</p>
                              <p className="text-xs text-muted">{service?.duration} min</p>
                            </div>
                            <p className="font-bold text-accent">R {((service?.price || 0) / 100).toFixed(2)}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-2 mb-6 pb-6 border-b-2 border-muted">
                      <p className="text-sm">
                        <strong>Date:</strong> {formData.bookingDate || 'Not selected'}
                      </p>
                      <p className="text-sm">
                        <strong>Time:</strong> {formData.bookingTime || 'Not selected'}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="font-bold uppercase">Total</p>
                      <p className="text-2xl font-bold text-accent">R {(totalPrice / 100).toFixed(2)}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-muted text-sm">Select services to see summary</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
