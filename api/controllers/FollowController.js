/**
 * FollowController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const {status} = sails.config.constant;
const id = sails.config.custom.uuid;

module.exports = {

    follow : async (req,res) => {
        try {
            const user = req.userData.id;
            const { userid } = req.body;
            const findUser = await Users.findOne({
                id : userid,
                isDeleted : false
            })
            if(!findUser){
                return res.status(status.notFound).json({
                    message : 'User not found'
                })
            }
            if(findUser.id == user) {
                return res.status(status.conflict).json({
                    message : 'you cannot follow yourself'
                })
            }
            const findFollow = await Follow.findOne({
                user : user,
                follow : userid
            })
            if(!findFollow){
                const followUser = await Follow.create({
                    id : id(),
                    follow : userid,
                    user : user
                }).fetch()
                const findFollower= await Follow.count({follow : userid})
                const findFollowing= await Follow.count({ user : user })
                await Users.updateOne({
                    id : user,
                    isDeleted : false
                },
                { following : findFollowing
                })
                await Users.updateOne({
                    id : userid,
                    isDeleted : false
                },
                { follower : findFollower
                })
                return res.status(status.accepted).json({
                    message : `you follow ${userid}`,
                    Data : followUser
                })
            }
            await Follow.destroy({
                user : user,
                follow : userid
            })
            const findFollower= await Follow.count({follow : userid})
            const findFollowing= await Follow.count({ user : user })
            await Users.update({
                id : user,
                isDeleted : false
            },
            { following : findFollowing
            })
            await Users.update({
                id : userid,
                isDeleted : false
            },
            { follower : findFollower
            })
            return res.status(status.accepted).json({
                message : `you unfollow ${userid}`,
            })
        } catch (error) {
            return res.status(status.serverError).json({
                message: 'server error ' + error
            })
        }
    },


};
