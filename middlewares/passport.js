'use strict';
const passport = require('passport');
const localStrategy = require('passport-local').Strategy
const JWTstrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')
const {
  User
} = require("../models")

// Setup work and export for the JWT passport strategy
passport.serializeUser((req, user, done) => {
  done(null, user)
})

passport.deserializeUser((req, user, done) => {
  done(null, user)
})

passport.use(
  'signup',
  new localStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        console.log(email,"email")
        console.log(password, "password")
        const user = await User.create({
          email,
          password,
          name: req.body.name
        })
        return done(null, user)
      } catch (error) {
        done(error);
      }
    }
  )
)

passport.use(
  'login',
  new localStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({
          email
        })

        if (!user) {
          return done(null, false, {
            message: 'User not found'
          })
        }

        const validate = await user.isValidPassword(password, user.password)

        if (!validate) {
          return done(null, false, {
            message: 'Wrong Password'
          })
        }

        return done(null, user, {
          message: 'Logged in Successfully'
        })
      } catch (error) {
        return done(error);
      }
    }
  )
)

exports.register = async (req, res, next) => {
  passport.authenticate(
    'signup', async (err, user, info) => {
      try {
        if (err || !user) {
          const error = new Error('An error occurred.')
          return next(error)
        }

        req.login(
          user, {
            session: true
          },
          async (error) => {
            if (error) return next(error)
            const body = {
              id: user.id,
              email: user.email,
              role: user.role
            }
            const token = await jwt.sign({
              user: body
            }, process.env.SECRET, {
              expiresIn: 60000
            })
            return res.json({
              token
            })
          }
        )
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next)
}

exports.auth = async (req, res, next) => {
  passport.authenticate(
    'login',
    async (err, user, info) => {
      try {
        if (err || !user) {
          const error = new Error('An error occurred.');

          return next(error);
        }

        req.login(
          user, {
            session: true
          },
          async (error) => {
            if (error) return next(error);

            const body = {
              id: user.id,
              email: user.email,
              role: user.role
            }
            const token = await jwt.sign({
              user: body
            }, process.env.SECRET, {
              expiresIn: 60000
            });

            return res.json({
              token
            })
          }
        );
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next)
}

passport.use(
  new JWTstrategy({
      secretOrKey: process.env.SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        let expiration_date = new Date(token.exp * 1000)
        if (expiration_date < new Date()) {
          return done(null, false)
        }
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
)