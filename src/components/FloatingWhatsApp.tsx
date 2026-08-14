import React from 'react';

interface FloatingWhatsAppProps {
  isProductPage?: boolean;
}

const FloatingWhatsApp = ({ isProductPage = false }: FloatingWhatsAppProps) => {
  const phoneNumber = '254741045143';
  const message = 'Hi I am Inquiring about';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
  // Hide on product pages (drawer is used instead on mobile)
  if (isProductPage) {
    return null;
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 hover:scale-110 transition-transform duration-200 flex flex-col items-center gap-2"
      aria-label="Chat on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <img
        src="/whatsappicon.png"
        alt="WhatsApp"
        className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-lg hover:drop-shadow-2xl transition-all duration-200"
      />
      <span className="text-xs font-bold text-gray-700 text-center whitespace-nowrap">Have A Question?</span>
    </a>
  );
};

export default FloatingWhatsApp;
