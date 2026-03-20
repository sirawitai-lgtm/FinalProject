const SESSION_KEY = 'stockpro_user'

function getSession() {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
}

function saveSession(data) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data))
}

function requireAuth(basePath) {
    const session = getSession()
    if (!session) {
        window.location.href = basePath + 'login.html'
        return null
    }
    return session
}

function requireAdmin(basePath) {
    const session = requireAuth(basePath)
    if (!session) return null
    if (session.role !== 'admin') {
        window.location.href = basePath + 'index.html'
        return null
    }
    return session
}

function logout(basePath) {
    sessionStorage.removeItem(SESSION_KEY)
    window.location.href = basePath + 'login.html'
}
