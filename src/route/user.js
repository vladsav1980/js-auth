// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('../class/user')

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/user-list', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('user-list', {
    // вказуємо назву контейнера
    name: 'user-list',
    // вказуємо назву компонентів
    component: ['back-button'],

    // вказуємо назву сторінки
    title: 'User List Page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/user-list-data', function (req, res) {
  const list = User.getList()

  if (list.length === 0) {
    return res.status(400).json({
      message: 'The user list is empty',
    })
  }

  return res.status(200).json({
    list: list.map(({ id, email, role }) => ({
      id,
      email,
      role,
    })),
  })
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/user-item', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('user-item', {
    // вказуємо назву контейнера
    name: 'user-item',
    // вказуємо назву компонентів
    component: ['back-button'],

    // вказуємо назву сторінки
    title: 'User Item Page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/user-item-data', function (req, res) {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({
      message: 'User ID is missing',
    })
  }

  const user = User.getById(Number(id))

  if (!user) {
    return res.status(400).json({
      message: 'User with this ID does not exist',
    })
  }

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      isConfirm: user.isConfirm,
    },
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
