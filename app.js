const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Book Schema
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    price: Number
});

const Book = mongoose.model('Book', bookSchema);

// Routes
app.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.render('index', { books });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/books', async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.redirect('/');
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/books/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        res.render('edit', { book });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/books/:id', async (req, res) => {
    try {
        await Book.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/');
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/books/:id/delete', async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        res.status(500).send(error);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 