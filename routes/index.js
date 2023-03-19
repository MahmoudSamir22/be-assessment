const userRouter = require('./authRoute')
const checkRouter = require('./checkRoute')
const checkTestRouter = require('./checkTestRoutes')

const mountRoutes = (app) => {
    app.use('/api/auth', userRouter)
    app.use('/api/check', checkRouter)
    app.use('/', checkTestRouter)
}

module.exports = mountRoutes