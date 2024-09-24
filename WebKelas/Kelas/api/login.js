import { getDb } from '../../index';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    const db = getDb();
    
    const stmt = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?");
    const row = stmt.get(username, password);

    if (row) {
      res.status(200).json({ success: true, redirect: '/features/gallery/index.html' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
