import { getDb } from '../../index';
import multer from 'multer';

const storage = multer.memoryStorage(); // Use memory storage for BLOBs
const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadHandler = upload.single('media');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    uploadHandler(req, res, async (err) => {
      if (err) {
        return res.status(400).send('Error uploading file.');
      }

      const mediaType = req.file.mimetype;
      const data = req.file.buffer.toString('base64');

      const mediaCategory = mediaType.startsWith('image/') ? 'image' : mediaType.startsWith('video/') ? 'video' : null;

      if (!mediaCategory) {
        return res.status(400).send('Invalid media type.');
      }

      const db = await getDb();
      db.run(`INSERT INTO media (type, data) VALUES (?, ?)`, [mediaType, data], function(err) {
        if (err) {
          return res.status(500).send('Error saving to database.');
        }
        res.status(200).json({ success: true });
      });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
