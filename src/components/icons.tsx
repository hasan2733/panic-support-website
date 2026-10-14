/** Lightweight line icons — calmer than emoji, consistent stroke. */
export function Icon({
  children,
  className = 'w-5 h-5',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function IconHome({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
    </Icon>
  );
}

export function IconJournal({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M7 3.5h9.5A1.5 1.5 0 0 1 18 5v14a1.5 1.5 0 0 1-1.5 1.5H7A2.5 2.5 0 0 1 4.5 18V6A2.5 2.5 0 0 1 7 3.5z" />
      <path d="M8 8h7M8 12h7M8 16h4" />
    </Icon>
  );
}

export function IconLeaf({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M5 19c8-1 13-8 14-15-7 1-14 6-14 15z" />
      <path d="M5 19c3-5 8-9 14-11" />
    </Icon>
  );
}

export function IconBook({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M4.5 5.5A2.5 2.5 0 0 1 7 3h12v16H7a2.5 2.5 0 0 0-2.5 2.5V5.5z" />
      <path d="M7 19h12" />
    </Icon>
  );
}

export function IconChat({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M5 17.5 3.5 21l3.8-1.4A8.5 8.5 0 1 0 5 17.5z" />
    </Icon>
  );
}

export function IconMore({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <circle cx="6" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function IconChart({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M4 19h16" />
      <path d="M7 16v-4M12 16V8M17 16v-7" />
    </Icon>
  );
}

export function IconHands({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M8 13c0-3 1.5-6 4-8 2.5 2 4 5 4 8" />
      <path d="M7 16.5c1.5 2 3.2 3 5 3s3.5-1 5-3" />
    </Icon>
  );
}

export function IconGear({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3V21M4.6 7.2l1.9 1.1M17.5 15.7l1.9 1.1M4.6 16.8l1.9-1.1M17.5 8.3l1.9-1.1" />
    </Icon>
  );
}

export function IconSpark({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M12 3.5 13.6 9 19 10.5 13.6 12 12 17.5 10.4 12 5 10.5 10.4 9z" />
    </Icon>
  );
}

export function IconHelp({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 16.2v.4" />
      <path d="M9.6 9.4a2.4 2.4 0 1 1 3.7 2c-.8.5-1.3 1-1.3 2v.3" />
    </Icon>
  );
}

export function IconClose({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Icon>
  );
}

export function IconSend({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M4 12 20 5l-6.5 14-2.2-6.3z" />
    </Icon>
  );
}

export function IconCheck({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M5 12.5 10 17l9-10" />
    </Icon>
  );
}

export function IconWave({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M3 14c2.5-4 5-4 7.5 0s5 4 7.5 0 5-4 7.5 0" />
    </Icon>
  );
}

export function IconGround({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.8 3.6 5.6 3.6 8.5S14.4 17.7 12 20.5C9.6 17.7 8.4 14.9 8.4 12S9.6 6.3 12 3.5z" />
    </Icon>
  );
}

export function IconHeart({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M12 19s-6.5-4.2-8.2-7.6C2.4 8.8 4 6 6.8 6c1.6 0 3 1 3.7 2.4C11.2 7 12.6 6 14.2 6c2.8 0 4.4 2.8 3 5.4C18.5 14.8 12 19 12 19z" />
    </Icon>
  );
}

export function IconKey({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <circle cx="8" cy="12" r="3.5" />
      <path d="M11.5 12H20v2.5M16.5 12v2.5" />
    </Icon>
  );
}

export function IconStar({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? 'w-5 h-5'}
      aria-hidden
    >
      <path d="M12 3.8 14.2 9l5.6.5-4.2 3.7 1.3 5.5L12 16.4 7.1 18.7l1.3-5.5L4.2 9.5 9.8 9z" />
    </svg>
  );
}
