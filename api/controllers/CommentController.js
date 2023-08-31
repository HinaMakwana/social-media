/**
 * CommentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const id = sails.config.custom.uuid;
const {status} = sails.config.constant;

module.exports = {

    comment : async (req,res) => {
        try {
            const user = req.userData.id;
            const {
                post,
                comment
            } = req.body;
            const findPost = await Post.findOne({
                id : post,
                isDeleted : false
            })
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
        } catch (error) {
            return res.status(status.serverError).json({
                message: 'server error ' + error
            })
        }
    },
    deleteComment : async (req,res) => {
        try {
            const { comment } = req.body;
            const findComment = await Comment.findOne({ id : comment });
            if(!findComment){
                return res.status(status.notfound).json({
                    message : 'comment not found'
                })
            }
            await Comment.updateOne(
                { id : comment },
                { isDeleted : true }
            );
            return res.status(status.ok).json({
                message : 'comment deleted'
            })
        } catch (error) {
            return res.status(status.serverError).json({
                message: 'server error ' + error
            })
        }
    },
    updateComment : async (req,res) => {
        try {
            const { id, comment } = req.body
            const findComment = await Comment.findOne({
                id : id,
                isDeleted : false
            })
            if(!findComment){
                return res.status(status.notFound).json({
                    message : 'comment not found'
                })
            }
            const updateComment = await Comment.updateOne(
                { id : id },
                { comment : comment }
            )
            return res.status(status.ok).json({
                message : 'comment updated',
                Comment : updateComment
            })
        } catch (error) {
            return res.status(status.serverError).json({
                message: 'server error ' + error
            })
        }
    }

};
