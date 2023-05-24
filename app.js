const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const cookie = require('cookie-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const bcryptjs = require('bcryptjs');
const apiRouter = require('./routes/api');
const cors = require('cors');
const User = require('./models/User');
require('dotenv').config();

const app = express();

const mongoDb = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.zomngs9.mongodb.net/blog_api?retryWrites=true&w=majority`;
mongoose.set('strictQuery', false);
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

let corsOptions = {
  origin: [
    'https://blog-cms-asatyam.vercel.app/',
    'https://blog-client-nu.vercel.app/',
    'http://localhost:3000',
  ],
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));



app.use(session({secret: process.env.SECRET, resave:false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/api', apiRouter);
app.use('/api', cors(corsOptions), apiRouter);


passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: 'User not found'});
      }
      else{
      bcryptjs.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password' });
        }
      });
    }
    } catch (err) {
      return done(err,false);
    }
  })
);





passport.use(
  new JWTstrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
    },
    (jwtPayload, done) => {
      return done(null, jwtPayload);
    }
  )
);



passport.serializeUser(function (user, done) {
  console.log('working');
  done(null, user.id);
});
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});


app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
