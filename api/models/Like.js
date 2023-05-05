/**
 * Like.js
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
    }
  },

};