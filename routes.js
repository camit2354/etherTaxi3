const routes = require('next-routes')();

routes.add('/register/user/:address','/register/user');
routes.add('/register/driver/:address','/register/driver');

routes.add('/profile/user/:address','/profile/user') ;
routes.add('/profile/driver/:address','/profile/driver') ;

routes.add('/ride/user/:address','/ride/user')
routes.add('/ride/driver/:address' , '/ride/driver');

module.exports = routes    ;