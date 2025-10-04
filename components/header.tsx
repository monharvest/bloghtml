"use client"

import Link from "next/link"
import { Search, Menu, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Udaxgui.com
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
              Нүүр
            </Link>
            <Link href="/articles" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
              Нийтлэл
            </Link>
            <Link href="/category/sain-medee" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
              Сайн мэдээ
            </Link>
          </nav>

          {/* Desktop Search and Theme Toggle */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input 
                type="search" 
                placeholder="Хайх..." 
                className="pl-10 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white" 
              />
            </div>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-slate-700">
            <nav className="flex flex-col gap-4 pt-4">
              <Link 
                href="/" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Нүүр
              </Link>
              <Link 
                href="/articles" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Нийтлэл
              </Link>
              <Link 
                href="/category/sain-medee" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Сайн мэдээ
              </Link>
              
              {/* Mobile Search */}
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input 
                  type="search" 
                  placeholder="Хайх..." 
                  className="pl-10 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white w-full" 
                />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
