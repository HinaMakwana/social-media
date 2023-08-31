/**
 * Post.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    media : {
      type : 'string',
      required: true
    },
    title : {
      type : 'string',
      required: true
    },
    caption : {
      type : 'string',
      allowNull: true
    },
    postedBy : {
      type : 'string',
      required: true
    },
    postedAt : {
      type : 'ref',
      defaultsTo : new Date().toLocaleString()
    },
    isDeleted : {
      type : 'boolean',
      defaultsTo : false
    },
    like : {
      type : 'number',
      defaultsTo : 0
    },
    comment : {
      collection : 'comment',
      via : 'post',
    }

  },

};
