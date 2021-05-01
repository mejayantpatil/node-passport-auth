import express from 'express';
import passport, { Passport } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import expressSession from 'express-session';

const app = express();
const GOOGLE_CLIENT_ID = '854785160029-os1k6kg6kqu7fedbmul2esrni3lmbvnv.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'BuzoCOXyBnVzII6kxV7utDVX';
const FACEBOOK_CLIENT_ID ='488787252165751';
const FACEBOOK_CLIENT_SECRET = 'b90f9b57b5b5df5583fbc60f21107c9c';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/google'
},(accessToken, refreshToken, profile, callback)=>{
    callback(null, profile);
}))

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_CLIENT_ID,
    clientSecret: FACEBOOK_CLIENT_SECRET,
    callbackURL:'/facebook',
    profileFields: ['emails', 'displayName', 'name', 'picture']
}, (accessToken, refreshToken, profile, callback)=>{
    callback(null, profile)
}))

passport.serializeUser((user,callback)=>{
    callback(null, user);
})

passport.deserializeUser((user, callback)=>{
    callback(null, user);
})

app.use(expressSession({
    secret: 'jayantpatilapp',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
//routes
app.get('/login/google', passport.authenticate('google', {scope:['profile email']}));
app.get('/login/facebook', passport.authenticate('facebook', {scope: ['email']}));

app.get('/google', passport.authenticate('google'),(req,res)=>{
    res.redirect('/');
})
app.get('/facebook', passport.authenticate('facebook'),(req,res)=>{
    res.redirect('/');
})

app.get('/logout', (req,res)=>{
    req.logout();
    res.redirect('/');
});

app.get('/',(req,res)=>{

    res.send(req.user? req.user: 'Not logged in, login with Google or facebook');
})

app.listen(3000, ()=>{
    console.log('server started on 3000');
})