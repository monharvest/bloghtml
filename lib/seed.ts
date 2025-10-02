import { db } from '@/lib/db'

// Default posts data to seed the database
const defaultPosts = [
  {
    title: "Шинэ бүтээлд энэ махбод хамаагүй",
    slug: "shine-butseeld-enegriin-mahbod",
    category: "Сайн мэдээ",
    excerpt: 'Иймэх Есүс таныг "тэгэрэн ємсєг" ярсан. Харин "тэнгэр ємсєг" Есүс Паулд илчэх, Зөгийлөн бэ шинэ бүтээл дээр уулзарсан шинэ сайн мэдээг...',
    image: "/wooden-texture-background.jpg",
    metaDescription: "Шинэ бүтээлд энэ махбод хамаагүй - Есүсийн хайр ба нигүүлслийн тухай өгүүлэх андраар сургаалт зүйрлэлийн түн уттаг тайлбарлав.",
    content: 'Иймэх Есүс таныг "тэгэрэн ємсєг" ярсан. Харин "тэнгэр ємсєг" Есүс Паулд илчэх, Зөгийлөн бэ шинэ бүтээл дээр уулзарсан шинэ сайн мэдээг...',
    published: true,
    featured: false,
  },
  {
    title: "Паулын зарласан сайн мэдээ",
    slug: "paulyn-zarlasan-sain-medee",
    category: "Сайн мэдээ",
    excerpt: "Мөсөгийн Хүүлийг дагах тал дээр: Паул Есүстэй зарласан гэж үү? Есүст атгасан бид бүхэн Түүний дагахаар шийдсэн бөгөөд үүний түлд Библийн...",
    image: "/wooden-planks-texture.jpg",
    metaDescription: "Паулын зарласан сайн мэдээ - Мөсөгийн Хүүлийг дагах тухай Паулын сургаал ба Есүс Христийн авралын тухай андраар мэдээлэл.",
    content: "Мөсөгийн Хүүлийг дагах тал дээр: Паул Есүстэй зарласан гэж үү? Есүст атгасан бид бүхэн Түүний дагахаар шийдсэн бөгөөд үүний түлд Библийн...",
    published: true,
    featured: true,
  },
  {
    title: "Хэмжээлшгүй их хайр ивзээл",
    slug: "hamjeeelshgui-ux-hair-ivzeel",
    category: "Сайн мэдээ",
    excerpt: "Энэ нь өврөөг бус үүдэстүүдэд зориулсан **ончой сайн мэдээ** юм. Энэ Паулын зарласан мэдээ нь өврөөчүүдэд зориулсан мэдээлэлээс өөр...",
    image: "/beautiful-sunset-sky-with-warm-colors.jpg",
    metaDescription: "Хэмжээлшгүй их хайр ивзээл - Энэ нь өврөөг бус үүдэстүүдэд зориулсан ончой сайн мэдээ юм. Паулын зарласан мэдээ.",
    content: "Энэ нь өврөөг бус үүдэстүүдэд зориулсан **ончой сайн мэдээ** юм. Энэ Паулын зарласан мэдээ нь өврөөчүүдэд зориулсан мэдээлэлээс өөр...",
    published: true,
    featured: false,
  },
  {
    title: "Амидралтын найдвар",
    slug: "amidaltyn-naidvar",
    category: "Сургаалт зүйрлэлүүд",
    excerpt: "Христийн амилалт нь итгэгчдэд имар найдвар, амилалт өгдөг вэ?",
    image: "/purple-gradient-abstract-background.jpg",
    metaDescription: "Амидралтын найдвар - Христийн амилалт нь итгэгчдэд ямар найдвар, амилалт өгдөг талаар сургаалт.",
    content: "Христийн амилалт нь итгэгчдэд имар найдвар, амилалт өгдөг вэ?",
    published: false,
    featured: false,
  },
  {
    title: "Төөрсөн хонины сургаалт зүйрлэл",
    slug: "teeersen-khoniny-surgaalt",
    category: "Сургаалт зүйрлэлүүд",
    excerpt: "Есүсийн хайр ба нигүүлслийн тухай өгүүлэх андраар сургаалт зүйрлэлийн түн уттаг тайлбарлав.",
    image: "/bright-yellow-solid-color.jpg",
    metaDescription: "Төөрсөн хонины сургаалт зүйрлэл - Есүсийн хайр ба нигүүлслийн тухай өгүүлэх андраар сургаалт зүйрлэлийн түн уттаг тайлбарлав.",
    content: "Есүсийн хайр ба нигүүлслийн тухай өгүүлэх андраар сургаалт зүйрлэлийн түн уттаг тайлбарлав.",
    published: true,
    featured: true,
  }
]

const defaultCategories = [
  { name: "Сайн мэдээ", slug: "sain-medee" },
  { name: "Сургаалт зүйрлэлүүд", slug: "surgaalt-zuirleluud" },
  { name: "Advent", slug: "advent" },
  { name: "Ухал ба амилал", slug: "ukhal-ba-amiral" },
  { name: "Мөнх үүний өйлгөлт", slug: "munkh-uunii-oilgolt" },
  { name: "Тамын тухай", slug: "tamyn-tukhai" }
]

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...')
    
    // First, seed categories
    console.log('Seeding categories...')
    for (const category of defaultCategories) {
      try {
        await db.createCategory(category)
        console.log(`Created category: ${category.name}`)
      } catch (error) {
        // Category might already exist, that's fine
        console.log(`Category ${category.name} already exists`)
      }
    }
    
    // Then, seed posts
    console.log('Seeding posts...')
    for (const post of defaultPosts) {
      try {
        await db.createPost(post)
        console.log(`Created post: ${post.title}`)
      } catch (error) {
        // Post might already exist, that's fine
        console.log(`Post ${post.title} already exists`)
      }
    }
    
    console.log('Database seeding completed!')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}