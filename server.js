const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const path = require('path');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile')
const image = require('./controllers/image')

// for local PostgreSQL
// const db = knex({
//     client: 'pg',
//     connection: {
//       host : '127.0.0.1',
//       user : 'postgres',
//       password : '',
//       database : 'face-detection'
//     }
// });


// const db = knex({
//     client: 'pg',
//     connection: {
//       connectionString : process.env.DATABASE_URL,
//       ssl : true,
//     }
// });

const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: {
       rejectUnauthorized: false
    }
  }
});

// Simple check of select * from a table
// db.select('*').from('users').then(data=>{
//     console.log(data);
// });

const app = express();
app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))

app.use(bodyParser.json());
app.use(cors());


/*
res = this is working
/signin: POST = success /fail
/register: POST = user
/profile/:userId: GET = user
/image: PUT user
*/

// there will be error if running... in heroku
//app.get('/', (req, res)=> { res.send(database.users)})
app.get('/', (req, res)=> { res.send('it is working!')})
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req,res) => { register.handleRegister(req, res, db, bcrypt)})
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl',(req,res) => { image.handleApiCall(req,res)})

// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`Our app is running on port ${ PORT}`);
})