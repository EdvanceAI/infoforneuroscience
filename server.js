const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
// Enable static file serving from public directory
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware for parsing JSON
app.use(express.json());
// Enable CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Connect to MongoDB (replace with your MongoDB URI)
mongoose.connect(process.env.MONGODB_URI).then(
    () => console.log("Database connected")
)

const blogSchema = new mongoose.Schema({
    title: String,
    description: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
});

const Blog = mongoose.model('Blog', blogSchema, 'blogs');

// POST endpoint for creating blog posts
app.post('/api/data', async (req, res) => {
    try {
        const { title, description, content } = req.body;

        const newBlog = new Blog({
            title: title,
            description: description,
            content: content,
        });

        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET endpoint for fetching all blogs
app.get('/api/data', async (req, res) => {
    try {
        const blogs = await Blog.find({}, 'title description createdAt'); // Ensure description is fetched
        if (!blogs) {
            return res.status(404).json({ message: 'No blogs found' });
        }
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET endpoint for fetching a single blog by ID
app.get('/api/data/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
