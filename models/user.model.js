var mongoose = require('mongoose');
var sha1 = require('sha1');


var userSchema = new mongoose.Schema({
  username:String,
  password:String,
  email:String,
  uuid:Number,
  links: [{
    hash:String
  }]
});

userSchema.statics.findUserByID = function(id, cb) {
  return this.model('User').find({uuid:id}).limit(1).exec(cb);
}

userSchema.statics.findUserByName = function(uname, cb) {
  return this.model('User').find({username:uname}).limit(1).exec(cb);
}

userSchema.statics.findUserByEmail = function(addr, cb) {
  return this.model('User').find({email:addr}).limit(1).exec(cb);
}

userSchema.statics.getLatestID = function(cb) {
  return this.model('User').find().sort('-uuid').limit(1).exec(cb);
}

userSchema.statics.newUser = function(uname, addr, pass, cb) {
  return this.findUserByName(uname, (err, name) => {
    this.findUserByEmail(addr, (err, email) => {
      if(name[0] !== undefined || email[0] !== undefined)
        cb(-1, {satus:"error", message:"Username or Email Taken"});
      else {
        this.getLatestID((err, id) => {
          var id = (id[0] === undefined) ? 0 : id[0].uuid + 1;
          if(addr.match(/[a-zA-Z0-9.]*@[a-zA-Z0-9]*\.[a-zA-Z][a-zA-Z].*/))
            this.model('User').create({
              uuid:id,
              username:uname,
              password:sha1(pass),
              email:addr,
              links:[]
            }, cb(0, {status:"success", message:"User Created"}));
          else
            cb(-1, {status:"error", message:"Invalid Email"});
        })
      }
    })
  })
}

module.exports = mongoose.model('User', userSchema)
