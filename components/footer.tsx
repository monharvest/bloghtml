import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Udaxgui.com</h3>
            <p className="text-gray-300 text-sm italic">
              "Эдүгээ итгэл, найдвар, хайр гурав үлддэг боловч хамгийн агуу нь хайр мөн."
              <br />
              <span className="text-gray-400">— 1 Коринт 13:13</span>
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-gray-100">ХОЛБООСУУД</h4>
            <nav className="flex flex-wrap gap-4">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Нүүр
              </Link>
              <Link href="/articles" className="text-gray-300 hover:text-white transition-colors">
                Нийтлэлүүд
              </Link>
              <Link href="/category/Сайн мэдээ" className="text-gray-300 hover:text-white transition-colors">
                Сайн мэдээ
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                Бидний тухай
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300 text-sm">
          © 2025 Udaxgui.com. Бүх эрх хуулиар хамгаалагдсан.
        </div>
      </div>
    </footer>
  )
}
