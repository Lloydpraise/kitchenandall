interface WhatsAppIconProps {
  className?: string;
}

export default function WhatsAppIcon({ className = 'h-5 w-5' }: WhatsAppIconProps) {
  return <img src="/whatsapp-svgrepo-com.svg" alt="" aria-hidden="true" className={className} />;
}
