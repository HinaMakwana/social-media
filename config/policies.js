/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,
  UsersController : {
    logout : 'isUser',
    listOne : 'isUser',
    searchUser : 'isUser',
    searchPost : 'isUser',
    changeType : 'isUser'
  },
  AdminController : {
    logout : 'isAdmin',
    updateUser : 'isAdmin',
    deleteUser : 'isAdmin'
  },
  ProfileController : {
    '*' : 'isUser'
  },
  PostController : {
    '*' : 'isUser'
  },
  LikeController : {
    '*' : 'isUser'
  },
  CommentController : {
    '*' : 'isUser'
  },
  FollowController : {
    '*' : 'isUser'
  }

};
