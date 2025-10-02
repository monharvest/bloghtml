import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Udaxgui.com</h3>
            <p className="text-muted-foreground leading-relaxed">Итгэл, найдвар, хайрын тухай хэрэгт блог.</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">ХОЛБООСУУД</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Нийтлэл
              </Link>
              <Link href="/#articles" className="text-muted-foreground hover:text-foreground transition-colors">
                Сайн мэдээ
              </Link>
              <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                Admin
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
          © 2025 Udaxgui.com. Бүх эрх хуулиар хамгаалагдсан.
        </div>
      </div>
    </footer>
  )
}
