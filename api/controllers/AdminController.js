/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const id = sails.config.custom.uuid
const bcrypt = sails.config.custom.bcrypt
const jwt = sails.config.custom.jwt
const {status} = sails.config.constant

module.exports = {

    signUp : async (req,res) => {
        let {  name, email, password } = req.body
        const fileUpload = await sails.helpers.uploadImage(req,'photo',`profile/${name}`)
        console.log(fileUpload);
        password = await bcrypt.hash(password, 10)
        const data = {
            id : id(),
            name : name,
            email : email,
            password : password,
            profile_photo : fileUpload
        }
        const findAdmin = await Admin.findOne({ email : email})
        if(findAdmin) {
            return res.status(status.conflict).json({
                message : 'please enter unique email'
            })
        }
        const createAdmin = await Admin.create(data).fetch()
        res.status(status.ok).json({
            message : 'ok',
            data : createAdmin
        })
    },
    login : async (req,res) => {
        let { email,password } = req.body
        const findAdmin = await Admin.findOne({email : email})
        if(!findAdmin){
            return res.status(status.notFound).json({
                message : 'admin not found'
            })
        }
        password = await bcrypt.compare(password,findAdmin.password)
        const token = jwt.sign(
            {
            email: findAdmin.email,
            adminId: findAdmin.id
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
    },
    logout : async (req,res) => {
        const admin = req.adminData.adminId
        const findAdmin = await Admin.findOne({id : admin})
        if(!findAdmin){
            return res.status(status.notFound).json({
                message : 'admin not found'
            })
        }
        await Admin.update({ id : admin},{token : ""})
        return res.status(status.ok).json({
            message : 'logout successfully'
        })
    },
    listAllUser : async (req,res) => {
        const userList = await Users.find({isDeleted : false}).omit(['token'])
        return res.status(status.ok).json({
            users : userList
        })
    },
    updateUser : async (req,res) => {
        const { id } = req.body
        let statusType
        const findUser = await Users.findOne({ id : id, isDeleted : false})
        if(!findUser) {
            return res.status(status.notFound).json({
                message : 'user not found'
            })
        }
        if(findUser.status == 'A'){
            statusType = 'I'
        } else {
            statusType = 'A'
        }
        await Users.update({ id : id }, { status : statusType })
        return res.status(status.ok).json({
            message : `user status is ${statusType}`
        })

    },
    DeleteUser : async (req,res) => {
        const { id } = req.body
        const findUser = await Users.findOne({ id : id, isDeleted : false})
        if(!findUser) {
            return res.status(status.notFound).json({
                message : 'user not found'
            })
        }
        const deleteUser = await Users.updateOne({id : id},{isDeleted : true})
        await Post.update({ postedBy : id }, { isDeleted : true })
        await Like.destroy({ user : id })
        await Comment.update({ user : id },{ isDeleted : true})
        await Follow.destroy({ user : id })
        return res.status(status.ok).json({
            message : 'user deleted',
            isDeleted : deleteUser.isDeleted
        })
    }

};
