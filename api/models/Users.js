/**
 * Users.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
let status = sails.config.constant.UserStatus;
let type = sails.config.constant.accType;
module.exports = {

  attributes: {

    username : {
      type : 'string',
      required : true
    },
    name : {
      type : 'string',
      required: true
    },
    email : {
      type : 'string',
      required: true,
      isEmail: true
    },
    password : {
      type : 'string',
      required: true
    },
    profile_photo : {
      type : 'string',
      allowNull: true
    },
    token : {
      type : 'string',
      allowNull: true
    },
    status : {
      type : 'string',
      isIn : [status.A,status.I],
      defaultsTo : status.A
    },
    accType : {
      type : 'string',
      isIn : [type.PR,type.PU],
      defaultsTo : type.PU
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
