/**
 * ProfileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const {status} = sails.config.constant

module.exports = {

    profile : async (req,res) => {
        const user = req.userData.userId
        const { id } = req.body
        let data
        if( id != null ) {
            data = id
        } else {
            data = user
        }
        const findUser = await Users.findOne({id : data, status : 'A', isDeleted : false}).omit(['password','token']).populate('like').populate('followers').populate('followings')
        if(!findUser){
            return res.status(status.notFound).json({
                message : 'User not found'
            })
        }
        return res.status(status.ok).json({
            User : findUser
        })
    },
    updateProfile : async (req,res) => {
        const user = req.userData.userId
        let { username, name } = req.body
        const findUser = await Users.findOne({id : user, status : 'A', isDeleted : false})
        if(!findUser){
            return res.status(status.notFound).json({
                message : 'User not found'
            })
        }
        if(username == null){
            username = findUser.username
        } else {
            const findUsername = await Users.findOne({username : username, status : 'A', isDeleted : false})
            if(findUsername){
                return res.status(status.conflict).json({
                    message : 'username exist'
                })
            }
            username = username
        }
        if(name == null) {
            name = findUser.name
        }

        let fileUpload = await sails.helpers.uploadImage(req,'image','profile/photo')
        if(fileUpload == " ") {
            fileUpload = findUser.profile_photo
        }
        const data = {
            username : username,
            name : name,
            profile_photo : fileUpload
        }
        const updateProfile = await Users.update({id : user}, data).fetch()
        return res.status(status.ok).json({
            message : 'profile updated'
        })
    },
    deletePic : async (req,res) => {
        const user = req.userData.userId
        const deletePhoto = await Users.updateOne({id : user, status : 'A', isDeleted : false},{profile_photo : " "})
        if(!deletePhoto) {
            return res.status(status.unAuthorized).json({
                message : 'user account is not active'
            })
        }
        return res.status(status.ok).json({
            message : 'deleted profile photo'
        })
    }

};
