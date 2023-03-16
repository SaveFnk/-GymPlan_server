
const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

//connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));//new Usser
app.use('/auth', require('./routes/auth'));//authorise with acces token
app.use('/refresh', require('./routes/refresh'));//refresh acces token with refresh token
app.use('/logout', require('./routes/logout'));//delete token

app.use(verifyJWT);
app.use('/splits', require('./routes/api/splits')); 
app.use('/workout', require('./routes/api/workout'));  
app.use('/exercise', require('./routes/api/exercise')); 
app.use('/history', require('./routes/api/history')); 

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

//start
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');//change
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});