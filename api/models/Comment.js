/**
 * Comment.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    user : {
      model : 'users'
    },
    post : {
      model : 'post'
    },
    comment : {
      type : 'string'
    },
    isDeleted : {
      type : 'boolean',
      defaultsTo : false
    },
    like : {
      type : 'number',
      defaultsTo : 0
    }

  },

};
