/**
 * Admin.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

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

  },

};
