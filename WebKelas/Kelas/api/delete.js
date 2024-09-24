import { getDb } from '../../index';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id } = req.body;
    const db = await getDb();

    db.run("DELETE FROM media WHERE id = ?", [id], function(err) {
      if (err) {
        return res.status(500).json({ error: "Error deleting media." });
      }
      res.json({ success: true });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
