const express=require('express');
const app = express();
const path = require('path');
const bodyParser=require('body-parser');
const sqlite3=require('sqlite3').verbose();
const notifier = require('node-notifier');
const multer = require('multer');

const dbPath = path.join(__dirname, 'datakelas.db');
const db = new sqlite3.Database(dbPath);
db.serialize(() => { 
    console.log("Database Has Connected")
});


app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,"index.html"))
})
app.use(express.static('features'));
var server = app.listen(5003, function () {
    console.log("Express App running at http://127.0.0.1:5003/");
 })
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.get('/login/index.html', (req, res) => {
    res.render('login');
});

var jump=0;

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
      if (row) {
          res.sendFile(path.join(__dirname,"features/gallery/index.html"))
      } else {
        jump++;
        notifier.notify({
            title: 'Password!',
            message: 'Password kamu salah!,Silahkan Refresh Halaman',
            sound: true,
            wait: true
          });
        console.log(jump);
        if (jump>2){
            res.sendFile(path.join(__dirname,"index2.html"));
            jump=0;
        };
       
      }
    });
});







// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Use memory storage for BLOBs
const upload = multer({ storage });

// Serve static files from the public directory
// app.use(express.static('gallery'));

// Upload endpoint
app.post('/uploads', upload.single('media'), (req, res) => {
    const mediaType = req.file.mimetype; // Get the actual MIME type from the uploaded file
    const data = req.file.buffer.toString('base64'); // Convert the buffer to Base64

    // Determine the media category based on the actual MIME type
    const mediaCategory = mediaType.startsWith('image/') ? 'image' : mediaType.startsWith('video/') ? 'video' : null;

    if (!mediaCategory) {
        return res.status(400).send('Invalid media type. Please upload an image or video.');
    }

    db.run(`INSERT INTO media (type, data) VALUES (?, ?)`, [mediaType, data], function(err) {
        if (err) {
            return res.status(500).send('Error saving to database.');
        }
        res.redirect("/gallery/view.html"); // Redirect to the view page after successful upload
    });
});


// View page endpoint to get media as JSON
// app.get('/api/media', (req, res) => {
//     db.all(`SELECT * FROM media`, [], (err, rows) => {
//         if (err) {
//             return res.status(500).send('Error fetching data.');
//         }
//         res.json(rows); // Send JSON response
//     });
// });
app.get('/api/media', (req, res) => {
    db.all("SELECT id, type, data FROM media", (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving media." });
        }
        res.json(rows.map(row => ({
            id: row.id,
            type: row.type,
            data: row.data
        })));
    });
});
app.post('/api/delete', (req, res) => {
    const { id } = req.body;
    
    db.run("DELETE FROM media WHERE id = ?", [id], function(err) {
        if (err) {
            return res.status(500).json({ error: "Error deleting media." });
        }
        res.json({ success: true });
    });
});