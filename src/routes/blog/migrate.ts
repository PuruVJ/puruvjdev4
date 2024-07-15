import { Likes } from '$lib/server/likes';

async function migrate() {
  const db = Likes.db;

  db.exec('CREATE TABLE IF NOT EXISTS likes (blogID TEXT PRIMARY KEY, likes INTEGER)');

  // Reads the likes.json file and inserts into the database
  const file_path =
    process.env.NODE_ENV === 'development'
      ? new URL('./likes.json', import.meta.url).pathname
      : '/likes.json';
  const likes_obj = (await Bun.file(file_path).json()) as Record<string, number>;

  console.log(likes_obj);

  for (const [blogID, likes] of Object.entries(likes_obj)) {
    Likes.set(blogID, likes);
  }
}

migrate();
