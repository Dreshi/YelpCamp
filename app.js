const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.render('home')
})

// shows all campgrounds of the database
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
})

// add a new campground (needs to be before the detail page - won't find new otherwise)
app.get('/campgrounds/new', async (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

// show detail of the campground
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id) 
    res.render('campgrounds/show', {campground});
})


// Testing whether a new document is created
// app.get('/makecampground', async (req, res) => {
//     const camp = new Campground({ title: 'My Backyard', description: 'cheap camping'});
//     await camp.save();
//     res.send(camp)
// })

app.listen(3000, () => {
    console.log('Serving on port 3000')
}  )