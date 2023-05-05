/**
 * CommentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const id = sails.config.custom.uuid
const {status} = sails.config.constant

module.exports = {
    
    comment : async (req,res) => {
        const user = req.userData.userId
        const { post, comment } = req.body
        const findPost = await Post.findOne({ id : post})
        if(!findPost) {
            return res.status(status.notfound).json({
                message : 'post not found'
            })
        }
        const data = {
            id : id(),
            user : user,
            post : post,
            comment : comment
        }
        const postComment = await Comment.create(data).fetch()
        return res.status(status.ok).json({
            message : `comment posted by ${user}`,
            Data : postComment
        })
    },
    deleteComment : async (req,res) => {
        const { comment } = req.body
        const findComment = await Comment.findOne({ id : comment })
        if(!findComment){
            return res.status(status.notfound).json({
                message : 'comment not found'
            })
        }
        await Comment.updateOne({ id : comment }, { isDeleted : true })
        return res.status(status.ok).json({
            message : 'comment deleted'
        })
    },
    updateComment : async (req,res) => {
        const { id, comment } = req.body
        const findComment = await Comment.findOne({ id : id, isDeleted : false})
        if(!findComment){
            return res.status(status.notFound).json({
                message : 'comment not found'
            })
        }
        const updateComment = await Comment.updateOne({ id : id }, { comment : comment })
        return res.status(status.ok).json({
            message : 'comment updated',
            Comment : updateComment
        })
    }

};
