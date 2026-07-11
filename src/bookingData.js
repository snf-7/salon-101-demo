export const SERVICES = [
  { id: 'haircut', name: 'قص شعر', price: 40 },
  { id: 'beard', name: 'حلاقة ذقن', price: 25 },
  { id: 'combo', name: 'قص + ذقن', price: 55 },
  { id: 'dye', name: 'صبغة شعر', price: 70 },
  { id: 'moroccan', name: 'حمام مغربي', price: 50 },
  { id: 'thread', name: 'تنظيف بالخيط', price: 15 },
]

export const BARBERS = ['مصطفى', 'أمير', 'خالد']

export const DAY_NAMES = [
  'الأحد',
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
]

export const MONTH_NAMES = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
]

export const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'

export const STATUS = {
  upcoming: 'قادم',
  done: 'مكتمل',
  cancelled: 'ملغي',
}

export function toArabicDigits(value) {
  return String(value).replace(/\d/g, (digit) => ARABIC_DIGITS[digit])
}

export function getTodayKey(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

export function formatArabicDate(date = new Date()) {
  return `${DAY_NAMES[date.getDay()]} ${toArabicDigits(date.getDate())} ${MONTH_NAMES[date.getMonth()]} ${toArabicDigits(date.getFullYear())}`
}

export function formatTimeLabel(timeId) {
  const [hourStr, minuteStr] = timeId.split(':')
  const hour24 = Number(hourStr)
  const minute = Number(minuteStr)
  const isMidnight = hour24 === 0
  const hour12 = isMidnight ? 12 : hour24 > 12 ? hour24 - 12 : hour24
  const period = hour24 >= 12 && !isMidnight ? 'م' : 'ص'
  return `${toArabicDigits(hour12)}:${toArabicDigits(String(minute).padStart(2, '0'))} ${period}`
}

export function toWhatsAppNumber(phone) {
  const digits = String(phone).replace(/\D/g, '')
  if (digits.startsWith('966')) return digits
  if (digits.startsWith('05')) return `966${digits.slice(1)}`
  if (digits.startsWith('5') && digits.length === 9) return `966${digits}`
  return digits
}

export function buildWhatsAppReminderUrl({ name, phone, timeLabel, barber }) {
  const international = toWhatsAppNumber(phone)
  const message = `مرحباً ${name}، نذكّرك بموعدك في صالون ١٠١ اليوم الساعة ${timeLabel} مع الحلاق ${barber}. نراك قريباً ✂️`
  return `https://wa.me/${international}?text=${encodeURIComponent(message)}`
}

function serviceById(id) {
  return SERVICES.find((item) => item.id === id)
}

export function createSeedBookings() {
  const dateKey = getTodayKey()
  const seed = [
    {
      id: 'seed-1',
      name: 'عبدالله العتيبي',
      phone: '0551234567',
      serviceId: 'combo',
      barber: 'مصطفى',
      timeId: '16:00',
      status: STATUS.upcoming,
    },
    {
      id: 'seed-2',
      name: 'فهد الشمري',
      phone: '0509876543',
      serviceId: 'haircut',
      barber: 'أمير',
      timeId: '14:30',
      status: STATUS.done,
    },
    {
      id: 'seed-3',
      name: 'سلمان الحربي',
      phone: '0534567890',
      serviceId: 'dye',
      barber: 'خالد',
      timeId: '18:00',
      status: STATUS.upcoming,
    },
    {
      id: 'seed-4',
      name: 'نايف القحطاني',
      phone: '0541122334',
      serviceId: 'beard',
      barber: 'مصطفى',
      timeId: '15:00',
      status: STATUS.cancelled,
    },
    {
      id: 'seed-5',
      name: 'تركي الدوسري',
      phone: '0567788990',
      serviceId: 'moroccan',
      barber: 'أمير',
      timeId: '20:30',
      status: STATUS.upcoming,
    },
  ]

  return seed.map((item) => {
    const service = serviceById(item.serviceId)
    return {
      ...item,
      dateKey,
      serviceName: service.name,
      price: service.price,
      timeLabel: formatTimeLabel(item.timeId),
      isNew: false,
    }
  })
}

export function createBookingFromCustomer({
  name,
  phone,
  service,
  barber,
  dateKey,
  timeId,
  timeLabel,
}) {
  return {
    id: `booking-${Date.now()}`,
    name: name.trim(),
    phone: phone.trim(),
    serviceId: service.id,
    serviceName: service.name,
    price: service.price,
    barber,
    dateKey,
    timeId,
    timeLabel,
    status: STATUS.upcoming,
    isNew: true,
  }
}
