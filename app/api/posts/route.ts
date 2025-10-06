import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const postsPath = path.join(process.cwd(), 'public/static-data/posts.json');  // Use the correct path

export async function GET() {
  try {
    const data = fs.readFileSync(postsPath, 'utf8');
    const posts = JSON.parse(data);
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const updatedPosts = await request.json();  // Expect array of posts
    fs.writeFileSync(postsPath, JSON.stringify(updatedPosts, null, 2));
    return NextResponse.json({ message: 'Posts updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update posts' }, { status: 500 });
  }
}
