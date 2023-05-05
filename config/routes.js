/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
    //routes for user
    'POST /user/signup' : 'UsersController.signup',
    'POST /user/login' : 'UsersController.login',
    'POST /user/logout' : 'UsersController.logout',
    'GET /user/list' : 'UsersController.listAll',
    'POST /user/listone' : 'UsersController.listOne',
    'GET /search/:name' : 'UsersController.searchUser',
    'GET /:name' : 'UsersController.searchPost',
    'PATCH /reset' : 'UsersController.resetPassword',
    'PATCH /type' : 'UsersController.changeType',
    //routes for admin
    'POST /admin/signup' : 'AdminController.signup',
    'POST /admin/login' : 'AdminController.login',
    'POST /admin/logout' : 'AdminController.logout',
    'PATCH /admin' : 'AdminController.updateUser',
    'DELETE /user' : 'AdminController.deleteUser',
    //routes for profile
    'POST /profile' : 'ProfileController.profile',
    'PATCH /profile/update' : 'ProfileController.updateProfile',
    'DELETE /profile/delete' : 'ProfileController.deletePic',
    //routes for post
    'POST /post/create' : 'PostController.createPost',
    'DELETE /post/delete' : 'PostController.deletePost',
    'PATCH /post/update' : 'PostController.updatePost',
    'GET /mypost' : 'PostController.myPost',
    'POST /post' : 'PostController.listAll',
    'POST /post/listone' : 'PostController.listOne',
    //routes for like
    'POST /like' : 'LikeController.like_unlike',
    //routes for comment
    'POST /comment' : 'CommentController.comment',
    'DELETE /comment' : 'CommentController.deleteComment',
    'PATCH /comment' : 'CommentController.updateComment',
    //routes for follow
    'POST /follow' : 'FollowController.follow',
    'GET /unfollow' : 'FollowController.unfollow'
};
