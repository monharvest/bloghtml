import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">Уучлаарай, хуудас олдсонгүй</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            Нүүр хуудас руу буцах
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
