import { useState } from 'react'
import PhoneFrame from './PhoneFrame'
import CustomerBooking from './CustomerBooking'
import AdminDashboard from './AdminDashboard'
import { createSeedBookings } from './bookingData'

function PhoneColumn({ label, children, screenClassName }) {
  return (
    <div className="flex w-full max-w-[300px] flex-col items-center gap-3 sm:gap-4">
      <p className="px-2 text-center text-xs font-medium leading-relaxed tracking-[0.06em] text-muted sm:text-sm">
        {label}
      </p>
      <PhoneFrame screenClassName={screenClassName}>{children}</PhoneFrame>
    </div>
  )
}

function App() {
  const [bookings, setBookings] = useState(createSeedBookings)

  function handleBookingConfirmed(booking) {
    setBookings((current) => [booking, ...current])
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-charcoal text-cream">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-charcoal-warm via-charcoal to-[#090908]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute left-1/2 top-[38%] h-[420px] w-[min(820px,140vw)] max-w-none -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(200,161,106,0.14)_0%,rgba(22,19,15,0.35)_42%,transparent_72%)] blur-2xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center px-3 py-8 sm:px-4 sm:py-14">
        <header className="mb-8 w-full max-w-xl px-1 text-center sm:mb-14">
          <h1 className="font-display text-[1.55rem] font-bold leading-snug tracking-wide text-cream sm:text-3xl md:text-[2.75rem]">
            صالون ١٠١ — نظام الحجز
          </h1>
          <div className="mx-auto mt-4 h-px w-14 bg-gradient-to-l from-transparent via-brass/70 to-transparent sm:mt-5 sm:w-16" />
        </header>

        {/* RTL: first item = right (customer), second = left (admin). Mobile: customer then admin. */}
        <div className="flex w-full flex-col items-center justify-center gap-10 sm:gap-12 md:flex-row md:items-start md:gap-14">
          <PhoneColumn
            label="واجهة الزبون — الحجز"
            screenClassName="bg-charcoal text-cream"
          >
            <CustomerBooking onBookingConfirmed={handleBookingConfirmed} />
          </PhoneColumn>

          <PhoneColumn
            label="لوحة الحلاق — الإدارة"
            screenClassName="bg-charcoal text-cream"
          >
            <AdminDashboard bookings={bookings} />
          </PhoneColumn>
        </div>
      </div>
    </div>
  )
}

export default App
