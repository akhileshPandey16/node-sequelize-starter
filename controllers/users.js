const models         = require('./../database/models');
const bcrypt         = require('bcrypt');




exports.createUser = async function(firstname,lastname,email, password){ 
    password = await bcrypt.hash(password, 10);
    console.log(password);
    return await models.User.create({firstname,lastname,email, password});
  }    
exports.getAllUsers = async () => {
    try {
      return await models.User.findAll();
    } catch (error) {
      return error;
    } 
  };

exports.getUser = async obj => {
    return await models.User.findOne({
    where: obj,
  });
  };