import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
          SoonBlog.com
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
            Нүүр
          </Link>
          <Link href="/articles" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
            Нийтлэл
          </Link>
          <Link href="/category/sain-medee" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
            Сайн мэдээ
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              type="search" 
              placeholder="Хайх..." 
              className="pl-10 bg-gray-50 border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            />
          </div>
        </div>
      </div>
    </header>
  )
}
