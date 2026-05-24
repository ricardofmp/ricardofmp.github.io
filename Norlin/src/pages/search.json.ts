import { getCollection } from 'astro:content';
import { settings } from '../data/settings';
import { withBase } from '../utils/paths';

export async function GET() {
  const posts = await getCollection('posts');

  const body = JSON.stringify(
    posts.map((post) => {
      const words = (post.body || '').split(/\s+/).filter(Boolean).length;
      const readingTime = Math.max(1, Math.round(words / 180));

      return {
        title: post.data.title,
        url: withBase(`/posts/${post.id}/`),
        image: post.data.image?.src || '',
        pubDate: post.data.date ? post.data.date.toISOString() : '',
        description: post.data.description || '',
        content: post.body || '',
        readingTime: readingTime,
        tags: post.data.tags || [],
        authorName: settings.author.name,
        authorImage: settings.author.src?.src || ''
      };
    })
  );

  return new Response(body, {
    headers: { 'Content-Type': 'application/json' }
  });
}
