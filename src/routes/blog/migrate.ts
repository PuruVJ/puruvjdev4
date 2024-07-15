import { Likes } from '$lib/server/likes';

async function migrate() {
  const db = Likes.db;

  //  Read all likes
  const likes = db.query('SELECT * FROM likes').all() as { blogID: string; likes: number }[];

  // Now replace all likes with a random number between 100 and 2000
  for (const { blogID } of likes) {
    const newLikes = Math.floor(Math.random() * (2000 - 100) + 100);
    Likes.set(blogID, newLikes);
  }
}

migrate();
