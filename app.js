// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config')

// ℹ️ Connects to the database
require('./db')

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express')

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs')

const app = express()

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require('./config')(app)

const Editor = require('./models/Editor.js')

const projectName = 'blogify'
const capitalized = (string) =>
	string[0].toUpperCase() + string.slice(1).toLowerCase()

app.locals.title = `${capitalized(projectName)} created with IronLauncher`



const bcrypt = require('bcrypt');

const passport = require("passport")
passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser((id, done) => {
	Editor.findById(id)
		.then(userFromDB => {
			done(null, userFromDB);
		})
		.catch(err => {
			done(err);
		})
})




const GitHubStrategy = require("passport-github").Strategy


app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
	clientID: process.env.GITHUB_CLIENT_ID,
	clientSecret: process.env.GITHUB_CLIENT_SECRET,
	callbackURL: "http://127.0.0.1:3000/auth/github/callback"
},
	(accessToken, refreshToken, profile, done) => {
		console.log(profile)
		Editor.findOne({
			githubId: profile.id,
			// username: profil.name,
			// email   : profil.email,
			// bio     : profil.bio
		})

			.then(editorFromDB => {
				if (editorFromDB !== null) {
					done(null, editorFromDB)
				} else {
					Editor.create({
						githubId: profile.id,
						// username: profil.name,
						// email   : profil.email,
						// bio     : profil.bio
					})
						.then(createdUser => {
							done(null, createdUser)
						})
				}
			})
			.catch(err => done(err))
	}
));




// 👇 Start handling routes here
const index = require('./routes/index')
app.use('/', index)

const profile = require('./routes/profile');
app.use('/', profile)
const auth = require('./routes/auth')
app.use('/', auth)
const guest = require('./routes/guest')
app.use('/', guest)

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app)

module.exports = app
