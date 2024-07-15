import { Database } from 'bun:sqlite';

async function migrate() {
  const db = new Database('/likes.sqlite');

  //  Read all likes
  const likes = db.query('SELECT * FROM likes').all() as { blogID: string; likes: number }[];

  console.log(likes);

  // Now replace all likes with a random number between 100 and 2000
  for (const { blogID } of likes) {
    const newLikes = Math.floor(Math.random() * (2000 - 100) + 100);
    db.query('UPDATE likes SET likes = ? WHERE blogID = ?').run(newLikes, blogID);
  }
}

migrate();
