/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const id = sails.config.custom.uuid;
const bcrypt = sails.config.custom.bcrypt;
const jwt = sails.config.custom.jwt;
const {status,UserStatus} = sails.config.constant;

module.exports = {
    
    signUp : async (req,res) => {
        try {
            let {
                name,
                email,
                password
            } = req.body;
            let fileUpload = await sails.helpers.uploadImage(req,'photo',`profile/${name}`)
            console.log(fileUpload,'dsds');
            if(fileUpload) {
                fileUpload = fileUpload.fd;
            }
            password = await bcrypt.hash(password, 10);

            const findAdmin = await Admin.findOne({
                email : email,
                isDeleted : false
            })
            if(findAdmin) {
                return res.status(status.conflict).json({
                    message : 'please enter unique email'
                })
            }

            const data = {
                id : id(),
                name : name,
                email : email,
                password : password,
                profile_photo : fileUpload
            }
            const createAdmin = await Admin.create(data).fetch();
            res.status(status.ok).json({
                message : 'ok',
                data : createAdmin
            })
        } catch (error) {
            return res.status(status.serverError).json({
                message: 'server error ' + error
            })
        }
    },
    login : async (req,res) => {
        try {
            let {
                email,
                password
            } = req.body;

            const findAdmin = await Admin.findOne({
                email : email,
                isDeleted : false
            })
            if(!findAdmin){
                return res.status(status.notFound).json({
                    message : 'Invalid email'
                })
            }
            let comparePass = await bcrypt.compare(password,findAdmin.password);
            if(!comparePass) {
                return res,status(status.badRequest).json({
                    message: 'Invalid Email or Password'
                })
            }
            const token = jwt.sign(
                {
                email: findAdmin.email,
                id: findAdmin.id
                },
                process.env.JWT_KEY,
                {
                    expiresIn : "8h"
                }
            )
            await Admin.update({email : email},{token : token})
            return res.status(status.accepted).json({
                message : 'login successfully',
                token : token
            })
        } catch (error) {
            return res.status(status.serverError).json({
                message: 'server error ' + error
            })
        }
    },
    logout : async (req,res) => {
        try {
            const admin = req.adminData.id;
            const findAdmin = await Admin.findOne({
                id : admin,
                isDeleted : false
            })
            if(!findAdmin){
                return res.status(status.notFound).json({
                    message : 'admin not found'
                })
            }
            await Admin.updateOne({ id : admin },{token : null})
            return res.status(status.ok).json({
                message : 'logout successfully'
            })
        } catch (error) {
            return res.status(status.serverError).json({
                message: 'server error ' + error
            })
        }
    },
    listAllUser : async (req,res) => {
        try {
            const userList = await Users.find({
                isDeleted : false
            })
            .omit(['token'])
            return res.status(status.ok).json({
                users : userList
            })
        } catch (error) {
            return res.status(status.serverError).json({
                message: 'server error ' + error
            })
        }
    },
    updateUser : async (req,res) => {
        try {
            const { id } = req.body;
            let statusType;
            const findUser = await Users.findOne({
                id : id,
                isDeleted : false
            });
            if(!findUser) {
                return res.status(status.notFound).json({
                    message : 'user not found'
                })
            }
            if(findUser.status == UserStatus.A){
                statusType = UserStatus.I;
            } else {
                statusType = UserStatus.A
            }
            await Users.updateOne({ id : id }, { status : statusType })
            return res.status(status.ok).json({
                message : `user status is ${statusType}`
            })
        } catch (error) {
            return res.status(status.serverError).json({
                message: 'server error ' + error
            })
        }
    },
    DeleteUser : async (req,res) => {
        try {
            const { id } = req.body;
            const findUser = await Users.findOne({
                id : id,
                isDeleted : false
            })
            if(!findUser) {
                return res.status(status.notFound).json({
                    message : 'user not found'
                })
            }
            const deleteUser = await Users.updateOne({
                id : id,
                isDeleted : false
            },{isDeleted : true})
            await Post.update({
                postedBy : id ,
                isDeleted : false
            }, { isDeleted : true })
            await Like.destroy({ user : id })
            await Comment.update({
                 user : id,
                 isDeleted : false
            },{ isDeleted : true})
            await Follow.destroy({ user : id })
            return res.status(status.ok).json({
                message : 'user deleted',
                isDeleted : deleteUser.isDeleted
            })
        } catch (error) {
            return res.status(status.serverError).json({
                message: 'server error ' + error
            })
        }
    }

};
