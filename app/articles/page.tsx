import { Header } from "@/components/header"
import { ArticlesSection } from "@/components/articles-section"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Нийтлэлүүд - Udaxgui.com",
  description: "Бүх нийтлэлүүдийг үзэх. Сүнслэг зүйрлэл, сайн мэдээ болон бусад сэдвүүд.",
  openGraph: {
    title: "Нийтлэлүүд - Udaxgui.com",
    description: "Бүх нийтлэлүүдийг үзэх. Сүнслэг зүйрлэл, сайн мэдээ болон бусад сэдвүүд.",
  },
}

export default function ArticlesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ArticlesSection />
      </main>
      <Footer />
    </div>
  )
}
