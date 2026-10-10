interface WhatsAppIconProps {
  className?: string;
  green?: boolean;
}

export default function WhatsAppIcon({ className = 'h-5 w-5', green = false }: WhatsAppIconProps) {
  return <img src={green ? '/whatsapp-green.svg' : '/whatsapp-svgrepo-com.svg'} alt="" aria-hidden="true" className={className} />;
}
