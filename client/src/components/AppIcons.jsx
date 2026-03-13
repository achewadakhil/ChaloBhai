import React from 'react'

function BaseIcon({ children, className = '', viewBox = '0 0 24 24' }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox={viewBox}
    >
      {children}
    </svg>
  )
}

export function BrandMark({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.8 9.2L10.4 10.8L9 15.2L13.4 13.6L14.8 9.2Z" />
      <path d="M12 3.5V5.5" />
      <path d="M12 18.5V20.5" />
      <path d="M3.5 12H5.5" />
      <path d="M18.5 12H20.5" />
    </BaseIcon>
  )
}

export function SparkIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <path d="M12 3L13.6 8.4L19 10L13.6 11.6L12 17L10.4 11.6L5 10L10.4 8.4L12 3Z" />
    </BaseIcon>
  )
}

export function ArrowRightIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <path d="M5 12H19" />
      <path d="M13 6L19 12L13 18" />
    </BaseIcon>
  )
}

export function RoadmapIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <path d="M4 18C6 18 6 6 10 6C14 6 14 18 18 18C19.1 18 20 17.1 20 16V8C20 6.9 19.1 6 18 6C14 6 14 18 10 18C6 18 6 6 4 6" />
    </BaseIcon>
  )
}

export function SearchIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20L15.5 15.5" />
    </BaseIcon>
  )
}

export function ProjectIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 5V3" />
      <path d="M16 5V3" />
      <path d="M4 10H20" />
      <path d="M9 14L11 16L15 12" />
    </BaseIcon>
  )
}

export function ClockIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7V12L15.5 14" />
    </BaseIcon>
  )
}

export function ChartIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <path d="M5 18V10" />
      <path d="M12 18V6" />
      <path d="M19 18V13" />
      <path d="M4 18H20" />
    </BaseIcon>
  )
}

export function BotIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <rect x="6" y="8" width="12" height="10" rx="3" />
      <path d="M12 4V8" />
      <path d="M9.5 12H9.51" />
      <path d="M14.5 12H14.51" />
      <path d="M9 15H15" />
    </BaseIcon>
  )
}

export function UserIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19C6.8 15.8 9.1 14.5 12 14.5C14.9 14.5 17.2 15.8 19 19" />
    </BaseIcon>
  )
}

export function TargetIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2.5V5" />
      <path d="M21.5 12H19" />
      <path d="M12 21.5V19" />
      <path d="M2.5 12H5" />
    </BaseIcon>
  )
}

export function FlowIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <circle cx="6" cy="7" r="2" />
      <circle cx="18" cy="7" r="2" />
      <circle cx="12" cy="17" r="2" />
      <path d="M8 7H16" />
      <path d="M7.5 8.5L10.5 15" />
      <path d="M16.5 8.5L13.5 15" />
    </BaseIcon>
  )
}

export function GearIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5V6" />
      <path d="M12 18V20.5" />
      <path d="M20.5 12H18" />
      <path d="M6 12H3.5" />
      <path d="M17.8 6.2L16 8" />
      <path d="M8 16L6.2 17.8" />
      <path d="M17.8 17.8L16 16" />
      <path d="M8 8L6.2 6.2" />
    </BaseIcon>
  )
}

export function GlobeIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12H20.5" />
      <path d="M12 3.5C14.2 5.8 15.5 8.8 15.5 12C15.5 15.2 14.2 18.2 12 20.5" />
      <path d="M12 3.5C9.8 5.8 8.5 8.8 8.5 12C8.5 15.2 9.8 18.2 12 20.5" />
    </BaseIcon>
  )
}

export function BrainIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <path d="M10 4.5C8.1 4.5 6.5 6.1 6.5 8V16C6.5 17.9 8.1 19.5 10 19.5" />
      <path d="M14 4.5C15.9 4.5 17.5 6.1 17.5 8V16C17.5 17.9 15.9 19.5 14 19.5" />
      <path d="M10 9H14" />
      <path d="M10 15H14" />
      <path d="M12 4.5V19.5" />
    </BaseIcon>
  )
}

