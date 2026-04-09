'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

/* ================================================================
   CONSTANTS & DATA
   ================================================================ */

const SKOOL_BASE = 'https://www.skool.com/sakekring'
const FOUNDING = { current: 23, total: 100 }

const FAQ_DATA = [
  {
    q: 'Is dit regtig heeltemal gratis?',
    a: 'Ja, die Gemeenskapslid-vlak is 100% gratis, vir altyd. Jy kan aansluit sonder enige koste en kry toegang tot die gemeenskapschat en openbare gebeure.',
  },
  {
    q: 'Ek volg Boermedia reeds op Facebook. Hoekom moet ek ook by Sakekring aansluit?',
    a: "Facebook se algoritme besluit watter plasings jy sien. Op Sakekring is alles georganiseer in kursusse en kalenders. Jy mis niks nie. Daarbenewens is daar 'n privaat sakekring waar jy regstreeks met ander Afrikaanse sakemense kan netwerk, iets wat Facebook nie bied nie.",
  },
  {
    q: 'Wat is die verskil tussen Sakevennoot en Sakeleier?',
    a: 'Sakevennoot gee jou volle toegang tot alle Boermedia-inhoud, lives, kursusse en privaat gesprekke. Sakeleier bou daarop voort en is spesifiek vir besigheidseienaars wat hul besigheid wil bemark, met een Boermedia-besigheidsplasing per kwartaal, plasing in die besigheidsgids, en toegang tot privaat strategiesessies.',
  },
  {
    q: 'Hoe werk die Boermedia-besigheidsplasing in Sakeleier?',
    a: 'Elke Sakeleier kry een professionele besigheidsplasing per kwartaal op Boermedia se Facebook (147 000+ volgers) of YouTube (27 000+ intekenare). Dit is dieselfde tipe plasing wat normaalweg R2 500 tot R10 000 elk kos.',
  },
  {
    q: 'Kan ek my plan opgradeer of afgradeer?',
    a: 'Ja, enige tyd. Geen kontrak, geen wagperiode. Jy kan vandag opgradeer en more afgradeer as dit nie vir jou werk nie.',
  },
  {
    q: 'Wat is Skool en hoekom gebruik julle dit?',
    a: "Skool is 'n internasionaal-erkende gemeenskapsplatform wat spesifiek vir kursusse, gemeenskappe en lewendige gebeure ontwerp is. Dit is veiliger en georganiseerder as Facebook of WhatsApp, en jy kan dit op enige toestel gebruik.",
  },
  {
    q: 'Hoeveel tyd vat dit om aan te sluit?',
    a: 'Minder as \'n minuut. Klik op "Sluit Aan", beantwoord 2 vrae, en jy is deel van die kring.',
  },
]

const FREE_FEATURES_INCLUDED = [
  'Gemeenskapschat met sakemense',
  'Gemeenskap Gebeure',
  'Netwerk met eendersdenkendes',
  'Skool-app op enige toestel',
]

const FREE_FEATURES_EXCLUDED = [
  'Weeklikse Boermedia-inhoud',
  'Alle kursusse',
  'Privaat gebeure',
  'Besigheidsblootstelling',
]

const SAKEVENNOOT_FEATURES = [
  'Weeklikse Boermedia-inhoud, lives en uitsaaie',
  'Alle kursusse en opleidingsmateriaal',
  'Eksklusiewe gesprekke en ledegebeure',
  'Maandelikse vraag-en-antwoord met Boermedia-span',
  'Prioriteit-ondersteuning',
]

const SAKELEIER_FEATURES = [
  'Een Boermedia-besigheidsplasing per kwartaal',
  'Plasing in die Sakekring besigheidsgids',
  'ALLE gebeure, ook privaat strategiesessies',
  'Kursusse vir eienaar en tot 5 werknemers',
  'Direkte kanaal na Boermedia-span',
]

/* ================================================================
   HELPERS
   ================================================================ */

function getUtmParams(): string {
  if (typeof window === 'undefined') return ''
  const params = new URLSearchParams(window.location.search)
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
  const utms = new URLSearchParams()
  utmKeys.forEach((k) => {
    const v = params.get(k)
    if (v) utms.set(k, v)
  })
  return utms.toString()
}

function buildSkoolUrl(ref: string): string {
  const utms = getUtmParams()
  let url = `${SKOOL_BASE}?ref=${ref}`
  if (utms) url += `&${utms}`
  return url
}

/* ================================================================
   SVG ICON COMPONENTS
   ================================================================ */

