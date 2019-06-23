let userDBHelper
let io
var jwt = require('jsonwebtoken');
var request = require('request')
let secretKey


module.exports = (injectedUserDBHelper, socketio, secret) => {

  userDBHelper = injectedUserDBHelper
  io = socketio
  secretKey = secret

  return {
    registerUser: registerUser,
    login: login
  }
}

/* handles the api call to register the user and insert them into the users table.
  The req body should contain a username and password. */
function registerUser(req, res){

    console.log(`authRoutesMethods: registerUser: req.body is:`, req);

    //query db to see if the user exists already
    userDBHelper.doesUserExist(req.body.username, (sqlError, doesUserExist) => {

      //check if the user exists
      if (sqlError !== null || doesUserExist){

        //message to give summary to client
        const message = sqlError !== null ? "Operation unsuccessful" : "User already exists"

        //detailed error message from callback
        const error =  sqlError !== null ? sqlError : "User already exists"

        sendResponse('register', message, sqlError)

        return
      }

      //register the user in the db
      userDBHelper.registerUserInDB(req.body.username, req.body.password, req.body.name, req.body.email, dataResponseObject => {

        //create message for the api response
        const message =  dataResponseObject.error === null  ? "Registration was successful" : "Failed to register user"

        if(dataResponseObject.error != null){
          sendResponse('register', message, dataResponseObject.error)
          return
        } else{
            redirect(req.body.username, res)
            return
        }
      })
    })
  }




function login(req, res){
  userDBHelper.getUserFromCrentials(req.body.username, req.body.password, (userData) => {
    var isInDB = (userData != null) ? true : false

    if(isInDB){
      redirect(req.body.username, res)
      return
    } else {
      sendResponse('login', '', 'Incorrect Login Information')
    }

  })


}

//sends a response created out of the specified parameters to the client.
//The typeOfCall is the purpose of the client's api call
function sendResponse(type, message, error) {
  io.sockets.emit('error', {type: type, msg: message, error: error})
}

function redirect(username, res){
  // startServer(username).then(()=>{

    jwt.sign({ name: username }, secretKey, { algorithm: 'HS256' }, function(err, token){

      res.cookie('jupyterAuth', 'bearer ' + token,
       { domain: '.quantitate.trade', secure: true, maxAge: 3600000 });

      res.redirect(`https://quantitate.trade/dashboard`)

    });
  // });
}

const token = 'c25b2bfef67f4b3993b2c0f05f2bfdc9'
const apiUrl = 'http://notebooks.quantitate.trade:8081/hub/api'

function startServer(username){
  console.log(username)
  return new Promise((resolve, reject) => {
    request({
        headers: {
          'Authorization': 'token ' + token,
        },
        uri: `${apiUrl}/users/${username}/server`,
        method: 'POST'
      }, function (err, res, body) {
        console.log("HEEYYY!")
        console.log(err, body)
        resolve()
      });
  })
}
