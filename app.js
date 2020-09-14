const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const lessMiddleware = require('less-middleware');

const app = express();
const port = 3000;

const database = 'mongodb+srv://joe:mbZhCqpKiUKLcADI@cluster0.tjl07.mongodb.net/node-auth';

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());

// Set the CSS root directory as ./less and build output file at ./css/styles.css
app.use(lessMiddleware('/less', {
    dest: '/css',
    pathRoot: path.join(__dirname, 'public')
}));

// Set the templating engine as EJS
app.set('view engine', 'ejs');

// MongoDB connection
mongoose.connect(database, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then((result) => app.listen(4000))
    .catch((err) => console.log(err));

// Routes
app.use(require('./routes/routes'));
app.use(require('./routes/authRoutes'));

// Run the server at the specified port
app.listen(port, () => {
    console.log('App running on Port', port);
});