function CheckIcon({ className = 'w-5 h-5 text-sk-green' }: { className?: string }) {
  return (
    <svg className={`${className} flex-shrink-0 mt-0.5`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="w-5 h-5 text-sk-stone-light flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export default function SakekringLanding() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isMonthly, setIsMonthly] = useState(true)
  const [openFaq, setOpenFaq] = useState(0)
  const [navSolid, setNavSolid] = useState(false)
  const [foundingCount, setFoundingCount] = useState(0)
  const [barWidth, setBarWidth] = useState(0)
  const foundingAnimated = useRef(false)
  const foundingRef = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const toggleBtnRef = useRef<HTMLButtonElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  // Nav scroll
  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 100)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Fade-up observer
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.15 },
    )
    document.querySelectorAll('.fade-up').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // Founding counter
  useEffect(() => {
    if (!foundingRef.current) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !foundingAnimated.current) {
            foundingAnimated.current = true
            setTimeout(() => setBarWidth((FOUNDING.current / FOUNDING.total) * 100), 100)
            let c = 0
            const step = Math.ceil(FOUNDING.current / 30)
            const iv = setInterval(() => {
              c = Math.min(c + step, FOUNDING.current)
              setFoundingCount(c)
              if (c >= FOUNDING.current) clearInterval(iv)
            }, 30)
          }
        })
      },
      { threshold: 0.3 },
    )
    obs.observe(foundingRef.current)
    return () => obs.disconnect()
  }, [])

  // UTM wiring
  useEffect(() => {
    const utms = getUtmParams()
    if (utms) {
      document.querySelectorAll<HTMLAnchorElement>(`a[href="${SKOOL_BASE}"]`).forEach((a) => {
        a.href = `${SKOOL_BASE}?${utms}`
      })
    }
  }, [])

  // Drawer focus trap
  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeDrawer(); return }
      if (e.key !== 'Tab' || !drawerRef.current) return
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>('button, a, [tabindex]:not([tabindex="-1"])')
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen])

  const openDrawer = useCallback(() => {
    setDrawerOpen(true)
    document.body.style.overflow = 'hidden'
    setTimeout(() => closeBtnRef.current?.focus(), 100)
  }, [])

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
    document.body.style.overflow = ''
    toggleBtnRef.current?.focus()
  }, [])

  const trackTierClick = useCallback((tier: string) => {
    const url = buildSkoolUrl(tier)
    const w = window as unknown as Record<string, unknown>
    if (typeof w.fbq === 'function') {
      ;(w.fbq as Function)('track', 'Lead', {
        content_name: `sakekring_${tier}`,
        value: tier === 'free' ? 0 : tier === 'sakevennoot' ? 250 : 1000,
        currency: 'ZAR',
      })
    }
    if (typeof w.gtag === 'function') {
      ;(w.gtag as Function)('event', 'generate_lead', { event_category: 'pricing', event_label: tier })
    }
    window.open(url, '_blank')
  }, [])

  return (
    <>
      {/* ============================================================ */}
      {/* NAVIGATION                                                    */}
      {/* ============================================================ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20"
        style={{
          backgroundColor: navSolid ? 'rgba(10,22,40,0.95)' : 'transparent',
          backdropFilter: navSolid ? 'blur(16px)' : 'none',
          borderBottom: navSolid ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-8 sm:px-6 h-full flex items-center justify-between">
          <a href="#" className="flex flex-col">
            <span className="text-white font-display font-extrabold text-2xl leading-none">Sakekring</span>
            <span className="text-white/40 font-body font-medium leading-none block" style={{ fontSize: '0.6rem', letterSpacing: '0.28em' }}>DEUR BOERMEDIA</span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a href="#hoe-dit-werk" className="text-white/70 hover:text-white font-body text-sm font-medium transition-colors">Hoe Dit Werk</a>
            <a href="#pryse" className="text-white/70 hover:text-white font-body text-sm font-medium transition-colors">Pryse</a>
            <a href="#vrae" className="text-white/70 hover:text-white font-body text-sm font-medium transition-colors">Vrae</a>
            <a href={SKOOL_BASE} className="bg-sk-green hover:bg-sk-green-dark text-white font-body text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5" style={{ boxShadow: '0 4px 12px rgba(45,106,79,0.3)' }}>Sluit Gratis Aan</a>
          </div>
          <button ref={toggleBtnRef} onClick={openDrawer} className="md:hidden text-white p-2" aria-label="Menu" aria-expanded={drawerOpen} aria-controls="mobile-drawer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        ref={drawerRef}
        id="mobile-drawer"
        role="dialog"
        aria-modal={true}
        aria-label="Navigasie"
        className={`fixed inset-0 z-[60] bg-sk-navy/95 backdrop-blur-lg flex flex-col items-center justify-center gap-6 transform transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <button ref={closeBtnRef} onClick={closeDrawer} className="absolute top-6 right-6 text-white p-2" aria-label="Sluit menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
        <a href="#" onClick={closeDrawer} className="text-white text-xl font-body font-semibold">Tuis</a>
        <a href="#hoe-dit-werk" onClick={closeDrawer} className="text-white text-xl font-body font-semibold">Hoe Dit Werk</a>
        <a href="#pryse" onClick={closeDrawer} className="text-white text-xl font-body font-semibold">Pryse</a>
        <a href="#vrae" onClick={closeDrawer} className="text-white text-xl font-body font-semibold">Vrae</a>
        <a href={SKOOL_BASE} className="mt-4 bg-sk-green text-white font-body text-lg font-bold px-10 py-4 rounded-xl w-64 text-center">Sluit Gratis Aan</a>
      </div>

      {/* ============================================================ */}
      {/* HERO                                                          */}
      {/* ============================================================ */}
      <section className="relative bg-sk-navy overflow-hidden min-h-screen flex items-center pt-20">
        {/* Hero background image */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-desktop.jpg"
            alt=""
            className="hidden md:block w-full h-full object-cover object-center"
            loading="eager"
          />
          <img
            src="/images/hero-mobile.jpg"
            alt=""
            className="block md:hidden w-full h-full object-cover object-top"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sk-navy/90 via-sk-navy/75 to-sk-navy/40" />
        </div>
        <div className="absolute inset-0 opacity-60" style={{ background: 'radial-gradient(ellipse 80% 60% at 70% 30%, rgba(45,106,79,0.15) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-8 sm:px-6 py-24 md:py-32 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7 flex flex-col">
              <div className="inline-flex items-center gap-2.5 mb-8 self-start">
                <div className="relative w-2 h-2">
                  <div className="absolute inset-0 rounded-full bg-sk-green" />
                  <div className="absolute inset-0 rounded-full bg-sk-green animate-ping opacity-75" />
                </div>
                <span className="font-body font-bold text-xs uppercase tracking-[0.15em] text-sk-green">Boermedia Sakekring, 147 000+ volgers sterk</span>
              </div>
              <h1 className="text-white font-display font-extrabold tracking-tight leading-[1.02] mb-8" style={{ fontSize: 'clamp(2.4rem,5.2vw,4.8rem)' }}>
                Die <span className="text-sk-green">volkseie sakekring</span> waar Afrikaanse besighede mekaar bou.
              </h1>
              <p className="text-white/75 font-body text-lg md:text-xl leading-relaxed max-w-xl mb-10">
                Sluit gratis aan by Boermedia se privaat sakekring. 230+ Afrikaanse sakemense, weeklikse inhoud, lives en netwerkgeleenthede. Geen Facebook-drama.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                <a href={SKOOL_BASE} className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-sk-green hover:bg-sk-green-dark text-white font-body font-semibold rounded-2xl transition-all duration-200 hover:-translate-y-1" style={{ padding: '24px 40px', fontSize: '1.125rem', minHeight: '72px', boxShadow: '0 8px 24px rgba(45,106,79,0.4)' }}>
                  Sluit Gratis Aan, Dit Neem 30 Sekondes
                  <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-white/70 font-body text-sm mb-10">
                {['Geen kredietkaart nodig', 'Geen verpligtinge', 'Werk op foon, tablet en rekenaar'].map((t) => (
                  <span key={t} className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-sk-green" />
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[
                    { initials: 'JB', bg: 'bg-sk-green' },
                    { initials: 'MV', bg: 'bg-sk-gold-deep' },
                    { initials: 'PD', bg: 'bg-sk-brown' },
                    { initials: 'AK', bg: 'bg-sk-green-dark' },
                    { initials: '+200', bg: 'bg-sk-stone', small: true },
                  ].map(({ initials, bg, small }) => (
                    <div key={initials} className={`w-12 h-12 rounded-full ${bg} border-[3px] border-sk-navy flex items-center justify-center text-white font-body font-bold ${small ? 'text-xs' : 'text-sm'}`}>{initials}</div>
                  ))}
                </div>
                <div>
                  <div className="font-body font-semibold text-white text-sm">230+ sakemense reeds aanlyn</div>
                  <div className="font-body text-white/50 text-xs">Uit elke provinsie van Suid-Afrika</div>
                </div>
              </div>
            </div>

            {/* Stat card */}
            <div className="hidden lg:block lg:col-span-5 relative">
              <div className="absolute -inset-4 bg-sk-green/10 rounded-[40px] blur-3xl" />
              <div className="relative bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative"><div className="w-3 h-3 rounded-full bg-sk-green" /><div className="absolute inset-0 w-3 h-3 rounded-full bg-sk-green animate-ping" /></div>
                  <span className="font-display font-bold text-white text-2xl">Sakekring Gemeenskap</span>
                </div>
                <p className="font-body text-sm text-white/60 mb-8">Boermedia se Amptelike Sakenetwerk</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { num: '147K+', label: 'Facebook Volgers' },
                    { num: '27K+', label: 'YouTube Intekenare' },
                    { num: '1 400+', label: "Video's" },
                    { num: '2019', label: 'Sedert' },
                  ].map(({ num, label }) => (
                    <div key={label} className="rounded-xl p-5" style={{ background: 'linear-gradient(135deg, rgba(45,106,79,0.15), rgba(45,106,79,0.05))' }}>
                      <div className="font-body font-extrabold text-white text-3xl leading-none mb-1">{num}</div>
                      <div className="font-body font-medium text-[10px] uppercase tracking-wider text-sk-green-light/70">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-sk-green animate-pulse" />
                  <span className="font-body text-xs text-white/60">Aktief sedert 2019, 147 000+ volgers sterk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TRUST BAR                                                     */}
      {/* ============================================================ */}
      <section className="bg-sk-cream-warm border-y border-sk-border-light py-8">
        <div className="max-w-5xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 items-center">
            {[
              { num: '147K+', label: 'Facebook Volgers' },
              { num: '27K+', label: 'YouTube Intekenare' },
              { num: '1 400+', label: "Video's Gepubliseer" },
              { num: 'Sedert 2019', label: 'Volkseie Mediahuis' },
            ].map(({ num, label }) => (
              <div key={label} className="text-center">
                <div className="font-body font-extrabold text-2xl md:text-3xl text-sk-navy leading-none mb-1">{num}</div>
                <div className="font-body font-medium text-xs uppercase tracking-wider text-sk-stone">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* HOE DIT WERK — 3 STEPS                                       */}
      {/* ============================================================ */}
      <section id="hoe-dit-werk" className="bg-sk-cream py-24 md:py-16 sm:py-12">
        <div className="max-w-7xl mx-auto px-8 sm:px-6">
          <div className="text-center mb-16 fade-up">
            <h2 className="font-display font-extrabold text-sk-navy text-4xl md:text-5xl leading-tight tracking-tight mb-3">Sluit Aan In Drie Eenvoudige Stappe</h2>
            <p className="font-body text-sk-stone text-lg">Van klik tot binne in onder &apos;n minuut.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto fade-up">
            {[
              { step: 1, title: 'Klik "Sluit Aan"', desc: 'Een klik op enige groen knoppie op hierdie bladsy.' },
              { step: 2, title: 'Beantwoord 2 Vrae', desc: 'Skool vra net jou naam en wat jy doen.' },
              { step: 3, title: 'Jy Is Binne', desc: 'Begin dadelik netwerk met 230+ Afrikaanse sakemense.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative bg-sk-cream-warm rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1" style={{ boxShadow: '0 2px 12px rgba(10,22,40,0.06)' }}>
                <div className="w-12 h-12 rounded-full bg-sk-green text-white flex items-center justify-center mx-auto mb-5 font-body font-extrabold text-lg">{step}</div>
                <h3 className="font-display font-bold text-lg text-sk-navy mb-2">{title}</h3>
                <p className="font-body text-sk-stone text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* HOEKOM SAKEKRING BESTAAN — 4 REASONS                         */}
      {/* ============================================================ */}
      <section className="bg-white py-24 md:py-16 sm:py-12">
        <div className="max-w-7xl mx-auto px-8 sm:px-6">
          <div className="text-center mb-16 fade-up">
            <span className="font-body font-bold text-sm uppercase tracking-[0.1em] text-sk-green">Die Rede</span>
            <h2 className="font-display font-extrabold text-sk-navy text-4xl md:text-5xl leading-tight tracking-tight mt-4 mb-3">Hoekom Sakekring Bestaan</h2>
            <p className="font-body text-sk-stone text-lg max-w-lg mx-auto leading-relaxed">Facebook is raserig. WhatsApp-groepe is chaos. Sakekring is anders.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 fade-up">
            {[
              { title: 'Geen Facebook-Drama', desc: "Geen algoritme. Geen onsigbare plasings. Net 'n privaat ruimte vir sakemense wat regtig wil bou.", img: '/images/hoekom-facebook-drama.jpg', alt: 'Frustrasie met sosiale media' },
              { title: 'Volkseie Netwerk', desc: '230+ Afrikaanse sakemense op een platform. Eenmansake tot gevestigde ondernemings. Almal hier om te help.', img: '/images/hoekom-volkseie-netwerk.jpg', alt: 'Privaat sakenetwerk vergadering' },
              { title: 'Inhoud, Georganiseer', desc: '1 400+ videos netjies in kursusse en kalenders ingedeel. Geen soek nie.', img: '/images/hoekom-inhoud-georganiseer.jpg', alt: 'Georganiseerde besigheidsinhoud' },
              { title: 'Werklike Verhoudings', desc: 'Een goeie verbinding kan jou besigheid verander. Sakekring maak dit moontlik.', img: '/images/hoekom-werklike-verbindings.jpg', alt: 'Sakemense skud hande by netwerkgeleentheid' },
            ].map(({ title, desc, img, alt }) => (
              <div key={title} className="rounded-2xl border border-sk-border-light bg-white overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1">
                <div className="h-48 sm:h-40 overflow-hidden">
                  <img src={img} alt={alt} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-6">
                  <h4 className="font-display font-bold text-base text-sk-navy mb-2">{title}</h4>
                  <p className="font-body text-sk-stone text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PRODUCT PREVIEW                                               */}
      {/* ============================================================ */}
      <section className="bg-sk-navy py-24 md:py-16 sm:py-12">
        <div className="max-w-7xl mx-auto px-8 sm:px-6">
          <div className="text-center mb-16 fade-up">
            <span className="font-body font-bold text-sm uppercase tracking-[0.1em] text-sk-green-light">Binne-Kyk</span>
            <h2 className="font-display font-extrabold text-white text-4xl md:text-5xl leading-tight tracking-tight mt-4 mb-3">Hoe Lyk Dit Binne Sakekring?</h2>
            <p className="font-body text-white/50 text-lg max-w-lg mx-auto leading-relaxed">Boermedia se inhoud, Skool se platform, jou besigheid se groei.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 fade-up">
            {/* Chat mockup */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1">
              <div className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-sk-green/60" />
                <span className="font-body text-white/40 text-xs font-medium ml-1">Gemeenskapschat</span>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { initials: 'JH', bg: 'bg-sk-green-dark', msg: 'Iemand met BTW-ervaring wat kan help?' },
                  { initials: 'MV', bg: 'bg-sk-gold-deep', msg: "Soek 'n goeie grafiese ontwerper in PTA" },
                  { initials: 'PD', bg: 'bg-sk-navy-alt', msg: "Wie ken 'n goeie boekhouer?" },
                ].map(({ initials, bg, msg }) => (
                  <div key={initials} className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full ${bg} flex-shrink-0 flex items-center justify-center text-white text-[10px] font-body font-bold`}>{initials}</div>
                    <div className="bg-white/[0.04] rounded-xl px-4 py-2.5 text-white/70 font-body text-sm">{msg}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Courses mockup */}
            <div className="relative bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1">
              <img src="/images/binne-kursusse.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" loading="lazy" />
              <div className="relative z-10">
                <div className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-sk-gold/60" />
                  <span className="font-body text-white/40 text-xs font-medium ml-1">Kursusse en Lives</span>
                </div>
                <div className="p-5 space-y-3">
                  {[
                    { title: 'Inleiding tot Meta Advertensies', sub: '3 lesse', color: 'green' },
                    { title: 'Boekhou Vir Eienaars', sub: '5 lesse', color: 'gold' },
                    { title: 'Hoe Om Jou Besigheid Te Verkoop', sub: 'Live', color: 'green' },
                  ].map(({ title, sub, color }) => (
                    <div key={title} className="rounded-xl p-4 flex items-center gap-3" style={{ background: color === 'green' ? 'linear-gradient(135deg, rgba(45,106,79,0.1), rgba(45,106,79,0.03))' : 'linear-gradient(135deg, rgba(201,169,97,0.08), rgba(201,169,97,0.02))' }}>
                      <div className={`w-10 h-10 rounded-lg ${color === 'green' ? 'bg-sk-green/15' : 'bg-sk-gold/10'} flex items-center justify-center flex-shrink-0`}>
                        <svg className={`w-5 h-5 ${color === 'green' ? 'text-sk-green-light' : 'text-sk-gold'}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                      </div>
                      <div>
                        <div className="text-white font-body text-sm font-semibold">{title}</div>
                        <div className="font-body text-white/30 text-xs">{sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Calendar mockup */}
            <div className="relative bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1">
              <img src="/images/binne-kalender.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" loading="lazy" />
              <div className="relative z-10">
                <div className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-sk-green/60" />
                  <span className="font-body text-white/40 text-xs font-medium ml-1">Kalender en Gebeure</span>
                </div>
                <div className="p-5 space-y-3">
                  {[
                    { date: '15 April', title: 'Maandelikse Lede-Q&A', sub: 'Regstreekse uitsaai', color: 'green' },
                    { date: '22 April', title: 'Live: Belasting vir Sakemense', sub: 'Netwerkgeleentheid', color: 'gold' },
                    { date: '5 Mei', title: 'Privaat Strategiesessie', sub: 'Strategiesessie', color: 'green' },
                  ].map(({ date, title, sub, color }) => (
                    <div key={date} className="rounded-xl p-4" style={{ background: color === 'green' ? 'linear-gradient(135deg, rgba(45,106,79,0.1), rgba(45,106,79,0.03))' : 'linear-gradient(135deg, rgba(201,169,97,0.08), rgba(201,169,97,0.02))' }}>
                      <div className={`${color === 'green' ? 'text-sk-green-light' : 'text-sk-gold'} font-body text-xs font-bold uppercase tracking-wide mb-1`}>{date}</div>
                      <div className="text-white font-body text-sm font-semibold">{title}</div>
                      <div className="font-body text-white/30 text-xs mt-1">{sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TESTIMONIALS                                                   */}
      {/* ============================================================ */}
      <section className="bg-sk-cream-warm py-24 md:py-16 sm:py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-body font-bold text-sm uppercase tracking-[0.1em] text-sk-green">Ons Lede</span>
            <h2 className="font-display font-extrabold text-sk-navy text-4xl md:text-5xl leading-tight tracking-tight mt-4 mb-3">Sakemense Soos Jy</h2>
            <p className="font-body text-sk-navy/50 text-lg max-w-lg mx-auto leading-relaxed">Van plaaseienaars tot jong entrepreneurs — Sakekring bring Afrikaanse besighede bymekaar.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-sk-border-light">
              <img src="/images/testimonial-farmer.jpg" alt="Sakekring lid — ervare sakeman" className="w-full h-72 object-cover object-top" loading="lazy" />
              <div className="p-8">
                <p className="font-body text-sk-navy/70 text-lg italic leading-relaxed">&ldquo;Sakekring het my gehelp om die regte mense te ontmoet wat my besigheid verstaan. Dis nie nog &apos;n Facebook-groep nie — dis &apos;n werklike netwerk.&rdquo;</p>
                <p className="font-body font-bold text-sk-navy mt-4">— Sakekring Lid, Vrystaat</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-sk-border-light">
              <img src="/images/testimonial-entrepreneur.jpg" alt="Sakekring lid — jong entrepreneur" className="w-full h-72 object-cover object-top" loading="lazy" />
              <div className="p-8">
                <p className="font-body text-sk-navy/70 text-lg italic leading-relaxed">&ldquo;Die kursusse en netwerk is presies wat ek as jong entrepreneur nodig gehad het. Ek het binne twee weke my eerste kliënt via Sakekring gekry.&rdquo;</p>
                <p className="font-body font-bold text-sk-navy mt-4">— Sakekring Lid, Kaapstad</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* MID-PAGE CTA                                                  */}
      {/* ============================================================ */}
      <section className="bg-sk-green py-20 relative overflow-hidden">
        <div className="absolute inset-0 diagonal-pattern" />
        <div className="relative z-10 max-w-7xl mx-auto px-8 text-center">
          <h3 className="font-display text-white font-extrabold text-3xl md:text-4xl tracking-tight mb-3">Sluit Nou Gratis Aan, Dit Neem 30 Sekondes</h3>
          <p className="font-body text-white/70 text-lg mb-8">Geen koste. Geen kredietkaart. Geen verpligtinge.</p>
          <a href={SKOOL_BASE} className="group inline-flex items-center gap-3 bg-white text-sk-green-dark font-body font-bold text-base px-10 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
            Ja, Ek Wil Aansluit
            <ArrowIcon className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PRICING                                                       */}
      {/* ============================================================ */}
      <section id="pryse" className="relative overflow-hidden py-24 md:py-20 sm:py-12">
        <div className="absolute inset-0">
          <img src="/images/pricing-aerial-farm.jpg" alt="" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-sk-cream/[0.92]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 sm:px-6">
          {/* Founding member banner */}
          <div ref={foundingRef} className="max-w-4xl mx-auto mb-8 p-5 px-8 rounded-xl border border-sk-gold flex flex-col md:flex-row md:items-center gap-6 fade-up" style={{ background: 'linear-gradient(135deg, #F4EBD0 0%, #EDE6D3 100%)' }}>
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-sk-gold-soft flex items-center justify-center">
                <svg className="w-6 h-6 text-sk-gold-deep" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              </div>
            </div>
            <div className="flex-grow">
              <div className="text-sk-gold-deep font-body font-bold text-xs uppercase tracking-widest mb-1">Stigterslede-Aanbod</div>
              <div className="text-sk-shadow font-body font-medium text-sm">Eerste 100 Sakeleiers betaal R1 000/maand vir altyd. Daarna styg die prys na R1 500/maand.</div>
            </div>
            <div className="w-full md:w-48 flex-shrink-0">
              <div className="h-2 bg-sk-cream-deep rounded-full overflow-hidden">
                <div className="h-full bg-sk-gold-deep rounded-full transition-all duration-1000 ease-out" style={{ width: `${barWidth}%` }} />
              </div>
              <div className="text-sk-gold-deep font-body font-semibold text-xs mt-2 md:text-right">{foundingCount} / 100 plekke</div>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-4 fade-up">
            <span className="text-sk-green font-body font-bold text-sm uppercase tracking-[0.1em]">Prysvlakke</span>
            <h2 className="font-display font-extrabold text-sk-navy text-4xl md:text-5xl lg:text-6xl leading-tight mt-4">Kies Die Vlak Wat By Jou Pas</h2>
            <p className="font-body text-sk-stone text-lg leading-relaxed mt-4 max-w-2xl mx-auto">Begin gratis. Groei wanneer jy gereed is. Geen kontrak. Kanselleer enige tyd.</p>
          </div>

          {/* Toggle */}
          <div className="flex justify-center mb-14 fade-up">
            <div className="inline-flex p-1 bg-sk-cream-deep rounded-full" style={{ boxShadow: '0 1px 3px rgba(10,22,40,0.04)' }}>
              <button onClick={() => setIsMonthly(true)} className={`px-7 py-3 rounded-full font-body font-semibold text-sm transition-all duration-200 ${isMonthly ? 'bg-sk-navy text-white scale-[1.02]' : 'text-sk-stone'}`}>Maandeliks</button>
              <button onClick={() => setIsMonthly(false)} className={`px-7 py-3 rounded-full font-body font-semibold text-sm transition-all duration-200 ${!isMonthly ? 'bg-sk-navy text-white scale-[1.02]' : 'text-sk-stone'}`}>Jaarliks <span className="text-xs ml-1 opacity-80">(Spaar 17%)</span></button>
            </div>
          </div>

          {/* Cards */}
          <div className="grid lg:grid-cols-3 gap-8 items-stretch fade-up">
            {/* GRATIS */}
            <div className="bg-white border border-sk-border-light rounded-3xl p-10 flex flex-col min-h-[680px] order-1 transition-all duration-300 hover:-translate-y-1" style={{ boxShadow: '0 1px 3px rgba(10,22,40,0.04)' }}>
              <span className="inline-block self-start bg-sk-cream-deep text-sk-stone font-body font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-4">Gratis</span>
              <h3 className="font-display font-bold text-2xl text-sk-navy mb-4">Gemeenskapslid</h3>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="font-display font-extrabold text-6xl text-sk-navy leading-none">R0</span>
                <span className="font-body font-medium text-base text-sk-stone">/vir altyd</span>
              </div>
              <p className="font-body font-medium text-sm text-sk-green mb-6">100% gratis, geen verborge koste</p>
              <div className="h-px bg-sk-border-light mb-6" />
              <ul className="flex-grow space-y-3.5 mb-6">
                {FREE_FEATURES_INCLUDED.map((f) => (
                  <li key={f} className="flex items-start gap-3"><CheckIcon /><span className="font-body font-medium text-sm text-sk-shadow">{f}</span></li>
                ))}
                {FREE_FEATURES_EXCLUDED.map((f) => (
                  <li key={f} className="flex items-start gap-3"><XIcon /><span className="font-body font-medium text-sm text-sk-stone-light">{f}</span></li>
                ))}
              </ul>
              <button onClick={() => trackTierClick('free')} className="w-full py-4 px-6 bg-white border-2 border-sk-navy text-sk-navy font-body font-semibold text-base rounded-xl transition-all duration-200 hover:bg-sk-navy hover:text-white cursor-pointer">Sluit Gratis Aan</button>
            </div>

            {/* SAKEVENNOOT */}
            <div className="bg-white border border-sk-border-light rounded-3xl p-10 flex flex-col min-h-[680px] order-2 transition-all duration-300 hover:-translate-y-1" style={{ boxShadow: '0 1px 3px rgba(10,22,40,0.04)' }}>
              <span className="inline-block self-start bg-sk-green-soft text-sk-green-dark font-body font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-4">Gewild</span>
              <h3 className="font-display font-bold text-2xl text-sk-navy mb-4">Sakevennoot</h3>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="font-display font-extrabold text-6xl text-sk-navy leading-none">{isMonthly ? 'R250' : 'R2 500'}</span>
                <span className="font-body font-medium text-base text-sk-stone">{isMonthly ? '/maand' : '/jaar'}</span>
              </div>
              <p className="font-body font-medium text-sm text-sk-green mb-1">{isMonthly ? 'Minder as R9 per dag' : 'Spaar R500, twee maande gratis'}</p>
              <div className="h-4" />
              <div className="h-px bg-sk-border-light mb-6" />
              <div className="font-body font-bold text-xs uppercase tracking-wider text-sk-green mb-4">Alles in Gratis, plus:</div>
              <ul className="flex-grow space-y-3.5 mb-6">
                {SAKEVENNOOT_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3"><CheckIcon /><span className="font-body font-medium text-sm text-sk-shadow">{f}</span></li>
                ))}
              </ul>
              <button onClick={() => trackTierClick('sakevennoot')} className="w-full py-4 px-6 bg-sk-green text-white font-body font-semibold text-base rounded-xl transition-all duration-200 hover:bg-sk-green-dark hover:-translate-y-0.5 cursor-pointer" style={{ boxShadow: '0 4px 12px rgba(45,106,79,0.25)' }}>Word &apos;n Sakevennoot</button>
              <p className="text-center font-body font-medium text-xs text-sk-stone mt-3">Geen kontrak. Kanselleer enige tyd.</p>
            </div>

            {/* SAKELEIER */}
            <div className="relative bg-white border-2 border-sk-gold rounded-3xl p-10 flex flex-col min-h-[680px] lg:-mt-4 order-3 transition-all duration-300 hover:-translate-y-1" style={{ boxShadow: '0 12px 32px rgba(201,169,97,0.18)', background: 'linear-gradient(180deg, #F4EBD0 0%, white 80px)' }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sk-gold-deep text-white font-body font-bold text-xs uppercase tracking-widest px-6 py-2 rounded-full" style={{ boxShadow: '0 4px 12px rgba(176,141,63,0.3)' }}>Beste Waarde</div>
              <div className="h-2" />
              <h3 className="font-display font-bold text-2xl text-sk-navy mb-4 mt-2">Sakeleier</h3>
              <div className="flex items-baseline gap-1.5 mb-4">
                <span className="font-display font-extrabold text-6xl text-sk-navy leading-none">{isMonthly ? 'R1 000' : 'R10 000'}</span>
                <span className="font-body font-medium text-base text-sk-stone">{isMonthly ? '/maand' : '/jaar'}</span>
              </div>
              {!isMonthly && <p className="font-body font-medium text-sm text-sk-green mb-0">Spaar R2 000, twee maande gratis</p>}
              <div className="rounded-xl p-5 mb-6" style={{ background: 'rgba(201,169,97,0.08)', border: '1px solid rgba(201,169,97,0.2)' }}>
                <p className="font-body font-semibold text-xs uppercase tracking-wider text-sk-gold-deep mb-2">Advertensiewaarde</p>
                <p className="font-body font-extrabold text-2xl text-sk-navy leading-none mb-2">R2 500 - R10 000</p>
                <p className="font-body text-sm text-sk-stone leading-snug">As Sakeleier kry jy <span className="text-sk-gold-deep font-bold">VIER</span> advertensies per jaar, plus alles in Sakevennoot.</p>
              </div>
              <div className="font-body font-bold text-xs uppercase tracking-wider text-sk-gold-deep mb-4">Alles in Sakevennoot, plus:</div>
              <ul className="flex-grow space-y-3.5 mb-6">
                {SAKELEIER_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-3"><CheckIcon /><span className="font-body font-medium text-sm text-sk-shadow">{f}</span></li>
                ))}
              </ul>
              <button onClick={() => trackTierClick('sakeleier')} className="w-full py-4 px-6 bg-sk-gold-deep text-white font-body font-semibold text-base rounded-xl transition-all duration-200 hover:bg-sk-gold hover:-translate-y-0.5 cursor-pointer" style={{ boxShadow: '0 6px 16px rgba(176,141,63,0.35)' }}>Word &apos;n Sakeleier</button>
              <p className="text-center font-body font-semibold text-xs text-sk-gold-deep mt-3">Stigtersprys, beperk tot eerste 100</p>
            </div>
          </div>

          <p className="text-center font-body text-sm text-sk-stone mt-12">Geen kontrak. Kanselleer enige tyd. Geen verborge koste.</p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ABOUT BOERMEDIA                                               */}
      {/* ============================================================ */}
      <section className="bg-sk-navy py-24 md:py-16 sm:py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center fade-up">
            {/* Image column */}
            <div className="rounded-2xl overflow-hidden shadow-lg order-2 md:order-1">
              <img
                src="/images/about-boermedia-studio.jpg"
                alt="Boermedia se professionele inhoudstudio"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            {/* Text column */}
            <div className="order-1 md:order-2">
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center mb-8" style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F)', boxShadow: '0 8px 24px rgba(27,67,50,0.3)' }}>
                <span className="text-sk-gold font-display font-extrabold text-3xl tracking-tight">BM</span>
              </div>
              <h2 className="font-display font-extrabold text-white text-4xl md:text-5xl leading-tight tracking-tight mb-6">Boermedia se Amptelike Sakekring</h2>
              <p className="font-body text-white/70 text-base leading-relaxed mb-4">Sakekring is Boermedia se privaat gemeenskap vir Afrikaanse sakemense. Dieselfde inhoud, lives en netwerk wat jy ken, nou in &apos;n skoon, privaat Skool-omgewing sonder Facebook se geraas.</p>
              <p className="font-body text-white/50 text-base leading-relaxed mb-8">Boermedia bou sedert 2019 aan Suid-Afrika se grootste volkseie digitale mediahuis. Sakekring is die volgende stap, &apos;n plek waar ons gemeenskap werklik kan saamwerk, leer en groei.</p>
              <div className="flex gap-4 mb-8">
                <a href="https://www.facebook.com/boermedia" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white font-body text-sm font-medium px-5 py-3 rounded-xl hover:bg-white/10 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.025 4.388 11.025 10.125 11.927v-8.437H7.078v-3.49h3.047V9.41c0-3.018 1.793-4.685 4.533-4.685 1.313 0 2.688.235 2.688.235v2.953h-1.513c-1.492 0-1.955.929-1.955 1.882v2.263h3.328l-.532 3.49h-2.796v8.437C19.612 23.098 24 18.098 24 12.073z" /></svg>
                  Volg op Facebook
                </a>
                <a href="https://www.youtube.com/@boermedia" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white font-body text-sm font-medium px-5 py-3 rounded-xl hover:bg-white/10 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                  Volg op YouTube
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: '147K+', label: 'Facebook Volgers' },
                  { num: '27K+', label: 'YouTube Intekenare' },
                  { num: '1 400+', label: "Video's Gepubliseer" },
                  { num: 'Sedert 2019', label: 'Volkseie digitale mediahuis' },
                ].map(({ num, label }) => (
                  <div key={label} className="rounded-xl p-6" style={{ background: 'linear-gradient(135deg, rgba(45,106,79,0.12), rgba(45,106,79,0.04))' }}>
                    <div className="font-body font-extrabold text-2xl text-white mb-1">{num}</div>
                    <div className="font-body text-sm text-white/60">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CONTENT FLOW                                                  */}
      {/* ============================================================ */}
      <section className="bg-sk-navy py-24 md:py-16 sm:py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-8 sm:px-6">
          <div className="text-center mb-16 fade-up">
            <span className="font-body font-bold text-sm uppercase tracking-[0.1em] text-sk-green-light">Hoe Dit Werk</span>
            <h2 className="font-display font-extrabold text-white text-4xl md:text-5xl leading-tight tracking-tight mt-4 mb-3">Boermedia Se Inhoud, Direk Na Jou</h2>
            <p className="font-body text-white/50 text-lg max-w-xl mx-auto leading-relaxed">Weeklikse video&apos;s, lives en insigte word outomaties in Sakekring se Skool-kalender en kursusse ingelaai. Geen ekstra werk nie.</p>
          </div>
          <div className="max-w-4xl mx-auto fade-up">
            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-sk-green via-sk-gold to-sk-green-light opacity-30" style={{ transform: 'translateY(-50%)' }} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
                {[
                  { icon: <><polygon points="23 7 16 12 23 17" /><rect x="1" y="5" width="15" height="14" rx="2" /></>, title: 'Boermedia', sub: 'Video\'s, Lives en Insigte', color: 'green' },
                  { icon: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>, title: 'Sakekring Kalender', sub: 'Kursusse en Gebeure', color: 'gold' },
                  { icon: <><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>, title: 'Jou Skerm', sub: 'Enige toestel, enige plek', color: 'green', last: true },
                ].map(({ icon, title, sub, color, last }, i) => (
                  <div key={title} className="flex flex-col items-center text-center relative">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 relative z-10" style={{
                      background: color === 'gold' ? 'linear-gradient(135deg, rgba(201,169,97,0.15), rgba(201,169,97,0.05))' : 'linear-gradient(135deg, rgba(45,106,79,0.2), rgba(45,106,79,0.08))',
                      border: color === 'gold' ? '1px solid rgba(201,169,97,0.2)' : '1px solid rgba(45,106,79,0.2)',
                    }}>
                      <svg className={`w-9 h-9 ${color === 'gold' ? 'text-sk-gold' : 'text-sk-green-light'}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">{icon}</svg>
                    </div>
                    <h4 className="font-display font-bold text-lg text-white mb-1">{title}</h4>
                    <p className="font-body text-white/40 text-sm">{sub}</p>
                    {!last && (
                      <svg className="md:hidden w-6 h-6 text-sk-green-light/40 mt-4 rotate-90" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FAQ                                                           */}
      {/* ============================================================ */}
      <section id="vrae" className="bg-white py-24 md:py-16 sm:py-12">
        <div className="max-w-7xl mx-auto px-8 sm:px-6">
          <div className="text-center mb-16 fade-up">
            <h2 className="font-display font-extrabold text-sk-navy text-4xl md:text-5xl leading-tight tracking-tight mb-3">Vrae Wat Ons Gereeld Kry</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-3 fade-up">
            {FAQ_DATA.map((faq, i) => (
              <div key={i} className={`faq-item bg-sk-cream border border-sk-border-light rounded-xl ${openFaq === i ? 'open' : ''}`}>
                <div className="faq-q flex justify-between items-center px-6 py-5 cursor-pointer" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  <span className="font-body font-semibold text-[15px] text-sk-navy pr-4">{faq.q}</span>
                  <svg className="faq-icon w-5 h-5 text-sk-stone flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <div className="faq-answer px-6 font-body text-sm text-sk-stone leading-relaxed pb-5">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Texture divider */}
      <div className="relative h-3 overflow-hidden">
        <img src="/images/texture-leather-wood.jpg" alt="" className="w-full h-full object-cover opacity-40" loading="lazy" />
      </div>

      {/* ============================================================ */}
      {/* FINAL CTA                                                     */}
      {/* ============================================================ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/cta-sunrise-road.jpg" alt="" className="w-full h-full object-cover object-center" loading="lazy" />
          <div className="absolute inset-0 bg-sk-navy/70" />
        </div>
        <div className="relative z-10 max-w-[720px] mx-auto px-8 text-center">
          <p className="text-sk-gold font-body text-sm font-semibold mb-6">Stigterslede-Aanbod aktief: {foundingCount} van 100 Sakeleier-plekke gevul</p>
          <h2 className="font-display font-extrabold text-white text-4xl md:text-5xl leading-tight tracking-tight mb-4">Jou Toekoms In Besigheid Begin Met Een Stap</h2>
          <p className="font-body text-white/50 text-lg leading-relaxed mb-8">Sluit aan by 230+ Afrikaanse sakemense wat reeds saam bou, saam groei en mekaar ondersteun.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-body text-sm text-white/40 mb-10">
            {['Geen kredietkaart nodig', 'Geen kontrak', 'Kanselleer enige tyd'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckIcon className="w-4 h-4 text-sk-green-light" />
                {t}
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <a href={SKOOL_BASE} className="bg-sk-green hover:bg-sk-green-dark text-white font-body font-semibold text-base px-10 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5" style={{ boxShadow: '0 8px 24px rgba(45,106,79,0.35)' }}>Sluit Gratis Aan</a>
            <a href={SKOOL_BASE} className="border-2 border-white/20 hover:border-white/40 text-white font-body font-semibold text-base px-10 py-4 rounded-xl transition-all hover:bg-white/5">Word &apos;n Sakeleier</a>
          </div>
          <a href="https://wa.me/27644004488?text=Hallo%2C%20ek%20het%20%27n%20vraag%20oor%20Sakekring" className="inline-flex items-center gap-2 text-white/30 hover:text-sk-green-light font-body text-sm transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.61.61l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.326 0-4.491-.752-6.249-2.027l-.436-.326-3.248 1.088 1.088-3.248-.326-.436A9.953 9.953 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" /></svg>
            Vrae? WhatsApp ons: 064 400 4488
          </a>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FOOTER                                                        */}
      {/* ============================================================ */}
      <footer className="bg-[#060E1A] border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-8 sm:px-6 grid md:grid-cols-3 gap-10">
          <div>
            <div className="font-display text-white font-bold text-lg mb-3">Sakekring</div>
            <p className="font-body text-white/30 text-sm leading-relaxed mb-4">Boermedia se amptelike sakekring vir Afrikaanse sakemense.</p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/boermedia" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.025 4.388 11.025 10.125 11.927v-8.437H7.078v-3.49h3.047V9.41c0-3.018 1.793-4.685 4.533-4.685 1.313 0 2.688.235 2.688.235v2.953h-1.513c-1.492 0-1.955.929-1.955 1.882v2.263h3.328l-.532 3.49h-2.796v8.437C19.612 23.098 24 18.098 24 12.073z" /></svg>
              </a>
              <a href="https://www.youtube.com/@boermedia" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all" aria-label="YouTube">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
            </div>
          </div>
          <div>
            <div className="font-body text-white/30 text-xs font-bold uppercase tracking-widest mb-4">Skakels</div>
            <ul className="space-y-2.5">
              <li><a href="#" className="font-body text-white/30 hover:text-white text-sm transition-colors">Tuis</a></li>
              <li><a href="#hoe-dit-werk" className="font-body text-white/30 hover:text-white text-sm transition-colors">Hoe Dit Werk</a></li>
              <li><a href="#pryse" className="font-body text-white/30 hover:text-white text-sm transition-colors">Pryse</a></li>
              <li><a href="#vrae" className="font-body text-white/30 hover:text-white text-sm transition-colors">Vrae</a></li>
              <li><a href="#" className="font-body text-white/30 hover:text-white text-sm transition-colors">Kontak</a></li>
            </ul>
          </div>
          <div>
            <div className="font-body text-white/30 text-xs font-bold uppercase tracking-widest mb-4">Regskennis</div>
            <ul className="space-y-2.5 mb-6">
              <li><a href="#" className="font-body text-white/30 hover:text-white text-sm transition-colors">Privaatheidsbeleid</a></li>
              <li><a href="#" className="font-body text-white/30 hover:text-white text-sm transition-colors">Gebruiksvoorwaardes</a></li>
            </ul>
            <a href="https://wa.me/27644004488" className="inline-flex items-center gap-2 font-body text-white/30 hover:text-sk-green-light text-sm transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
              064 400 4488
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 mt-10 pt-6 border-t border-white/5">
          <p className="font-body text-white/20 text-xs text-center">Sakekring &copy; 2026, &apos;n Amptelike Boermedia Gemeenskap</p>
        </div>
      </footer>

      {/* Floating WhatsApp button */}
      <a href="https://wa.me/27644004488?text=Hallo%2C%20ek%20het%20%27n%20vraag%20oor%20Sakekring" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-sk-green hover:bg-sk-green-dark rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ boxShadow: '0 4px 16px rgba(45,106,79,0.35)' }} aria-label="WhatsApp ons">
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.61.61l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.326 0-4.491-.752-6.249-2.027l-.436-.326-3.248 1.088 1.088-3.248-.326-.436A9.953 9.953 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" /></svg>
      </a>
    </>
  )
}
