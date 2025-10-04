-- D1 Schema for Cloudflare Pages
CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    metaDescription TEXT NOT NULL,
    published BOOLEAN DEFAULT 1,
    featured BOOLEAN DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT OR IGNORE INTO categories (id, name, slug) VALUES 
('cat1', 'Сайн мэдээ', 'sain-medee'),
('cat2', 'Сургаалт зүйрлэлүүд', 'surgaalt-zuirleluud'),
('cat3', 'Advent', 'advent'),
('cat4', 'Ухал ба амилал', 'ukhal-ba-amiral'),
('cat5', 'Мөнх үүний өйлгөлт', 'munkh-uunii-oilgolt'),
('cat6', 'Тамын тухай', 'tamyn-tukhai');

-- Insert sample posts
INSERT OR IGNORE INTO posts (id, slug, title, category, excerpt, image, metaDescription, content, published, featured) VALUES 
('post1', 'shine-butseeld-enegriin-mahbod', 'Шинэ бүтээлд энэ махбод хамаагүй', 'Сайн мэдээ', 'Иймэх Есүс таныг "тэгэрэн ємсєг" ярсан. Харин "тэнгэр ємсєг" Есүс Паулд илчэх, Зөгийлөн бэ шинэ бүтээл дээр уулзарсан шинэ сайн мэдээг...', '/wooden-texture-background.jpg', 'Шинэ бүтээлд энэ махбод хамаагүй - Есүсийн хайр ба нигүүлслийн тухай өгүүлэх андраар сургаалт зүйрлэлийн түн уттаг тайлбарлав.', 'Иймэх Есүс таныг "тэгэрэн ємсєг" ярсан. Харин "тэнгэр ємсєг" Есүс Паулд илчэх, Зөгийлөн бэ шинэ бүтээл дээр уулзарсан шинэ сайн мэдээг...', 1, 0),

('post2', 'paulyn-zarlasan-sain-medee', 'Паулын зарласан сайн мэдээ', 'Сайн мэдээ', 'Мөсөгийн Хүүлийг дагах тал дээр: Паул Есүстэй зарласан гэж үү? Есүст атгасан бид бүхэн Түүний дагахаар шийдсэн бөгөөд үүний түлд Библийн...', '/wooden-planks-texture.jpg', 'Паулын зарласан сайн мэдээ - Мөсөгийн Хүүлийг дагах тухай Паулын сургаал ба Есүс Христийн авралын тухай андраар мэдээлэл.', 'Мөсөгийн Хүүлийг дагах тал дээр: Паул Есүстэй зарласан гэж үү? Есүст атгасан бид бүхэн Түүний дагахаар шийдсэн бөгөөд үүний түлд Библийн...', 1, 1);