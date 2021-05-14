const http = require('http');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const expressEdge = require('express-edge');

const app = new express();
const { config, engine } = require('express-edge');

app.use(fileUpload());
app.use(express.static('public'));


// Automatically sets view engine and adds dot notation to app.render
app.use(engine);
app.set('views', `${__dirname}/views`);


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

//Request
const Post = require('./database/models/Post');
const createPostController = require('./controllers/createPost')
const homePageController = require('./controllers/homePage')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')


const storePost = require('./middleware/storePost')
app.use('/posts/store', storePost)

//CONNECT TO DB
mongoose.connect('mongodb://localhost:27017/node-blog', { useNewUrlParser: true })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err))

//END POINT
app.get("/", homePageController);
app.get("/post/:id", getPostController);
app.get("/new", createPostController);
app.post("/posts/store", storePostController);

//MANUAL END POINT
app.get('/about', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/about.html'));
});
app.get('/contact', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/contact.html'));
});


//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res) {
    res.send('error.html;', 404);
});


//SERVER START
app.listen(4000, () => {
    console.log('server started on port 4000')
});