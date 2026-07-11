import { useState } from 'react'
import PhoneFrame from './PhoneFrame'
import CustomerBooking from './CustomerBooking'
import AdminDashboard from './AdminDashboard'
import { createSeedBookings } from './bookingData'

const VIEWS = [
  { id: 'customer', label: 'واجهة الزبون' },
  { id: 'admin', label: 'لوحة الحلاق' },
]

function App() {
  const [bookings, setBookings] = useState(createSeedBookings)
  const [activeView, setActiveView] = useState('customer')

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
        <header className="mb-8 w-full max-w-xl px-1 text-center sm:mb-10">
          <h1 className="font-display text-[1.55rem] font-bold leading-snug tracking-wide text-cream sm:text-3xl md:text-[2.75rem]">
            صالون ١٠١ — نظام الحجز
          </h1>
          <div className="mx-auto mt-4 h-px w-14 bg-gradient-to-l from-transparent via-brass/70 to-transparent sm:mt-5 sm:w-16" />
        </header>

        <div
          className="mb-8 inline-flex rounded-full bg-charcoal-raised p-1 ring-1 ring-white/10 sm:mb-10"
          role="tablist"
          aria-label="اختيار الواجهة"
        >
          {VIEWS.map((view) => {
            const isActive = activeView === view.id
            return (
              <button
                key={view.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveView(view.id)}
                className={`rounded-full px-5 py-2 font-display text-sm font-semibold tracking-wide transition-all duration-300 sm:px-6 sm:text-base ${
                  isActive
                    ? 'bg-brass text-charcoal shadow-brass-glow'
                    : 'text-muted hover:text-cream'
                }`}
              >
                {view.label}
              </button>
            )
          })}
        </div>

        {/* Both phones stay mounted; inactive is CSS-hidden to preserve wizard + bookings state */}
        <div className="relative flex w-full max-w-[300px] flex-col items-center">
          <div
            className={activeView === 'customer' ? 'w-full' : 'hidden'}
            aria-hidden={activeView !== 'customer'}
          >
            <p className="mb-3 px-2 text-center text-xs font-medium leading-relaxed tracking-[0.06em] text-muted sm:mb-4 sm:text-sm">
              واجهة الزبون — الحجز
            </p>
            <PhoneFrame screenClassName="bg-charcoal text-cream">
              <CustomerBooking onBookingConfirmed={handleBookingConfirmed} />
            </PhoneFrame>
          </div>

          <div
            className={activeView === 'admin' ? 'w-full' : 'hidden'}
            aria-hidden={activeView !== 'admin'}
          >
            <p className="mb-3 px-2 text-center text-xs font-medium leading-relaxed tracking-[0.06em] text-muted sm:mb-4 sm:text-sm">
              لوحة الحلاق — الإدارة
            </p>
            <PhoneFrame screenClassName="bg-charcoal text-cream">
              <AdminDashboard bookings={bookings} />
            </PhoneFrame>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
