import type React from "react"
import type { Metadata } from "next"
import { Inter, Roboto_Mono } from "next/font/google"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"], // Remove cyrillic subset to reduce size
  variable: "--font-sans",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"], // Limit to essential weights only
})

const robotoMono = Roboto_Mono({
  subsets: ["latin"], // Remove cyrillic subset
  variable: "--font-mono", 
  display: "swap",
  preload: false,
  weight: ["400", "500"], // Reduce to essential weights only
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://udaxgui.com' : 'http://localhost:3001'),
  title: "Udaxgui.com - Итгэл, найдвар, хайрын блог",
  description: "Итгэл, найдвар, хайрын тухай хэрэгт блог. Сайн мэдээ, сургаалт зүйрлэлүүд болон бусад нийтлэлүүд.",
  keywords: ["блог", "сайн мэдээ", "итгэл", "найдвар", "хайр", "сургаалт"],
  openGraph: {
    title: "Udaxgui.com",
    description: "Итгэл, найдвар, хайрын тухай хэрэгт блог",
    type: "website",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <head>
        {/* Critical resource hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        
        {/* Load critical font with high priority */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          media="print"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          />
        </noscript>
        
        {/* Critical CSS inline for immediate render */}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root{--background:oklch(1 0 0);--foreground:oklch(0.145 0 0);--card:oklch(1 0 0);--card-foreground:oklch(0.145 0 0);--primary:oklch(0.205 0 0);--primary-foreground:oklch(0.985 0 0);--secondary:oklch(0.97 0 0);--secondary-foreground:oklch(0.205 0 0);--muted:oklch(0.97 0 0);--muted-foreground:oklch(0.556 0 0);--border:oklch(0.922 0 0);--ring:oklch(0.708 0 0)}.dark{--background:oklch(0.18 0.05 250);--foreground:oklch(0.985 0 0);--card:oklch(0.22 0.04 250);--card-foreground:oklch(0.985 0 0);--primary:oklch(0.985 0 0);--primary-foreground:oklch(0.205 0 0);--secondary:oklch(0.28 0.04 250);--secondary-foreground:oklch(0.985 0 0);--muted:oklch(0.28 0.04 250);--muted-foreground:oklch(0.708 0 0);--border:oklch(0.28 0.04 250);--ring:oklch(0.439 0 0)}*{border-color:var(--border);outline-color:var(--ring);outline-width:0;outline-offset:2px}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif}body{background-color:var(--background);color:var(--foreground);margin:0;line-height:inherit;font-family:var(--font-sans,ui-sans-serif,system-ui,sans-serif);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.max-w-6xl{max-width:72rem}.mx-auto{margin-left:auto;margin-right:auto}.px-4{padding-left:1rem;padding-right:1rem}.py-16{padding-top:4rem;padding-bottom:4rem}.grid{display:grid}.gap-8{gap:2rem}.items-center{align-items:center}.text-white{color:rgb(255 255 255)}.text-3xl{font-size:1.875rem;line-height:2.25rem}.font-bold{font-weight:700}.mb-4{margin-bottom:1rem}.relative{position:relative}.h-64{height:16rem}.w-full{width:100%}.h-full{height:100%}.overflow-hidden{overflow:hidden}.rounded-3xl{border-radius:1.5rem}.block{display:block}.transition-opacity{transition-property:opacity}.duration-300{transition-duration:300ms}.bg-slate-800{background-color:rgb(30 41 59)}.dark .bg-slate-900{background-color:rgb(15 23 42)}@media (min-width:1024px){.lg\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.lg\\:h-80{height:20rem}.lg\\:text-5xl{font-size:3rem;line-height:1}}@media (min-width:640px){.sm\\:px-6{padding-left:1.5rem;padding-right:1.5rem}.sm\\:text-4xl{font-size:2.25rem;line-height:2.5rem}}@media (min-width:1024px){.lg\\:px-8{padding-left:2rem;padding-right:2rem}}
          `
        }} />
      </head>
      <body className={`font-sans ${inter.variable} ${robotoMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </ThemeProvider>
        
        {/* Load non-critical resources after page load */}
        <script dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('load', function() {
              // Load secondary font
              var monoLink = document.createElement('link');
              monoLink.rel = 'stylesheet';
              monoLink.href = 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600&display=swap';
              document.head.appendChild(monoLink);
              
              // Enable main font after preload
              var fontLinks = document.querySelectorAll('link[media="print"]');
              fontLinks.forEach(function(link) {
                if (link.href.includes('Inter')) {
                  link.media = 'all';
                }
              });
            });
          `
        }} />
      </body>
    </html>
  )
}
