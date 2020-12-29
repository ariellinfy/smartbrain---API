const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

//connecting database to server
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  }
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {res.send('success')});

// app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)});
app.post('/signin', signin.handleSignin(db, bcrypt)); //works as well, see advanced JS function

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});

app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)});

app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)});

app.put('/image', (req, res) => {image.handleImage(req, res, db)});

app.listen(process.env.PORT || 3001, () => {
	console.log(`app is running on port ${process.env.PORT}`);
})

//

// / --> res = this is working
// /signin --> POST = success/fail
// /register --> POST = user
// /profile/:userID --> GET = user
// /image --> PUT = user

//heroku apps
//smart-brain-app-al - frontend
//aqueous-cliffs-15853 - backend server
//postgresql-cylindrical-41098 (addon in aqueous-cliffs-15853) - backend database