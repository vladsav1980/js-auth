// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')

User.create({
  email: 'test@gmail.com',
  password: '123',
  role: 1,
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/signup', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('signup', {
    // вказуємо назву контейнера
    name: 'signup',
    // вказуємо назву компонентів
    component: [
      'back-button',
      'field',
      'field-password',
      'field-checkbox',
      'field-select',
    ],

    // вказуємо назву сторінки
    title: 'Signup Page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {
      role: [
        { value: User.USER_ROLE.USER, text: 'User' },
        {
          value: User.USER_ROLE.ADMIN,
          text: 'Administrator',
        },
        {
          value: User.USER_ROLE.DEVELOPER,
          text: 'Developer',
        },
      ],
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/signup', function (req, res) {
  const { email, password, role } = req.body

  console.log(req.body)

  if (!email || !password || !role) {
    return res.status(400).json({
      message: 'Error! Required fields are missing',
    })
  }

  try {
    const user = User.getByEmail(email)
    if (user) {
      return res.status(400).json({
        message:
          'User with this email address already exists',
      })
    }
    const newUser = User.create({ email, password, role })
    const session = Session.create(newUser)
    Confirm.create(newUser.email)

    return res.status(200).json({
      message:
        'A new user has been registered successfully',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Error in process of registering',
    })
  }
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/recovery', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('recovery', {
    // вказуємо назву контейнера
    name: 'recovery',
    // вказуємо назву компонентів
    component: ['back-button', 'field'],

    // вказуємо назву сторінки
    title: 'Recovery Page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/recovery', function (req, res) {
  const { email } = req.body

  console.log(email)

  if (!email) {
    return res.status(400).json({
      message: 'Error! Required fields are missing',
    })
  }

  try {
    const user = User.getByEmail(email)
    if (!user) {
      return res.status(400).json({
        message:
          'The email address you entered does not belong to any user',
      })
    }

    Confirm.create(email)
    return res.status(200).json({
      message:
        'The code to renew your password has been sent to your email',
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/recovery-confirm', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('recovery-confirm', {
    // вказуємо назву контейнера
    name: 'recovery-confirm',
    // вказуємо назву компонентів
    component: ['back-button', 'field', 'field-password'],

    // вказуємо назву сторінки
    title: 'Recovery Confirm Page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/recovery-confirm', function (req, res) {
  const { password, code } = req.body

  console.log(password, code)

  if (!code || !password) {
    return res.status(400).json({
      message: 'Error! Required fields are missing',
    })
  }

  try {
    const email = Confirm.getData(Number(code))
    if (!email) {
      return res.status(400).json({
        message: 'Please enter the valid code',
      })
    }

    const user = User.getByEmail(email)
    if (!user) {
      return res.status(400).json({
        message:
          'The email address you entered does not belong to any user',
      })
    }

    user.password = password
    console.log(user)

    const session = Session.create(user)

    return res.status(200).json({
      message: 'Your password has been changed',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/signup-confirm', function (req, res) {
  // res.render генерує нам HTML сторінку

  const { renew, email } = req.query

  if (renew) {
    Confirm.create(email)
  }

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('signup-confirm', {
    // вказуємо назву контейнера
    name: 'signup-confirm',
    // вказуємо назву компонентів
    component: ['back-button', 'field'],

    // вказуємо назву сторінки
    title: 'Signup Confirm Page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/signup-confirm', function (req, res) {
  const { code, token } = req.body

  console.log(code, token)

  if (!code || !token) {
    return res.status(400).json({
      message: 'Error! Required fields are missing',
    })
  }

  try {
    const session = Session.get(token)
    if (!session) {
      return res.status(400).json({
        message: 'Please sign into your account',
      })
    }

    const email = Confirm.getData(code)
    if (!email) {
      return res.status(400).json({
        message: 'Please enter the valid code',
      })
    }

    if (email !== session.user.email) {
      return res.status(400).json({
        message: 'Please enter the valid code',
      })
    }

    const user = User.getByEmail(session.user.email)
    user.isConfirm = true

    session.user.isConfirm = true

    return res.status(200).json({
      message: 'Your email has been confirmed',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/login', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('login', {
    // вказуємо назву контейнера
    name: 'login',
    // вказуємо назву компонентів
    component: ['back-button', 'field', 'field-password'],

    // вказуємо назву сторінки
    title: 'Login Page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/login', function (req, res) {
  const { email, password } = req.body

  console.log(email, password)

  if (!email || !password) {
    return res.status(400).json({
      message: 'Error! Required fields are missing',
    })
  }

  try {
    const user = User.getByEmail(email)
    if (!user) {
      return res.status(400).json({
        message:
          'Error! User with this email does not exist',
      })
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: 'Error! Wrong password',
      })
    }

    const session = Session.create(user)

    return res.status(200).json({
      message: 'You have been entered into your account',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// Підключаємо роутер до бек-енду
module.exports = router
