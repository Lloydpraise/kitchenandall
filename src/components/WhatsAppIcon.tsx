interface WhatsAppIconProps {
  className?: string;
  /** Wrap the icon in a white circle so it stays visible on coloured buttons. */
  chip?: boolean;
}

// The one WhatsApp icon used site-wide (public/whatsapp-green.svg).
export default function WhatsAppIcon({ className = 'h-5 w-5', chip = false }: WhatsAppIconProps) {
  const icon = <img src="/whatsapp-green.svg" alt="" aria-hidden="true" className={className} />;
  if (!chip) return icon;
  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-sm">
      {icon}
    </span>
  );
}
