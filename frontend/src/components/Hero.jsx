import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, ShoppingBag, Star, Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─── CSS injected once ─── */
const STYLES = `

  :root {
    --hero-ease: cubic-bezier(0.76, 0, 0.24, 1);
  }

  .hero-root * { box-sizing: border-box; }

  /* ── Noise grain overlay ── */
  .hero-grain::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.04;
    pointer-events: none;
    z-index: 2;
    mix-blend-mode: overlay;
  }

  /* ── Image ken-burns ── */
  @keyframes kb {
    0%   { transform: scale(1.08) translate(0px, 0px); }
    50%  { transform: scale(1.13) translate(-12px, -8px); }
    100% { transform: scale(1.08) translate(0px, 0px); }
  }
  .hero-img-animate { animation: kb 14s ease-in-out infinite; }

  /* ── Slide transitions ── */
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(60px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-60px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.92); }
    to   { opacity: 1; transform: scale(1); }
  }

  .anim-slide-right { animation: slideInRight 0.72s var(--hero-ease) forwards; }
  .anim-slide-left  { animation: slideInLeft  0.72s var(--hero-ease) forwards; }
  .anim-fade-up     { animation: fadeUp 0.65s var(--hero-ease) forwards; }
  .anim-scale-in    { animation: scaleIn 0.7s var(--hero-ease) forwards; }

  /* ── Progress bar ── */
  @keyframes bar-progress {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  .progress-bar {
    transform-origin: left;
    animation: bar-progress 5.5s linear forwards;
  }

  /* ── Marquee ── */
  @keyframes marquee-hero {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .marquee-track { animation: marquee-hero 18s linear infinite; }

  /* ── Floating badge pulse ── */
  @keyframes pulse-ring {
    0%   { transform: scale(1);   opacity: 0.6; }
    100% { transform: scale(1.8); opacity: 0; }
  }
  .pulse-ring {
    animation: pulse-ring 2s ease-out infinite;
  }

  /* ── Cursor line blink ── */
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  .cursor-blink { animation: blink 1s step-end infinite; }

  /* ── Hover lift ── */
  .btn-primary { transition: transform 0.25s var(--hero-ease), box-shadow 0.25s ease; }
  .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
  .btn-ghost:hover { background: rgba(255,255,255,0.12) !important; }

  /* ── Dot indicator ── */
  .dot-active {
    transition: width 0.4s var(--hero-ease);
  }
`;

/* ─── Data ─── */
const SLIDES = [
  {
    id: 0,
    kicker: 'وصل حديثاً',
    title: ['أجهزة منزلية'],
    italic: 'بجودة لا تُضاهى',
    body: 'اكتشف أحدث مجموعة من الأجهزة المنزلية الذكية بأسعار حصرية لا تُفوَّت.',
    cta: 'تسوق الآن',
    badge: '٣٠٪ خصم',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1400&q=90',
    palette: { bg: '#f8fafc', accent: '#2650fc', dim: '#e2e8f0', text: '#0f172a' },
    number: '01',
  },
  {
    id: 1,
    kicker: 'عروض الموسم',
    title: ['كل ما تحتاجه'],
    italic: 'لمنزل مثالي',
    body: 'من المطبخ إلى غرفة النوم — تشكيلة واسعة من أفضل الماركات العالمية.',
    cta: 'اكتشف التشكيلة',
    badge: 'شحن مجاني',
    image: 'https://images.unsplash.com/photo-1583845112203-29329902332e?auto=format&fit=crop&w=1400&q=90',
    palette: { bg: '#ffffff', accent: '#0ea5e9', dim: '#f1f5f9', text: '#0f172a' },
    number: '02',
  },
  {
    id: 2,
    kicker: 'الأكثر مبيعاً',
    title: ['تقنية ذكية'],
    italic: 'بأسعار مناسبة',
    body: 'أجهزة الجيل القادم بتصاميم عصرية وأداء استثنائي يناسب كل بيت.',
    cta: 'تعرف أكثر',
    badge: 'ضمان سنة',
    image: 'https://images.unsplash.com/photo-1593344484962-796055d4a3a4?auto=format&fit=crop&w=1400&q=90',
    palette: { bg: '#f0f9ff', accent: '#2563eb', dim: '#e0f2fe', text: '#0f172a' },
    number: '03',
  },
];

