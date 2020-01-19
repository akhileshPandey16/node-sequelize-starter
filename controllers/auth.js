
var passport            = require('passport');
var jwt                 = require('jsonwebtoken');
const passportJWT       = require('passport-jwt');
const index             = require('./index');
const bcrypt            = require('bcrypt');
const User              = require("./users");
const HttpStatus = require('http-status-codes');
require('dotenv').config();

// initialize
// ************************************     JWT INIT BEGIN       ************************************
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey =  process.env.SECRET_KEY;

let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    let user = User.getUser({ id: jwt_payload.id });
    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  });
  // use the strategy
passport.use(strategy);
// ************************************     JWT INIT OVER       ************************************
exports.login   =   async function(req,res,next){
    console.log("login called");
    const { firstname, password } = req.body;
    if (firstname && password) {
    console.log(firstname+" "+password);
    let user = await User.getUser({ firstname });
    
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({ msg: 'No such user found', user });
    }
    console.log(`User Password: ${user.password}`)
    bcrypt.compare(password,user.password)
    .then(function(data){
    if(data){
    let payload = { id: user.id };
      console.log(`User id is : ${user.id}`);
      let token = jwt.sign(payload, jwtOptions.secretOrKey);
      res.status(HttpStatus.OK).json({ msg: 'ok', token: token });
    }
    else{
      res.status(HttpStatus.UNAUTHORIZED).json({ msg: 'Password is incorrect' });
    }
  })
  .catch(function(){
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({msg:'Internal Server Error'});
  });
  
  }
}

exports.signup    = async function(req,res,next){
  console.log("sign-up called");
  try {
    const { firstname,lastname,email, password } = req.body; 
    let existingUser  = await User.getUser({email:email});
    if(existingUser){
      return res.status(HttpStatus.UNAUTHORIZED).json({msg:"User with given Email Already Exists"});
      
    }
    let user  = await User.createUser(firstname,lastname,email, password);  
    res.send(JSON.stringify(user));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({msg:'Internal Server Error'});
  }
}
  
  

