import { dev } from '$app/environment';
import { Database } from 'bun:sqlite';

const db = new Database(dev ? 'likes.sqlite' : '/likes.sqlite', {
  create: true,
  strict: true,
});

db.exec('PRAGMA journal_mode = WAL;');

export class Likes {
  static db = db;

  static get(blog_id: string) {
    const res = db.query('SELECT likes FROM likes WHERE blogID = ?').get(blog_id) as any;

    return res?.likes ?? 0;
  }

  static set(blog_id: string, likes: number) {
    try {
      db.query('INSERT OR REPLACE INTO likes (blogID, likes) VALUES (?, ?)').run(blog_id, likes);
    } catch (e) {
      console.error(e);
    }
  }
}
