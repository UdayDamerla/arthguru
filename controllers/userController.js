const bcrypt = require('bcryptjs')
const passport = require('passport')

const User = require('../models/user')
const Record = require('../models/record')

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const uploadImg = path => {
  return new Promise((resolve, reject) => {
    imgur.upload(path, (err, img) => {
      if (err) {
        return reject(err)
      }
      resolve(img)
    })
  })
}

const userController = {
  getLoginPage: (req, res) => {
    res.render('login', {
      error_msg: req.flash('error'),
      email: req.session.email,
      password: req.session.password,
      formCSS: true
    })
  },
  getRegisterPage: (req, res) => {
    res.render('register', { email: req.session.email, formCSS: true })
  },
  register: async (req, res) => {
    const errors = []
    const emailRule =
      /^\w+((-\w+)|(\.\w+)|(\+\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
    const { name, email, password, confirmPassword } = req.body
    req.session.password = ''

    if (!email || !password || !confirmPassword) {
      errors.push({
        message: 'Please fill out all required fields marked with *'
      })
    }
    if (email.search(emailRule) === -1) {
      errors.push({ message: 'Please enter the correct email address.' })
    }
    if (password !== confirmPassword) {
      errors.push({ message: 'Password and confirmPassword do not match.' })
    }
    if (errors.length > 0) {
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword,
        formCSS: true
      })
    }

    try {
      const user = await User.findOne({ email }).exec()
      if (user) {
        req.session.email = email
        req.flash(
          'warning_msg',
          'A user with this email already exists. Choose a different address or login directly.'
        )
        return res.redirect('/users/register')
      }

      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      await User.create({
        name,
        email,
        password: hash,
        avatar: `https://robohash.org/${name}`
      })

      req.session.email = email
      req.flash(
        'success_msg',
        `${req.body.email} register successfully! Please login.`
      )
      return res.redirect('/users/login')
    } catch (err) {
      console.warn(err)
      res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword,
        formCSS: true
      })
    }
  },
  logout: (req, res) => {
    req.logout()
    req.flash('success_msg', 'logout successfully!')
    req.session.destroy(err => {
      if (err) {
        return console.log(err)
      }
    })
    res.redirect('/users/login')
  },
  getUserProfile: (req, res) => {
    res.render('users/profile')
  },
  editUserProfile: (req, res) => {
    res.render('users/edit')
  },
  putUserProfile: async (req, res) => {
    const { file } = req
    let img
    const acceptedType = ['.png', '.jpg', '.jpeg']

    if (!req.body.name || req.body.name.length > 25) {
      return res.render('users/edit', {
        user: { name: req.body.name },
        error_msg: 'Name can not be empty or longer than 25 characters.'
      })
    }

    try {
      if (file) {
        const fileType = file.originalname
          .substring(file.originalname.lastIndexOf('.'))
          .toLowerCase()

        if (acceptedType.indexOf(fileType) === -1) {
          req.flash(
            'error_msg',
            'This type of image is not accepted, Please upload the image ends with png, jpg, or jpeg. '
          )
          return res.redirect('back')
        }

        imgur.setClientID(IMGUR_CLIENT_ID)
        img = await uploadImg(file.path)
      }

      let user = await User.findOne({ _id: req.user._id }).exec()

      user = Object.assign(user, {
        name: req.body.name,
        avatar: file ? img.data.link : user.avatar
      })

      await user.save()

      res.redirect('/users/profile')
    } catch (err) {
      console.log(err)
    }
  },
  putBudget: async (req, res) => {
    let user = await User.findOne({ _id: req.user._id }).exec()

    user = Object.assign(user, {
      budget: req.body.budget
    })

    await user.save()
    res.redirect('back')
  },
  deleteUser: async (req, res) => {
    await Promise.all([
      User.deleteOne({ _id: req.user._id }),
      Record.deleteMany({ userId: req.user.id })
    ])
    res.redirect('/users/login')
  }
}

module.exports = userController