const MARQUEE_ITEMS = ['أجهزة منزلية', '●', 'تقنية ذكية', '●', 'عروض حصرية', '●', 'شحن سريع', '●', 'ضمان معتمد', '●'];

/* ─── Animated Counter ─── */
const Counter = ({ target, suffix = '' }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        const start = performance.now();
        const dur = 1600;
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const e2 = 1 - Math.pow(1 - p, 4);
          setVal(Math.floor(e2 * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref} className='space-x-3'>{val.toLocaleString('ar-EG')}{suffix}</span>;
};

/* ─── Hero ─── */
const Hero = () => {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [key, setKey] = useState(0);
  const timerRef = useRef(null);

  const slide = SLIDES[active];
  const { palette } = slide;

  const goTo = useCallback((idx) => {
    if (transitioning || idx === active) return;
    clearInterval(timerRef.current);
    setPrev(active);
    setTransitioning(true);
    setTimeout(() => {
      setActive(idx);
      setKey(k => k + 1);
      setTransitioning(false);
      setPrev(null);
    }, 650);
  }, [active, transitioning]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      goTo((active + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(timerRef.current);
  }, [active, goTo]);

  return (
    <>
      <style>{STYLES}</style>
      <section
        className="hero-root hero-grain relative overflow-hidden"
        dir="rtl"
        style={{
          minHeight: '100svh',
          background: palette.bg,
          transition: 'background 0.8s ease',
          fontFamily: "'Tajawal', sans-serif",
        }}
      >
        {/* ── FULL BG IMAGE ── */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {SLIDES.map((s, i) => (
            <div
              key={s.id}
              className="absolute inset-0"
              style={{
                opacity: i === active ? (transitioning ? 0 : 1) : (i === prev ? (transitioning ? 1 : 0) : 0),
                transition: 'opacity 0.7s ease',
              }}
            >
              <img
                src={s.image}
                alt=""
                className="w-full h-full object-cover hero-img-animate"
                style={{ opacity: 0.22 }}
              />
            </div>
          ))}
          {/* Deep vignette */}
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 60% 50%, transparent 20%, ${palette.bg}cc 70%, ${palette.bg} 100%)` }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to left, ${palette.bg}00 0%, ${palette.bg}88 40%, ${palette.bg} 75%)` }} />
          <div className="absolute bottom-0 left-0 right-0 h-40" style={{ background: `linear-gradient(to top, ${palette.bg}, transparent)` }} />
        </div>

        {/* ── ACCENT GLOW ── */}
        <div
          className="absolute pointer-events-none z-0"
          style={{
            width: 600, height: 600,
            top: '50%', right: '25%',
            transform: 'translate(50%, -50%)',
            background: `radial-gradient(circle, ${palette.accent}18 0%, transparent 65%)`,
            filter: 'blur(40px)',
            transition: 'background 1s ease',
          }}
        />

       
        {/* ── RIGHT THUMBNAILS ── */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden xl:flex flex-col gap-3" style={{ paddingLeft: 48 }}>
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className="relative overflow-hidden rounded-xl transition-all duration-500"
              style={{
                width: i === active ? 64 : 52,
                height: i === active ? 72 : 60,
                outline: i === active ? `2px solid ${palette.accent}` : '2px solid transparent',
                outlineOffset: 2,
                opacity: i === active ? 1 : 0.45,
              }}
            >
              <img src={s.image} alt="" className="w-full h-full object-cover" />
              {i === active && (
                <div className="absolute inset-0" style={{ background: `${s.palette.accent}25` }} />
              )}
            </button>
          ))}
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="relative z-10 flex flex-col min-h-[100svh]">
          {/* Center content */}
          <div className="flex-1 flex items-center px-8 md:px-20 py-10" style={{ paddingRight: 100 }}>
            <div className="grid lg:grid-cols-[1fr_420px] gap-12 w-full max-w-screen-xl mx-auto items-center">

              {/* ─ Text Column ─ */}
              <div>
                {/* Kicker */}
                <div
                  key={`kicker-${key}`}
                  className="anim-fade-up mb-6 inline-flex items-center gap-3"
                  style={{ animationDelay: '0s', opacity: 0 }}
                >
                  <div className="relative">
                    <div
                      className="h-2 w-2 rounded-full pulse-ring absolute inset-0"
                      style={{ background: palette.accent }}
                    />
                    <div className="h-2 w-2 rounded-full" style={{ background: palette.accent }} />
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: 5, textTransform: 'uppercase',
                    color: palette.accent,
                  }}>
                    {slide.kicker}
                  </span>
                  <div style={{ height: 1, width: 40, background: `${palette.accent}60` }} />
                </div>

                {/* Giant headline */}
                <h1 style={{ lineHeight: 0.95, marginBottom: 16 }}>
                  {slide.title.map((word, wi) => (
                    <div
                      key={`word-${key}-${wi}`}
                      className="anim-slide-right overflow-hidden"
                      style={{
                        animationDelay: `${0.08 + wi * 0.1}s`,
                        opacity: 0,
                        display: 'block',
                      }}
                    >
                      <span style={{
                        fontSize: 'clamp(42px, 10vw, 60px)',
                        fontWeight: 900,
                        fontFamily: 'Tajawal',
                        color: palette.text,
                        display: 'block',
                      }}>
                        {word}
                      </span>
                    </div>
                  ))}

                  {/* Italic accent line */}
                  <div
                    key={`italic-${key}`}
                    className="anim-slide-right pt-4"
                    style={{ animationDelay: '0.28s', opacity: 0 }}
                  >
                    <span style={{
                      fontSize: 'clamp(42px, 10vw, 60px)',
                      fontWeight: 700,
                      fontFamily: 'Playfair Display',
                      fontStyle: 'italic',
                      color: palette.accent,
                      display: 'block',
                      letterSpacing: -1,
                    }}>
                      {slide.italic}
                    </span>
                  </div>
                </h1>

                {/* Divider */}
                <div
                  key={`divider-${key}`}
                  className="anim-fade-up my-8"
                  style={{ animationDelay: '0.38s', opacity: 0 }}
                >
                  <div style={{ height: 1, background: `linear-gradient(to left, ${palette.accent}60, transparent)`, maxWidth: 280 }} />
                </div>

                {/* Body */}
                <p
                  key={`body-${key}`}
                  className="anim-fade-up"
                  style={{
                    animationDelay: '0.42s', opacity: 0,
                    fontSize: 17, lineHeight: 1.9, fontWeight: 400,
                    color: `${palette.text}70`,
                    maxWidth: 420, marginBottom: 40,
                  }}
                >
                  {slide.body}
                </p>

                {/* CTAs */}
                <div
                  key={`cta-${key}`}
                  className="anim-fade-up flex flex-wrap gap-4 items-center"
                  style={{ animationDelay: '0.5s', opacity: 0 }}
                >
                  <Link
                    to="/shop"
                    className="btn-primary flex items-center gap-3 font-bold rounded-2xl text-sm"
                    style={{
                      padding: '14px 28px',
                      background: palette.accent,
                      color: '#ffffff',
                      letterSpacing: 0.5,
                      fontSize: 14,
                      fontWeight: 800,
                    }}
                  >
                    <ShoppingBag size={16} />
                    {slide.cta}
                    <ArrowRight size={15} style={{ transform: 'rotate(180deg)' }} />
                  </Link>

                  <button
                    className="btn-ghost flex items-center gap-3 font-bold rounded-2xl text-sm"
                    style={{
                      padding: '14px 24px',
                      background: `${palette.text}08`,
                      border: `1px solid ${palette.text}15`,
                      color: `${palette.text}80`,
                      fontSize: 14,
                    }}
                  >
                    <span
                      className="flex items-center justify-center rounded-full"
                      style={{ height: 28, width: 28, background: `${palette.text}10`, border: `1px solid ${palette.text}15` }}
                    >
                      <Play size={11} fill="currentColor" />
                    </span>
                    شاهد الفيديو
                  </button>

                  <span
                    className="text-xs font-black rounded-xl px-4 py-2"
                    style={{ background: `${palette.accent}15`, color: palette.accent, border: `1px solid ${palette.accent}30` }}
                  >
                    🎁 {slide.badge}
                  </span>
                </div>

                {/* Stats row */}
                <div
                  key={`stats-${key}`}
                  className="anim-fade-up flex gap-10 mt-12 pt-8"
                  style={{
                    animationDelay: '0.6s', opacity: 0,
                    borderTop: `1px solid ${palette.text}10`,
                  }}
                >
                  {[
                    { label: 'منتج', val: 1200, suf: '+' },
                    { label: 'عميل سعيد', val: 500, suf: '+' },
                    { label: 'تقييم', val: 4.9, suf: '★' },
                  ].map(({ label, val, suf }) => (
                    <div key={label} className="">
                      <p className="font-black tabular-nums" style={{ fontSize: 26, color: palette.text, lineHeight: 1 }}>
                        <Counter target={val} suffix={suf} />
                      </p>
                      <p style={{ fontSize: 11, color: `${palette.text}40`, marginTop: 6, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ─ Image Column ─ */}
              <div className="hidden lg:block relative" style={{ height: 560 }}>

                {/* Main image card */}
                <div
                  key={`imgcard-${key}`}
                  className="anim-scale-in absolute"
                  style={{
                    animationDelay: '0.15s', opacity: 0,
                    inset: 0,
                    borderRadius: 32,
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={slide.image}
                    alt=""
                    className="w-full h-full object-cover hero-img-animate"
                  />
                  {/* Color-tinted gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(145deg, ${palette.accent}22 0%, transparent 50%, rgba(0,0,0,0.5) 100%)` }}
                  />
                </div>

                {/* Review pill — bottom */}
                <div
                  key={`review-${key}`}
                  className="anim-fade-up absolute bottom-5 right-5 left-5 flex items-center gap-4 rounded-2xl px-5 py-4"
                  style={{
                    animationDelay: '0.55s', opacity: 0,
                    background: 'rgba(0,0,0,0.55)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div className="flex -space-x-2 rtl:space-x-reverse">
                    {['أ', 'م', 'س'].map((l, i) => (
                      <div
                        key={l}
                        className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-black text-white"
                        style={{ background: [palette.accent, '#3b82f6', '#1e293b'][i], border: '2px solid rgba(255,255,255,0.1)' }}
                      >
                        {l}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-white text-xs font-bold">٥٠٠+ عميل راضٍ</p>
                    <div className="flex gap-0.5  mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={9} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                      ))}
                    </div>
                  </div>
                </div>
 

              </div>
            </div>
          </div>

          {/* ── MARQUEE TICKER ── */}
          <div
            className="relative overflow-hidden py-4 select-none"
            style={{
              borderTop: `1px solid ${palette.text}10`,
              background: `${palette.dim}80`,
            }}
          >
            <div className="marquee-track flex gap-8 whitespace-nowrap" style={{ width: 'max-content' }}>
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase',
                    color: i % 2 === 0 ? `${palette.text}40` : palette.accent,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── TOP PROGRESS LINE ── */}
        <div className="absolute top-0 left-0 right-0 h-[2px] z-30" style={{ background: `${palette.text}10` }}>
          <div
            key={`progress-${active}`}
            className="progress-bar h-full"
            style={{ background: `linear-gradient(to right, ${palette.accent}, ${palette.accent}80)` }}
          />
        </div>

      </section>
    </>
  );
};

export default Hero;