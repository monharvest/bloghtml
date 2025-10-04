import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">SoonBlog.com</h3>
            <p className="text-gray-300 leading-relaxed">Итгэл, найдвар, хайрын тухай мэдээс блог.</p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-gray-100">ХОЛБООСУУД</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Нүүр
              </Link>
              <Link href="/articles" className="text-gray-300 hover:text-white transition-colors">
                Сайн мэдээ
              </Link>
              <Link href="/articles" className="text-gray-300 hover:text-white transition-colors">
                Админ
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          © 2025 SoonBlog.com. Бүх эрх хуулиар хамгаалагдсан.
        </div>
      </div>
    </footer>
  )
}
