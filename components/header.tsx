import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-foreground hover:text-primary transition-colors">
          Udaxgui.com
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            Нүүр
          </Link>
          <Link href="/articles" className="text-foreground hover:text-primary transition-colors">
            Нийтлэл
          </Link>
          <Link href="/category/gospel" className="text-foreground hover:text-primary transition-colors">
            Сайн мэдээ
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Хайх..." className="pl-10 bg-secondary border-border" />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
