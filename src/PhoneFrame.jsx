function SignalIcon() {
  return (
    <svg
      width="15"
      height="11"
      viewBox="0 0 16 12"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="0" y="8" width="2.5" height="4" rx="0.5" />
      <rect x="4.5" y="5.5" width="2.5" height="6.5" rx="0.5" />
      <rect x="9" y="3" width="2.5" height="9" rx="0.5" />
      <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" opacity="0.35" />
    </svg>
  )
}

function BatteryIcon() {
  return (
    <svg
      width="21"
      height="11"
      viewBox="0 0 22 12"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="0.5"
        y="0.5"
        width="18"
        height="11"
        rx="2.2"
        stroke="currentColor"
        strokeOpacity="0.4"
      />
      <rect x="2.2" y="2.2" width="12.5" height="7.6" rx="1.2" fill="currentColor" />
      <path
        d="M20 3.8v4.4a1.6 1.6 0 0 0 0-4.4z"
        fill="currentColor"
        fillOpacity="0.4"
      />
    </svg>
  )
}

function PhoneFrame({ children, screenClassName = 'bg-cream text-charcoal' }) {
  return (
    <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[300px]">
      {/* Soft floating shadow */}
      <div
        className="pointer-events-none absolute inset-x-4 -bottom-3 top-8 rounded-[2.5rem] bg-black/50 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative rounded-[2.35rem] bg-gradient-to-b from-[#2A2622] via-[#141210] to-[#0A0908] p-[11px] shadow-phone ring-1 ring-white/[0.08]">
        {/* Thin edge highlight */}
        <div
          className="pointer-events-none absolute inset-[1px] rounded-[2.25rem] ring-1 ring-inset ring-white/[0.07]"
          aria-hidden="true"
        />

        <div className="relative overflow-hidden rounded-[1.85rem] bg-charcoal">
          {/* Dynamic Island / notch */}
          <div className="pointer-events-none absolute left-1/2 top-2.5 z-20 flex h-[22px] w-[92px] -translate-x-1/2 items-center justify-center rounded-full bg-black shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <span className="ml-4 h-1.5 w-1.5 rounded-full bg-[#1a1a1a] ring-1 ring-white/10" />
          </div>

          {/* Status bar */}
          <div className="relative z-10 flex items-center justify-between px-5 pb-1.5 pt-3.5 text-[11px] font-medium tracking-wide text-cream/90">
            <span className="tabular-nums">٩:٤١</span>
            <div className="flex items-center gap-1.5 text-cream/85">
              <SignalIcon />
              <BatteryIcon />
            </div>
          </div>

          <div className={`h-[520px] overflow-x-hidden overflow-y-auto ${screenClassName}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhoneFrame
