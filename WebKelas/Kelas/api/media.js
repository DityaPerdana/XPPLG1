import { getDb } from '../../index';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const db = await getDb();
    db.all("SELECT id, type, data FROM media", (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Error retrieving media." });
      }
      res.json(rows);
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
