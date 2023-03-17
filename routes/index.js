const userRouter = require('./userRoute')

const mountRoutes = (app) => {
    app.use('/api/user', userRouter)
}

module.exports = mountRoutes