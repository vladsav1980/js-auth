export const SESSION_KEY = 'sessionAuth'

export const saveSession = (session) => {
  console.log(session)
  window.session = session
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export const loadSession = () => {
  try {
    const session = JSON.parse(
      localStorage.getItem(SESSION_KEY),
    )

    if (session) {
      window.session = session
    } else {
      window.session = null
    }
  } catch (err) {
    console.log(err)
    window.session = null
  }
}

export const getTokenSession = () => {
  try {
    const session = getSession()
    return session ? session.token : null
  } catch (err) {
    console.log(err)
    return null
  }
}

export const getSession = () => {
  try {
    const session =
      JSON.parse(localStorage.getItem(SESSION_KEY)) ||
      window.session

    return session || null
  } catch (err) {
    console.log(err)
    return null
  }
}
