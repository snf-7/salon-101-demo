import { useState } from 'react'
import {
  BARBERS,
  DAY_NAMES,
  SERVICES,
  createBookingFromCustomer,
  toArabicDigits,
} from './bookingData'

const BRASS = '#C8A16A'
const TOTAL_STEPS = 5

const STEP_TITLES = {
  1: 'الخدمة',
  2: 'الحلاق',
  3: 'التاريخ والوقت',
  4: 'بياناتك',
  5: 'التأكيد',
}

function buildNextSevenDays() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() + index)
    return {
      key: [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
      ].join('-'),
      dayName: DAY_NAMES[date.getDay()],
      dayNumber: toArabicDigits(date.getDate()),
      label: `${DAY_NAMES[date.getDay()]} ${toArabicDigits(date.getDate())}`,
    }
  })
}

function buildTimeSlots() {
  const slots = []
  const startMinutes = 14 * 60
  const endMinutes = 24 * 60

  for (let minutes = startMinutes; minutes <= endMinutes; minutes += 30) {
    const hour24 = Math.floor(minutes / 60) % 24
    const minute = minutes % 60
    const isMidnight = hour24 === 0
    const hour12 = isMidnight ? 12 : hour24 > 12 ? hour24 - 12 : hour24
    const period = hour24 >= 12 && !isMidnight ? 'م' : 'ص'
    const label = `${toArabicDigits(hour12)}:${toArabicDigits(
      String(minute).padStart(2, '0'),
    )} ${period}`

    slots.push({
      id: `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      label,
    })
  }

  return slots
}

const DATES = buildNextSevenDays()
const TIMES = buildTimeSlots()

const initialForm = {
  serviceId: null,
  barber: null,
  dateKey: null,
  timeId: null,
  name: '',
  phone: '',
}

function BackArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

function CheckIcon({ size = 40, strokeWidth = 2.5 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function SelectionCheck() {
  return (
    <span
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brass text-charcoal"
      aria-hidden="true"
    >
      <CheckIcon size={12} strokeWidth={3} />
    </span>
  )
}

function Monogram101({ size = 'md' }) {
  const boxClass = size === 'lg' ? 'h-[5.5rem] w-[5.5rem]' : 'h-14 w-14'
  const fontSize = size === 'lg' ? '18' : '16'

  return (
    <div className={`mx-auto flex ${boxClass} items-center justify-center`} aria-hidden="true">
      <svg viewBox="0 0 64 64" className="h-full w-full" fill="none">
        <circle cx="32" cy="32" r="30" stroke={BRASS} strokeWidth="1.2" opacity="0.85" />
        <circle cx="32" cy="32" r="25.5" stroke={BRASS} strokeWidth="0.6" opacity="0.4" />
        <path
          d="M18 22.5h28M18 41.5h28"
          stroke={BRASS}
          strokeWidth="0.7"
          opacity="0.55"
        />
        <text
          x="32"
          y="37.5"
          textAnchor="middle"
          fill={BRASS}
          fontFamily='"El Messiri", serif'
          fontSize={fontSize}
          fontWeight="700"
        >
          ١٠١
        </text>
      </svg>
    </div>
  )
}

function SummaryCard({ service, barber, date, time, name, phone }) {
  const rows = [
    { label: 'الخدمة', value: service ? `${service.name} — ${toArabicDigits(service.price)} ريال` : '—' },
    { label: 'الحلاق', value: barber || '—' },
    { label: 'اليوم', value: date?.label || '—' },
    { label: 'الوقت', value: time?.label || '—' },
  ]

  if (name) rows.push({ label: 'الاسم', value: name })
  if (phone) rows.push({ label: 'الجوال', value: phone })

  return (
    <div className="rounded-2xl border border-brass/25 bg-charcoal-raised p-4 shadow-card">
      <p className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-brass">
        ملخص الحجز
      </p>
      <dl className="space-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-3 text-sm leading-relaxed">
            <dt className="shrink-0 text-muted">{row.label}</dt>
            <dd
              className="text-left font-medium text-cream"
              dir={row.label === 'الجوال' ? 'ltr' : undefined}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function CustomerBooking({ onBookingConfirmed }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [confirmed, setConfirmed] = useState(false)
  const [serviceId, setServiceId] = useState(initialForm.serviceId)
  const [barber, setBarber] = useState(initialForm.barber)
  const [dateKey, setDateKey] = useState(initialForm.dateKey)
  const [timeId, setTimeId] = useState(initialForm.timeId)
  const [name, setName] = useState(initialForm.name)
  const [phone, setPhone] = useState(initialForm.phone)

  const service = SERVICES.find((item) => item.id === serviceId) || null
  const date = DATES.find((item) => item.key === dateKey) || null
  const time = TIMES.find((item) => item.id === timeId) || null

  const canProceed = {
    1: Boolean(serviceId),
    2: Boolean(barber),
    3: Boolean(dateKey && timeId),
    4: name.trim().length > 0 && phone.trim().length > 0,
    5: true,
  }[currentStep]

  function resetJourney() {
    setCurrentStep(0)
    setConfirmed(false)
    setServiceId(initialForm.serviceId)
    setBarber(initialForm.barber)
    setDateKey(initialForm.dateKey)
    setTimeId(initialForm.timeId)
    setName(initialForm.name)
    setPhone(initialForm.phone)
  }

  function handleNext() {
    if (!canProceed) return
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((step) => step + 1)
      return
    }

    if (service && barber && dateKey && time) {
      onBookingConfirmed?.(
        createBookingFromCustomer({
          name,
          phone,
          service,
          barber,
          dateKey,
          timeId: time.id,
          timeLabel: time.label,
        }),
      )
    }

    setConfirmed(true)
  }

  function handleBack() {
    if (currentStep <= 0) return
    setCurrentStep((step) => step - 1)
  }

  if (confirmed) {
    return (
      <div className="flex min-h-full flex-col bg-charcoal px-4 pb-6 pt-7 text-cream">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div
            className="booking-check-pop mb-5 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-brass/40 shadow-brass-glow"
            style={{ backgroundColor: 'rgba(200, 161, 106, 0.12)', color: BRASS }}
          >
            <CheckIcon />
          </div>
          <h2 className="font-display text-xl font-bold tracking-wide text-cream">
            تم تأكيد حجزك ✅
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            سيصلك تذكير عبر واتساب
          </p>

          <div className="mt-6 w-full text-right">
            <SummaryCard
              service={service}
              barber={barber}
              date={date}
              time={time}
              name={name}
              phone={phone}
            />
          </div>
        </div>

        <button type="button" onClick={resetJourney} className="primary-btn mt-6">
          حجز جديد
        </button>
      </div>
    )
  }

  if (currentStep === 0) {
    return (
      <div className="flex min-h-full flex-col justify-center bg-charcoal px-5 py-8 text-cream">
        <div className="flex flex-col items-center text-center">
          <div className="welcome-enter welcome-enter-delay-1 relative mb-5">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brass/20 blur-2xl"
              aria-hidden="true"
            />
            <Monogram101 size="lg" />
          </div>

          <h2 className="welcome-enter welcome-enter-delay-2 font-display text-[1.85rem] font-bold leading-snug tracking-wide text-cream">
            صالون ١٠١
          </h2>

          <p className="welcome-enter welcome-enter-delay-3 mt-2 text-sm leading-relaxed text-muted">
            أناقتك تبدأ من هنا
          </p>

          <p className="welcome-enter welcome-enter-delay-4 mt-3 text-[11px] leading-relaxed tracking-wide text-muted/80">
            يومياً من ٢ ظهراً حتى ١٢ منتصف الليل
          </p>

          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="primary-btn welcome-enter welcome-enter-delay-5 mt-8"
          >
            احجز موعدك الآن
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col bg-charcoal px-4 pb-5 pt-2 text-cream">
      <div className="mb-3 flex items-center gap-2">
        <div className="w-8 shrink-0">
          {currentStep >= 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="pressable flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-white/[0.04] hover:text-cream"
              aria-label="رجوع"
            >
              <BackArrowIcon />
            </button>
          ) : null}
        </div>

        <div className="min-w-0 flex-1 text-center">
          <p className="text-[11px] tracking-wide text-muted">
            خطوة {toArabicDigits(currentStep)} من {toArabicDigits(TOTAL_STEPS)}
          </p>
          <div className="mt-2 flex items-center justify-center gap-1.5">
            {Array.from({ length: TOTAL_STEPS }, (_, index) => {
              const step = index + 1
              const active = step === currentStep
              const done = step < currentStep
              return (
                <span
                  key={step}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    active
                      ? 'w-5 bg-brass'
                      : done
                        ? 'w-1.5 bg-brass/55'
                        : 'w-1.5 bg-white/10'
                  }`}
                />
              )
            })}
          </div>
        </div>

        <div className="w-8 shrink-0" />
      </div>

      <header className="mb-5 text-center">
        <div className="mb-3">
          <Monogram101 />
        </div>
        <h2 className="font-display text-[1.35rem] font-bold tracking-wide text-cream">
          صالون ١٠١
        </h2>
        <p className="mt-1 text-sm font-medium tracking-wide text-brass">
          {STEP_TITLES[currentStep]}
        </p>
        <div className="mx-auto mt-4 h-px w-full max-w-[9rem] bg-gradient-to-l from-transparent via-brass/65 to-transparent" />
      </header>

      <div key={currentStep} className="step-enter flex-1">
        {currentStep === 1 && (
          <div className="space-y-2.5">
            {SERVICES.map((item) => {
              const selected = serviceId === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setServiceId(item.id)}
                  className={`select-card flex w-full items-center justify-between gap-3 ${
                    selected ? 'select-card-active' : ''
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    {selected ? <SelectionCheck /> : null}
                    <span
                      className={`min-w-0 break-words text-sm font-medium leading-relaxed ${
                        selected ? 'text-brass' : 'text-cream'
                      }`}
                    >
                      {item.name}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 text-sm tabular-nums tracking-wide ${
                      selected ? 'text-brass' : 'text-muted'
                    }`}
                  >
                    {toArabicDigits(item.price)} ريال
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-2.5">
            {BARBERS.map((person) => {
              const selected = barber === person
              return (
                <button
                  key={person}
                  type="button"
                  onClick={() => setBarber(person)}
                  className={`select-card flex w-full items-center justify-between gap-3 ${
                    selected ? 'select-card-active' : ''
                  }`}
                >
                  <span
                    className={`text-sm font-medium leading-relaxed ${
                      selected ? 'text-brass' : 'text-cream'
                    }`}
                  >
                    {person}
                  </span>
                  {selected ? <SelectionCheck /> : null}
                </button>
              )
            })}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-5">
            <div>
              <p className="mb-2.5 text-[11px] font-semibold tracking-[0.12em] text-muted">
                اختر اليوم
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {DATES.map((day) => {
                  const selected = dateKey === day.key
                  return (
                    <button
                      key={day.key}
                      type="button"
                      onClick={() => setDateKey(day.key)}
                      className={`chip relative flex min-w-[4.4rem] shrink-0 flex-col items-center ${
                        selected ? 'chip-active' : 'text-muted'
                      }`}
                    >
                      {selected ? (
                        <span className="absolute -top-1.5 left-1/2 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-brass text-charcoal">
                          <CheckIcon size={9} strokeWidth={3.2} />
                        </span>
                      ) : null}
                      <span className="text-[10px] font-medium tracking-wide opacity-80">
                        {day.dayName}
                      </span>
                      <span className="mt-0.5 font-display text-lg font-bold tabular-nums leading-none">
                        {day.dayNumber}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <p className="mb-2.5 text-[11px] font-semibold tracking-[0.12em] text-muted">
                اختر الوقت
              </p>
              <div className="flex flex-wrap gap-2">
                {TIMES.map((slot) => {
                  const selected = timeId === slot.id
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setTimeId(slot.id)}
                      className={`chip inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium tabular-nums tracking-wide ${
                        selected ? 'chip-active' : 'text-muted'
                      }`}
                    >
                      {selected ? <CheckIcon size={10} strokeWidth={3} /> : null}
                      {slot.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[11px] tracking-wide text-muted">الاسم</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="اكتب اسمك"
                className="field-input"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] tracking-wide text-muted">
                رقم الجوال
              </span>
              <input
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="05xxxxxxxx"
                className="field-input"
                dir="ltr"
              />
            </label>
            <SummaryCard service={service} barber={barber} date={date} time={time} />
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4">
            <p className="text-center text-sm leading-relaxed text-muted">
              راجع بيانات حجزك ثم أكّد الموعد
            </p>
            <SummaryCard
              service={service}
              barber={barber}
              date={date}
              time={time}
              name={name}
              phone={phone}
            />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={!canProceed}
        className="primary-btn mt-5"
      >
        {currentStep === 5 ? 'تأكيد الحجز' : 'التالي'}
      </button>
    </div>
  )
}

export default CustomerBooking
