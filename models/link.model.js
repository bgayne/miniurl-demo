var mongoose = require('mongoose');
var sha1 = require('sha1');

function formatTarget(target) {
  if(!target.match(/https?:\/\/.*/))
    return "https://"+target;
  else return target;
}

var linkSchema = new mongoose.Schema({
  target : String,
  hash : String,
  ownerID : Number,
  clicks : Number,
  log : [{
    header: [String],
    timestamp:String
  }],
  privacy : {
    isPrivate : Boolean,
    password : String,
  }
});

linkSchema.statics.getLink = function(hash, cb) {
  return this.model('Link').find({hash:hash}).limit(1).exec(cb);
}

linkSchema.statics.getLinksByUser = function(userID, cb) {
  return this.model('Link').find({ownerID:userID}, cb);
}

linkSchema.statics.updateLog = function(header, timestamp, hash, cb) {
  return this.model('Link').update({hash:hash}, {$push : { log: {
    header:header,
    timestamp:timestamp
  } } }, cb);
}

linkSchema.statics.updateClicks = function(hash, cb) {
  return this.model('Link').update({hash:hash}, {$inc : { clicks : 1 }}).exec(cb);
}

linkSchema.statics.newLink = function(target, owner, cb) {
  this.getLink(sha1(target), (err, link) => {
    if(link[0] !== undefined) cb(-1, {notice:"Link Already Exists"}); //Realistically, this should never be reached. But, hey, who knows?
    else {
        this.model('Link').create({
          target:formatTarget(target),
          hash:sha1(target + (+ new Date())).substring(0, 8), //Doesn't really matter if this is formatted. We just want a unique hash for the url.
          ownerID:owner,
          clicks:0,
          log:[],
          privacy:{
            isPrivate : false,
            password : undefined
          }
        }, cb);
    }
  })
}

linkSchema.statics.newPrivateLink = function(target, owner, password, cb) {
  this.model('Link').create({
    target:formatTarget(target),
    hash:sha1(target + (+ new Date())),
    ownerID:owner,
    clicks:0,
    log:[],
    privacy:{
      isPrivate:true,
      password:sha1(password)
    }
  }, cb)
}

module.exports = mongoose.model('Link', linkSchema)
