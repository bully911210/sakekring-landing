import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['opsz'],
})

export const metadata: Metadata = {
  title: 'Sakekring | Suid-Afrika se Grootste Afrikaanse Sakekring | Boermedia',
  description:
    'Sluit gratis aan by Boermedia se Sakekring. 147 000+ Afrikaanse sakemense, weeklikse inhoud, lives en netwerkgeleenthede. Geen kredietkaart nodig.',
  openGraph: {
    title: 'Sakekring | Boermedia se Amptelike Sakenetwerk',
    description:
      'Sluit gratis aan by Suid-Afrika se grootste volkseie sakekring. 147 000+ volgers sterk.',
    type: 'website',
    images: ['https://www.skool.com/sakekring/og-image.png'],
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect rx='20' width='100' height='100' fill='%232D6A4F'/><text x='50' y='68' text-anchor='middle' font-size='50' font-weight='bold' fill='white' font-family='system-ui'>SK</text></svg>",
    apple:
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'><rect width='180' height='180' fill='%232D6A4F'/><text x='90' y='115' text-anchor='middle' font-size='80' font-weight='bold' fill='white' font-family='system-ui'>SK</text></svg>",
  },
}

const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Sakekring',
  url: 'https://www.skool.com/sakekring',
  description: 'Boermedia se amptelike sakekring vir Afrikaanse sakemense.',
  parentOrganization: {
    '@type': 'Organization',
    name: 'Boermedia',
    url: 'https://www.boermedia.co.za',
  },
}

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is dit regtig heeltemal gratis?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja, die Gemeenskapslid-vlak is 100% gratis, vir altyd. Jy kan aansluit sonder enige koste en kry toegang tot die gemeenskapschat en openbare gebeure.',
      },
    },
    {
      '@type': 'Question',
      name: 'Ek volg Boermedia reeds op Facebook. Hoekom moet ek ook by Sakekring aansluit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Facebook se algoritme besluit watter plasings jy sien. Op Sakekring is alles georganiseer in kursusse en kalenders. Jy mis niks nie.',
      },
    },
    {
      '@type': 'Question',
      name: 'Wat is die verskil tussen Sakevennoot en Sakeleier?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sakevennoot gee jou volle toegang tot alle Boermedia-inhoud, lives, kursusse en privaat gesprekke. Sakeleier bou daarop voort met besigheidsblootstelling en privaat strategiesessies.',
      },
    },
    {
      '@type': 'Question',
      name: 'Hoe werk die Boermedia-besigheidsplasing in Sakeleier?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Elke Sakeleier kry een professionele besigheidsplasing per kwartaal op Boermedia se Facebook (147 000+ volgers) of YouTube (27 000+ intekenare).",
      },
    },
    {
      '@type': 'Question',
      name: 'Kan ek my plan opgradeer of afgradeer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja, enige tyd. Geen kontrak, geen wagperiode.',
      },
    },
    {
      '@type': 'Question',
      name: 'Wat is Skool en hoekom gebruik julle dit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Skool is 'n internasionaal-erkende gemeenskapsplatform wat spesifiek vir kursusse, gemeenskappe en lewendige gebeure ontwerp is.",
      },
    },
    {
      '@type': 'Question',
      name: 'Hoeveel tyd vat dit om aan te sluit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Minder as 'n minuut. Klik op Sluit Aan, beantwoord 2 vrae, en jy is deel van die kring.",
      },
    },
  ],
}

const PRODUCT_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Sakekring Gemeenskap',
  description: 'Boermedia se amptelike sakekring vir Afrikaanse sakemense',
  brand: { '@type': 'Brand', name: 'Boermedia' },
  offers: [
    {
      '@type': 'Offer',
      name: 'Gemeenskapslid',
      price: '0',
      priceCurrency: 'ZAR',
      description: 'Gratis gemeenskapslid met chat en openbare gebeure',
    },
    {
      '@type': 'Offer',
      name: 'Sakevennoot',
      price: '250',
      priceCurrency: 'ZAR',
      description: 'Volle toegang tot Boermedia-inhoud, kursusse en ledegebeure',
    },
    {
      '@type': 'Offer',
      name: 'Sakeleier',
      price: '1000',
      priceCurrency: 'ZAR',
      description: 'Alles in Sakevennoot plus besigheidsblootstelling via Boermedia',
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="af" className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_SCHEMA) }}
        />
      </head>
      <body className="bg-sk-cream text-sk-shadow antialiased">{children}</body>
      {/* Meta Pixel — REPLACE YOUR_PIXEL_ID */}
      <Script id="meta-pixel" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init','YOUR_PIXEL_ID');
        fbq('track','PageView');
      `}</Script>
      {/* GA4 — REPLACE G-XXXXXXXXXX */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
        gtag('js',new Date());gtag('config','G-XXXXXXXXXX');
      `}</Script>
    </html>
  )
}
