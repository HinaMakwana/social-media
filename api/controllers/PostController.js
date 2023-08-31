/**
 * PostController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const {status} = sails.config.constant;
const id = sails.config.custom.uuid;

module.exports = {

    createPost : async (req,res) => {
        try {
            const user = req.userData.id;
            const { caption,title } = req.body;
            let fileUpload = await sails.helpers.uploadImage(
                req,
                'post',
                `post/${user.username}`
            )
            if(!fileUpload){
                return res.status(status.badRequest).json({
                    message : 'post is not created'
                })
            } else {
                if (fileUpload.type.includes('image/')|| fileUpload.type.includes('video/')) {
                    fileUpload = fileUpload.fd;
                } else {
                    return res.status(status.unAuthorized).json({
                        message : 'you can upload images and videos only'
                    })
                }
            }
            const data = {
                id : id(),
                media : fileUpload,
                caption : caption,
                title : title,
                postedBy : user,
            }
            const createPost = await Post.create(data).fetch()
            return res.status(status.created).json({
                message : 'Post created',
                Post : createPost
            })
        } catch (error) {
            return res.status(status.serverError).json({
                message: 'server error ' + error
            })
        }
    },
    updatePost : async (req,res) => {
        try {
            const user = req.userData.id;
            let { caption, id } = req.body;
            const findPost = await Post.findOne({
                id : id,
                postedBy : user,
                isDeleted : false
            })
            if(!findPost){
                return res.status(status.notFound).json({
                    message : 'post is not found'
                })
            }
            const updatePost = await Post.updateOne({
                id : id,
                isDeleted : false
            },{
                caption : caption
            })
            return res.status(status.accepted).json({
                message : 'post updated successfully',
                post : updatePost
            })
        } catch (error) {
            return res.status(status.serverError).json({
                message: 'server error ' + error
            })
        }
    },
    deletePost : async (req,res) => {
        try {
            const user = req.userData.id;
            const { id } = req.body;
            const findPost = await Post.findOne({
                id : id,
                postedBy : user,
                isDeleted : false
            })
            if(!findPost){
                return res.status(status.notFound).json({
                    message : 'post is not found'
                })
            }
            await Post.updateOne({
                id : id,
                isDeleted : false
            }, {
                isDeleted:true
            })
            await Like.destroy({post : id})
            await Comment.update({
                post : id,
                isDeleted : false
            },{
                isDeleted : true
            })
            return res.status(status.ok).json({
                message : 'Post deleted successfully'
            })
        } catch (error) {
            return res.status(status.serverError).json({
                message: 'server error ' + error
            })
        }
    },
    myPost : async (req,res) => {
        try {
            const user = req.userData.id;
            const findPost = await Post.find({
                postedBy : user,
                isDeleted : false
            })
            return res.status(status.ok).json({
                message : 'All post',
                Post : findPost
            })
        } catch (error) {
            return res.status(status.serverError).json({
                message: 'server error ' + error
            })
        }
    },
    listAll : async (req,res) => {
        try {
            const { limit } = req.body;
            const user = req.userData.id;
            const findPost = await Post.find({
                where :
                {
                    postedBy : {'!=' : user},
                    isDeleted : false
                },
                limit : limit,
                sort : 'postedAt DESC'
                })
            return res.status(status.ok).json({
                Post : findPost
            })
        } catch (error) {
            return res.status(status.serverError).json({
                message: 'server error ' + error
            })
        }
    },
    listOne : async (req,res) => {
        try {
            const { id } = req.body;
            const findPost = await Post.findOne({
                id : id,
                isDeleted : false
            })
            .populate('comment',{
                where : { isDeleted : false }
            })
            if(!findPost){
                return res.status(status.notFound).json({
                    message : 'post is not found'
                })
            }
            return res.status(status.ok).json({
                Post : findPost
            })
        } catch (error) {
            return res.status(status.serverError).json({
                message: 'server error ' + error
            })
        }
    },

};
