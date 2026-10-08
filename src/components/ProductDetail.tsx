import { useEffect, useMemo, useState } from 'react';
import { addToCart } from '../stores/cart';
import { parseContent, toBlocks } from '../lib/productContent';

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  old_price?: number | null;
  image_url: string;
  stock_quantity: number;
  major_category?: string | null;
  sub_category?: string | null;
  // Structured copy written by the SEO engine (jsonb). Optional: older products fall back to `description`.
  content?: unknown;
}

const SITE_URL = 'https://kitchenandall.co.ke';
const WHATSAPP = '254741045143';

// Pushes a structured ecommerce event to GTM's dataLayer.
// GTM must be configured (in the GTM UI, not here) to read these fields
// and forward them to the Meta Pixel tag as content_ids / content_type / value.
// content_ids MUST stay numeric product.id (as a string) to match g:id in the
// Google/Meta product feed — this is the field the catalog match rate checks against.
function pushDataLayerEvent(eventName: string, product: Product) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ecommerce: {
      content_type: 'product',
      content_ids: [String(product.id)],
      content_name: product.name,
      value: product.price,
      currency: 'KES',
    },
  });
}

// **bold** lead-ins from the copy
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
        i % 2 ? <strong key={i} className="font-bold text-slate-900">{part}</strong> : <span key={i}>{part}</span>
      )}
    </>
  );
}

// Paragraphs and bullet lists with comfortable reading spacing
function Body({ text, lead = false }: { text: string; lead?: boolean }) {
  return (
    <div className="space-y-4">
      {toBlocks(text).map((b, i) =>
        b.t === 'ul' ? (
          <ul key={i} className="space-y-2 pl-1">
            {b.items.map((item, j) => (
              <li key={j} className="flex gap-3 break-words text-base leading-relaxed text-slate-700">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-600" />
                <span className="min-w-0 break-words"><Inline text={item} /></span>
              </li>
            ))}
          </ul>
        ) : (
          <p key={i} className={`break-words ${lead ? 'text-lg leading-relaxed text-slate-800' : 'text-base leading-[1.75] text-slate-700'}`}>
            <Inline text={b.text} />
          </p>
        )
      )}
    </div>
  );
}

const CheckIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" fill="currentColor">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.99 1.485c-2.873 1.72-4.613 4.47-4.613 7.361 0 2.3.638 4.543 1.848 6.487L2.5 21.5l7.25-1.902c1.863 1.021 3.957 1.56 6.153 1.56 5.803 0 10.5-4.697 10.5-10.5 0-2.822-1.126-5.477-3.175-7.475-2.05-1.997-4.78-3.098-7.65-3.098z" />
  </svg>
);

