import { useState } from 'react'
import {
  STATUS,
  buildWhatsAppReminderUrl,
  formatArabicDate,
  getTodayKey,
  toArabicDigits,
} from './bookingData'

const FILTERS = [
  { id: 'all', label: 'الكل' },
  { id: STATUS.upcoming, label: STATUS.upcoming },
  { id: STATUS.done, label: STATUS.done },
  { id: STATUS.cancelled, label: STATUS.cancelled },
]

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.28-.14-1.64-.81-1.9-.9-.25-.1-.44-.14-.62.14-.18.27-.71.9-.87 1.08-.16.18-.32.2-.6.07-.28-.14-1.17-.43-2.23-1.37-.82-.73-1.38-1.64-1.54-1.92-.16-.27-.02-.42.12-.56.13-.12.28-.32.42-.48.14-.16.18-.27.28-.45.09-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.05-.22-.53-.45-.46-.62-.47h-.53c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3s.98 2.67 1.12 2.85c.14.18 1.93 2.95 4.68 4.14.65.28 1.17.45 1.57.57.66.21 1.26.18 1.73.11.53-.08 1.64-.67 1.87-1.32.23-.65.23-1.2.16-1.32-.07-.11-.25-.18-.53-.32z" />
      <path d="M12.04 2C6.5 2 2 6.48 2 12c0 1.77.46 3.43 1.27 4.87L2 22l5.27-1.38A9.96 9.96 0 0 0 12.04 22C17.57 22 22 17.52 22 12S17.57 2 12.04 2zm0 18.2a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.13.82.84-3.05-.2-.31A8.18 8.18 0 0 1 3.8 12c0-4.54 3.7-8.22 8.24-8.22 4.54 0 8.23 3.68 8.23 8.22 0 4.54-3.69 8.2-8.23 8.2z" />
    </svg>
  )
}

function statusBadgeClass(status) {
  if (status === STATUS.upcoming) return 'bg-brass/15 text-brass border-brass/35'
  if (status === STATUS.done) return 'bg-emerald-500/15 text-emerald-400/90 border-emerald-500/30'
  return 'bg-red-500/15 text-red-400/90 border-red-500/30'
}

function AdminDashboard({ bookings }) {
  const [filter, setFilter] = useState('all')
  const todayKey = getTodayKey()
  const todayBookings = bookings.filter((item) => item.dateKey === todayKey)
  const expectedRevenue = todayBookings
    .filter((item) => item.status !== STATUS.cancelled)
    .reduce((sum, item) => sum + item.price, 0)

  const visible = bookings.filter((item) =>
    filter === 'all' ? true : item.status === filter,
  )

  return (
    <div className="min-h-full bg-charcoal px-3.5 pb-6 pt-3 text-cream">
      <header className="mb-4 text-center">
        <h2 className="font-display text-[1.05rem] font-bold leading-snug tracking-wide text-cream sm:text-lg">
          لوحة الحلاق — صالون ١٠١
        </h2>
        <p className="mt-1 text-[11px] tracking-wide text-muted">
          {formatArabicDate()}
        </p>
        <div className="mx-auto mt-3 h-px w-full max-w-[10rem] bg-gradient-to-l from-transparent via-brass/65 to-transparent" />
      </header>

      <div className="mb-4 grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl border border-white/10 bg-charcoal-raised p-3 shadow-card">
          <p className="text-[10px] tracking-wide text-muted">مواعيد اليوم</p>
          <p className="mt-1 font-display text-2xl font-bold tabular-nums text-cream">
            {toArabicDigits(todayBookings.length)}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-charcoal-raised p-3 shadow-card">
          <p className="text-[10px] tracking-wide text-muted">الإيراد المتوقع</p>
          <p className="mt-1 font-display text-xl font-bold tabular-nums text-brass">
            {toArabicDigits(expectedRevenue)}
            <span className="mr-1 text-xs font-medium text-muted">ريال</span>
          </p>
        </div>
      </div>

      <div className="mb-4 flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((tab) => {
          const active = filter === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`pressable shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? 'bg-brass text-charcoal'
                  : 'bg-charcoal-raised text-muted ring-1 ring-white/10'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="space-y-2.5">
        {visible.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">لا توجد مواعيد في هذا التصنيف</p>
        ) : (
          visible.map((booking) => (
            <article
              key={booking.id}
              className={`rounded-2xl border border-white/10 bg-charcoal-raised p-3.5 shadow-card ${
                booking.isNew ? 'booking-new-flash' : ''
              }`}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="font-display text-base font-bold text-cream">
                      {booking.name}
                    </p>
                    {booking.isNew ? (
                      <span className="rounded-full bg-brass px-1.5 py-0.5 text-[9px] font-bold text-charcoal">
                        جديد
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs tabular-nums text-brass">{booking.timeLabel}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusBadgeClass(booking.status)}`}
                >
                  {booking.status}
                </span>
              </div>

              <dl className="space-y-1 text-xs leading-relaxed">
                <div className="flex justify-between gap-2">
                  <dt className="text-muted">الخدمة</dt>
                  <dd className="text-cream">{booking.serviceName}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted">الحلاق</dt>
                  <dd className="text-cream">{booking.barber}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted">السعر</dt>
                  <dd className="tabular-nums text-cream">
                    {toArabicDigits(booking.price)} ريال
                  </dd>
                </div>
              </dl>

              {booking.status === STATUS.upcoming ? (
                <a
                  href={buildWhatsAppReminderUrl({
                    name: booking.name,
                    phone: booking.phone,
                    timeLabel: booking.timeLabel,
                    barber: booking.barber,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pressable mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#25D366]/35 bg-[#25D366]/10 px-3 py-2 text-xs font-medium text-[#6FDF9B]"
                >
                  <WhatsAppIcon />
                  تذكير واتساب
                </a>
              ) : null}
            </article>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
