/**
 * Users.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    username : {
      type : 'string',
    },
    name : {
      type : 'string'
    },
    email : {
      type : 'string'
    },
    password : {
      type : 'string'
    },
    profile_photo : {
      type : 'string'
    },
    token : {
      type : 'string'
    },
    status : {
      type : 'string',
      isIn : ['A','I'],
      defaultsTo : 'A'
    },
    accType : {
      type : 'string',
      isIn : ['PR','PU'],
      defaultsTo : 'PU'
    },
    isDeleted : {
      type : 'boolean',
      defaultsTo : false
    },
    like : {
      collection : 'like',
      via : 'user',
    },
    follower : {
      type : 'number',
      defaultsTo : 0
    },
    following : {
      type : 'number',
      defaultsTo : 0
    },
    followers : {
      collection : 'follow',
      via : 'follow'
    },
    followings : {
      collection : 'follow',
      via : 'user'
    }

  },


};