export function PaletteIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <path d="M12 4C7.6 4 4 7.4 4 11.7C4 15.1 6.6 18 10 18H11.5C12.6 18 13.5 18.9 13.5 20C13.5 20.8 14.2 21.5 15 21.5C18.9 21.5 22 18.3 22 14.5C22 8.7 17.5 4 12 4Z" />
      <circle cx="8" cy="11" r="1" />
      <circle cx="11" cy="8.5" r="1" />
      <circle cx="15" cy="9" r="1" />
      <circle cx="16.5" cy="13" r="1" />
    </BaseIcon>
  )
}

export function WrenchIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <path d="M14.5 6.5A4 4 0 0 0 17.8 11L9 19.8A2.1 2.1 0 1 1 6 16.8L14.8 8A4 4 0 0 0 19.5 3.5L17 6L14.5 6.5Z" />
    </BaseIcon>
  )
}

export function CloudIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <path d="M7 18H17.5A3.5 3.5 0 0 0 18 11A5.5 5.5 0 0 0 7.6 9.2A4 4 0 0 0 7 18Z" />
    </BaseIcon>
  )
}

export function LockIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <rect x="6" y="11" width="12" height="9" rx="2" />
      <path d="M8.5 11V8.5A3.5 3.5 0 0 1 12 5A3.5 3.5 0 0 1 15.5 8.5V11" />
    </BaseIcon>
  )
}

export function PhoneIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <rect x="8" y="3.5" width="8" height="17" rx="2" />
      <path d="M11 17.5H13" />
    </BaseIcon>
  )
}

export function BlocksIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <rect x="4" y="7" width="7" height="7" rx="1.5" />
      <rect x="13" y="7" width="7" height="7" rx="1.5" />
      <rect x="8.5" y="14" width="7" height="7" rx="1.5" />
    </BaseIcon>
  )
}

export function FlaskIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <path d="M10 3.5H14" />
      <path d="M11 3.5V9L6 18A2 2 0 0 0 7.8 21H16.2A2 2 0 0 0 18 18L13 9V3.5" />
      <path d="M8.5 15.5H15.5" />
    </BaseIcon>
  )
}

export function DatabaseIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <ellipse cx="12" cy="6" rx="6.5" ry="2.5" />
      <path d="M5.5 6V17C5.5 18.4 8.4 19.5 12 19.5C15.6 19.5 18.5 18.4 18.5 17V6" />
      <path d="M5.5 11C5.5 12.4 8.4 13.5 12 13.5C15.6 13.5 18.5 12.4 18.5 11" />
    </BaseIcon>
  )
}

export function DashboardIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="5" rx="1.5" />
      <rect x="13" y="11" width="7" height="9" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
    </BaseIcon>
  )
}

export function LogoutIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <path d="M10 5H7.5A2.5 2.5 0 0 0 5 7.5V16.5A2.5 2.5 0 0 0 7.5 19H10" />
      <path d="M14 8L19 12L14 16" />
      <path d="M19 12H10" />
    </BaseIcon>
  )
}

export function ShieldIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <path d="M12 3.5L18.5 6V11.5C18.5 15.5 15.9 18.9 12 20.5C8.1 18.9 5.5 15.5 5.5 11.5V6L12 3.5Z" />
      <path d="M9.5 12.5L11.2 14.2L14.8 10.6" />
    </BaseIcon>
  )
}

export function SunIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5V4.5" />
      <path d="M12 19.5V21.5" />
      <path d="M4.5 12H2.5" />
      <path d="M21.5 12H19.5" />
      <path d="M5.8 5.8L7.2 7.2" />
      <path d="M16.8 16.8L18.2 18.2" />
      <path d="M5.8 18.2L7.2 16.8" />
      <path d="M16.8 7.2L18.2 5.8" />
    </BaseIcon>
  )
}

export function MoonIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <path d="M19 14.5A7.5 7.5 0 1 1 9.5 5A6.2 6.2 0 0 0 19 14.5Z" />
    </BaseIcon>
  )
}

export function MenuIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <path d="M4 7H20" />
      <path d="M4 12H20" />
      <path d="M4 17H20" />
    </BaseIcon>
  )
}

export function CloseIcon({ className = '' }) {
  return (
    <BaseIcon className={className}>
      <path d="M6 6L18 18" />
      <path d="M18 6L6 18" />
    </BaseIcon>
  )
}
