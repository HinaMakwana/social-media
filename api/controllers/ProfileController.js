/**
 * ProfileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const {status,UserStatus} = sails.config.constant;

module.exports = {

    profile : async (req,res) => {
        try {
            const user = req.userData.id;
            const { id } = req.body;
            let data;
            if( id != null ) {
                data = id;
            } else {
                data = user;
            }
            const findUser = await Users.findOne({
                id : data,
                status : UserStatus.A,
                isDeleted : false
            })
            .omit(['password','token'])
            .populate('like')
            .populate('followers')
            .populate('followings')
            if(!findUser){
                return res.status(status.notFound).json({
                    message : 'User not found'
                })
            }
            return res.status(status.ok).json({
                User : findUser
            })
        } catch (error) {
            return res.status(status.serverError).json({
                message: 'server error ' + error
            })
        }
    },
    updateProfile : async (req,res) => {
        try {
            const user = req.userData.id;
            let { username, name } = req.body;
            const findUser = await Users.findOne({
                id : user,
                status : UserStatus.A,
                isDeleted : false
            })
            if(!findUser){
                return res.status(status.notFound).json({
                    message : 'User not found'
                })
            }
            if(username == null){
                username = findUser.username;
            } else {
                const findUsername = await Users.findOne({
                    username : username,
                    status : UserStatus.A,
                    isDeleted : false
                })
                if(findUsername){
                    return res.status(status.conflict).json({
                        message : 'username exist'
                    })
                }
                username = username;
            }
            if(name == null) {
                name = findUser.name;
            }

            let fileUpload = await sails.helpers.uploadImage(req,'image','profile/photo');
            console.log(fileUpload);
            if(!fileUpload) {
                fileUpload = findUser.profile_photo;
            } else {
                fileUpload = fileUpload.fd;
            }
            const data = {
                username : username,
                name : name,
                profile_photo : fileUpload
            }
            const updateProfile = await Users.updateOne({
                id : user,
                isDeleted: false
            },
            data
            )
            return res.status(status.ok).json({
                message : 'profile updated',
                Data : updateProfile
            })
        } catch (error) {
            return res.status(status.serverError).json({
                message: 'server error ' + error
            })
        }
    },
    deletePic : async (req,res) => {
        try {
            const user = req.userData.id;
            const deletePhoto = await Users.updateOne({
                id : user,
                status : UserStatus.A,
                isDeleted : false
            },{
                profile_photo : null
            })
            if(!deletePhoto) {
                return res.status(status.unAuthorized).json({
                    message : 'user account is not active'
                })
            }
            return res.status(status.ok).json({
                message : 'deleted profile photo'
            })
        } catch (error) {
            return res.status(status.serverError).json({
                message: 'server error ' + error
            })
        }
    }
};
