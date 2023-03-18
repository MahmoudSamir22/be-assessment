const userRouter = require('./authRoute')
const checkRouter = require('./checkRoute')

const mountRoutes = (app) => {
    app.use('/api/auth', userRouter)
    app.use('/api/check', checkRouter)
}

module.exports = mountRoutes