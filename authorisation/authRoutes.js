module.exports =  (router, expressApp, authRoutesMethods) => {

    //route for registering new users
    router.post('/registerUser', authRoutesMethods.registerUser)

    //route for allowing existing users to login
    router.post('/login', authRoutesMethods.login)

    return router
}