export default function ProductDetail({ product }: { product: Product }) {
  const [toastVisible, setToastVisible] = useState(false);
  const [questionDrawerOpen, setQuestionDrawerOpen] = useState(false);

  const hasDiscount = Boolean(product.old_price && product.old_price > product.price);
  const discountPercent = useMemo(
    () => hasDiscount ? Math.round(((product.old_price as number) - product.price) / (product.old_price as number) * 100) : 0,
    [hasDiscount, product.old_price, product.price]
  );
  const stockQuantity = product.stock_quantity ?? 20;
  const stockLabel = stockQuantity > 0 ? 'In stock' : 'Out of stock';
  const isOutOfStock = stockQuantity <= 0;

  const content = useMemo(() => parseContent(product), [product]);
  const fallbackIntro = `Our ${product.name} is built for high-volume kitchens and engineered for reliable long-term performance.`;
  const intro = content.intro || fallbackIntro;
  const hasSpecs = content.specs.length > 0;
  const hasFaqs = content.faqs.length > 0;
  const hasOverview = content.sections.length > 0;

  const productUrl = `${SITE_URL}/product/${product.slug}`;
  const whatsappHref = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi, I am interested in the ${product.name}. ${productUrl}`)}`;

  const itemPayload = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    image: product.image_url,
    price: product.price,
  };

  // Fires once when the product page actually renders with product data —
  // this is the "Product views" event Meta reported as Missing.
  useEffect(() => {
    pushDataLayerEvent('view_item', product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const handleAddToCart = () => {
    addToCart(itemPayload);
    pushDataLayerEvent('add_to_cart', product);
    setToastVisible(true);
  };

  const handleBuyNow = () => {
    addToCart(itemPayload);
    pushDataLayerEvent('add_to_cart', product);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('added-to-cart-toast', 'true');
    }
    setToastVisible(true);
    window.setTimeout(() => {
      window.location.href = '/checkout';
    }, 300);
  };

  useEffect(() => {
    if (!toastVisible) return;
    const timer = window.setTimeout(() => setToastVisible(false), 2000);
    return () => window.clearTimeout(timer);
  }, [toastVisible]);

  const navItems = [
    hasOverview && { id: 'overview', label: 'Overview' },
    hasSpecs && { id: 'specifications', label: 'Specifications' },
    hasFaqs && { id: 'faqs', label: 'FAQs' },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <div className="relative bg-slate-100 pb-32 lg:pb-0">
      {/* ───────── Top: image + buying panel ───────── */}
      <div className="mx-auto max-w-7xl px-4 py-10 lg:py-16">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
          <a href="/" className="hover:text-orange-600">Home</a>
          {product.major_category && (<><span aria-hidden="true">/</span><span>{product.major_category}</span></>)}
          {product.sub_category && (<><span aria-hidden="true">/</span><span>{product.sub_category}</span></>)}
        </nav>

        <div className="grid min-w-0 gap-10 lg:grid-cols-[1.05fr_0.95fr] items-start">
          <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_120px_rgba(15,23,42,0.12)] lg:sticky lg:top-24">
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full min-h-[420px] w-full object-cover"
            />
            <div className="absolute inset-x-0 top-6 px-6 flex flex-wrap gap-3">
              <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.35em] ${isOutOfStock ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                {stockLabel}
              </span>
              {hasDiscount && (
                <span className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-xs font-black uppercase tracking-[0.35em] text-white">
                  {discountPercent}% off
                </span>
              )}
            </div>
          </div>

          <div className="min-w-0 space-y-6">
            <div>
              <h1 className="break-words text-3xl font-black uppercase tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {product.name}
              </h1>
              <div className="mt-4">
                <Body text={intro} lead />
              </div>
              <div className="mt-5 flex flex-wrap items-end gap-4">
                <div>
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-black text-slate-900">KSH {Number(product.price).toLocaleString()}</span>
                    {hasDiscount && (
                      <span className="text-sm text-slate-500 line-through">KSH {Number(product.old_price).toLocaleString()}</span>
                    )}
                  </div>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">Price excl. VAT (16%)</p>
                </div>
                <span className={`rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.25em] ${isOutOfStock ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  {isOutOfStock ? 'Out of stock' : 'Available now'}
                </span>
              </div>
            </div>

            {/* Key features: right under the title and price */}
            {content.features.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <h2 className="mb-4 text-xs font-black uppercase tracking-[0.35em] text-slate-500">Key features</h2>
                <ul className="space-y-3">
                  {content.features.map((feature, i) => (
                    <li key={i} className="flex gap-3 text-[15px] leading-snug text-slate-800">
                      <CheckIcon />
                      <span><Inline text={feature} /></span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="inline-flex min-h-[56px] w-full items-center justify-center bg-indigo-700 px-6 py-4 text-sm font-black uppercase tracking-[0.25em] text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  Add to cart
                </button>
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className="inline-flex min-h-[56px] w-full items-center justify-center bg-orange-600 px-6 py-4 text-sm font-black uppercase tracking-[0.25em] text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  Buy now
                </button>
              </div>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex min-h-[52px] w-full items-center justify-center gap-3 border-2 border-green-500 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-green-700 transition hover:bg-green-50"
              >
                <WhatsAppIcon />
                Ask about this product on WhatsApp
              </a>
            </div>

            {hasSpecs && (
              <section id="specifications" className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <h2 className="mb-4 text-xs font-black uppercase tracking-[0.35em] text-slate-500">Specifications</h2>
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full table-fixed text-left text-sm sm:text-base">
                    <tbody>
                      {content.specs.map((spec, i) => (
                        <tr key={i} className={i % 2 ? 'bg-white' : 'bg-slate-50'}>
                          <th scope="row" className="w-2/5 break-words px-3 py-3.5 align-top font-bold text-slate-800 sm:px-4">{spec.label}</th>
                          <td className="break-words px-3 py-3.5 text-slate-600 sm:px-4">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* ───────── Details: overview, specifications, FAQs ───────── */}
      {(hasOverview || hasSpecs || hasFaqs) && (
        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
            <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14">
              {/* In-page navigation: pills on mobile, sticky list on desktop */}
              {navItems.length > 1 && (
                <nav aria-label="On this page" className="min-w-0 max-w-full lg:sticky lg:top-24 lg:self-start">
                  <ul className="flex w-full min-w-0 max-w-full gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
                    {navItems.map((item) => (
                      <li key={item.id} className="shrink-0">
                        <a
                          href={`#${item.id}`}
                          className="block rounded-full border border-slate-200 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-600 transition hover:border-orange-500 hover:text-orange-600 lg:rounded-lg lg:border-0 lg:border-l-4 lg:border-slate-200 lg:py-2.5 lg:pl-4 lg:hover:border-orange-600"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              <div className={`min-w-0 max-w-3xl space-y-14 ${navItems.length > 1 ? '' : 'lg:col-span-2'}`}>
                {hasOverview && (
                  <div id="overview" className="scroll-mt-24 space-y-10">
                    {content.sections.map((section, i) => (
                      <section key={i} className="space-y-4">
                        {section.heading && (
                          <h2 className="break-words text-2xl font-black tracking-tight text-slate-900">{section.heading}</h2>
                        )}
                        <Body text={section.body} />
                      </section>
                    ))}
                  </div>
                )}

                {hasFaqs && (
                  <section id="faqs" className="scroll-mt-24">
                    <h2 className="mb-5 text-2xl font-black tracking-tight text-slate-900">Frequently asked questions</h2>
                    <div className="space-y-3">
                      {content.faqs.map((faq, i) => (
                        <details key={i} className="group rounded-xl border border-slate-200 bg-white open:border-orange-300 open:shadow-sm" open={i === 0}>
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                            <h3 className="min-w-0 break-words text-base font-bold text-slate-900">{faq.q}</h3>
                            <span aria-hidden="true" className="shrink-0 text-2xl leading-none text-orange-600 transition-transform group-open:rotate-45">+</span>
                          </summary>
                          <div className="break-words px-5 pb-5 text-base leading-relaxed text-slate-600"><Inline text={faq.a} /></div>
                        </details>
                      ))}
                    </div>
                  </section>
                )}

                <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-slate-900 p-6 text-white sm:flex-row sm:items-center">
                  <div>
                    <p className="text-lg font-black">Not sure this is the right size or model?</p>
                    <p className="mt-1 text-sm text-slate-300">Message us and we will help you choose.</p>
                  </div>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-3 bg-green-500 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-green-600"
                  >
                    <WhatsAppIcon />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ───────── Mobile sticky bar ───────── */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white px-4 py-4 shadow-[0_-20px_50px_rgba(15,23,42,0.14)]">
        {questionDrawerOpen && (
          <div className="mb-4 rounded-lg bg-slate-50 p-4 border border-slate-200">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-black uppercase text-sm tracking-wider transition"
            >
              <WhatsAppIcon />
              Chat on WhatsApp
            </a>
          </div>
        )}
        <button
          type="button"
          onClick={() => setQuestionDrawerOpen(!questionDrawerOpen)}
          className="mb-2 text-sm font-medium text-blue-600 hover:text-blue-700 underline transition"
        >
          {questionDrawerOpen ? '✕ Close' : 'Have a Question?'}
        </button>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Total</p>
            <p className="text-lg font-black text-slate-900">KSH {Number(product.price).toLocaleString()}</p>
          </div>
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleBuyNow}
            className="inline-flex min-h-[52px] items-center justify-center rounded-none bg-orange-600 px-6 py-4 text-sm font-black uppercase tracking-[0.25em] text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            Buy now
          </button>
        </div>
      </div>

      {toastVisible && (
        <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4 sm:px-0">
          <div className="w-full max-w-md rounded-2xl bg-emerald-600 px-6 py-4 text-center text-sm font-black uppercase tracking-[0.25em] text-white shadow-2xl">
            You have Added item to Cart!
          </div>
        </div>
      )}
    </div>
  );
}