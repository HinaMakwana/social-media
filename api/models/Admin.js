/**
 * Admin.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

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
    isDeleted: {
      type : 'boolean',
      defaultsTo: false
    }

  },

};
