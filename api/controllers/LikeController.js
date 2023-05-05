/**
 * LikeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const id = sails.config.custom.uuid
const {status} = sails.config.constant

module.exports = {

    like_unlike : async (req,res) => {
        const user = req.userData.userId
        const { post } = req.body
        const data = {
            id : id(),
            user : user,
            post:post
        }
        const findPost = await Post.findOne({ id : post, isDeleted : false})
        const findComment = await Comment.findOne({ id : post, isDeleted : false })
        const findLike = await Like.findOne({ user : user, post : post })
        if(findPost){
            if(findLike){
                const deleteLike = await Like.destroy({ post : post})
                await Post.updateOne({ id : post}, { like : findPost.like  - 1})
                return res.status(status.conflict).json({
                    message : `dislike post by ${user}`,
                    disLike : deleteLike
                })
            }
            const postLike = await Like.create(data).fetch()
            await Users.addToCollection(user,'like',postLike.id)
            await Post.updateOne({ id : post}, { like : findPost.like + 1})
            return res.status(status.accepted).json({
                message : `like post by ${user}`,
                Like : postLike
            })
        }
        if(findComment) {
            if(findLike){
                const deleteLike = await Like.destroy({ post : post})
                await Comment.updateOne({ id : post}, { like : findComment.like  - 1})
                return res.status(status.conflict).json({
                    message : `dislike post by ${user}`,
                    disLike : deleteLike
                })
            }
            const postLike = await Like.create(data).fetch()
            await Comment.updateOne({ id : post}, { like : findComment.like + 1})
            return res.status(status.accepted).json({
                message : `like post by ${user}`,
                Like : postLike
            })
        }
    },
};
