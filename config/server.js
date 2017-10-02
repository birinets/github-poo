{
  module.exports = {
    "port":process.env.PORT || 3000,
    "secretKey":"c00dd843dcfa74ae5bf937859972620c50933c477ed989bda894b54fd78badd4",
    "email": {
      "service": 'gmail',
      // Gmail accounts will need to allow access by less secure apps
      // See https://support.google.com/accounts/answer/6010255
      "auth": {
        "user": 'email@gmail.com',
        "pass": 'password',
      }
    }
  }
}
