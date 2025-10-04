import { Header } from "@/components/header"
import HeroSection from "@/components/hero-section"
import { ArticlesSection } from "@/components/articles-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-200">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ArticlesSection />
      </main>
      <Footer />
    </div>
  )
}
