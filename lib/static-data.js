// Static data loader for production builds
export function loadStaticPosts() {
  if (typeof window !== 'undefined') {
    // Client-side: fetch from static JSON
    return fetch('/static-data/posts.json').then(r => r.json())
  } else {
    // Server-side during build: read from file system
    const fs = require('fs')
    const path = require('path')
    
    try {
      const filePath = path.join(process.cwd(), 'public', 'static-data', 'posts.json')
      const data = fs.readFileSync(filePath, 'utf8')
      return Promise.resolve(JSON.parse(data))
    } catch (error) {
      console.warn('Static data not found, using empty array')
      return Promise.resolve([])
    }
  }
}

export function loadStaticCategories() {
  if (typeof window !== 'undefined') {
    // Client-side: fetch from static JSON
    return fetch('/static-data/categories.json').then(r => r.json())
  } else {
    // Server-side during build: read from file system
    const fs = require('fs')
    const path = require('path')
    
    try {
      const filePath = path.join(process.cwd(), 'public', 'static-data', 'categories.json')
      const data = fs.readFileSync(filePath, 'utf8')
      return Promise.resolve(JSON.parse(data))
    } catch (error) {
      console.warn('Static categories not found, using empty array')
      return Promise.resolve([])
    }
  }
}