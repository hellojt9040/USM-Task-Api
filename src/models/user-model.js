const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    trim:true,
    required:true,
    minlength:4
  },
  email:{
    type:String,
    required:true,
    trim:true,
    unique:true,
    validate(value){
      if(!validator.isEmail(value))
        throw new Error('enter a valid email')
    }
  },
  password:{
    type:String,
    required:true,
    validate(value){
      if(value.includes('password'))
        throw new Error("entered password field can't contain word: 'password'")
    }
  },
  mobile:{
    type:String,
    trim:true,
    unique:true,
    required:true,
    minlength:10
  },
  gender:{
    type:String,
    trim:true,
    required:true,
  },
  designation:{
    type:String,
    trim:true,
    required:true,
  },
},{
  timestamps:true
})

//generating auth token
userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({_id:user._id.toString()}, process.env.JWT_SECRET, {expiresIn:"1h"}); 
  return token;
}

//login security validation
userSchema.statics.findByCredentials = async (email, password) => {
  const mobile = email.length === 10 && !isNaN(+email) && email
  let foundUser
  if(mobile){
    foundUser = await User.findOne({mobile}); 
  }else{
    foundUser = await User.findOne({email});
  }

  if(!foundUser)
      throw new Error('unable to login, try again !!');
  const isMatch = await bcrypt.compare(password, foundUser.password);
  console.log(isMatch, "isMatch");


  if(!isMatch)
      throw new Error('unable to login, try again !!');

  return foundUser;
}

// hash the plain text before saving
userSchema.pre('save', async function(next) {
  const user = this;

  if( user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

//hidding private data
userSchema.methods.toJSON = function () {
  const user = this.toObject();

  //deleting private data and retuning
  delete user.password;
  return user;
}

const User = mongoose.model('User',userSchema)

module.exports = User
