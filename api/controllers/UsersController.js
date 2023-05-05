/**
 * UsersController
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
        let { username, name, email, password } = req.body
        let fileUpload = await sails.helpers.uploadImage(req,'image',`profile/${username}`)
        if(fileUpload !== ' '){
            if (fileUpload.type.includes('image/')) {
                fileUpload = fileUpload.fd
            } else {
                return res.status(status.unAuthorized).json({
                    message : 'you can upload images only'
                })
            }
        }
        password = await bcrypt.hash(password, 10)
        const data = {
            id : id(),
            username : username,
            name : name,
            email : email,
            password : password,
            profile_photo : fileUpload
        }
        const findUser = await Users.findOne({ email : email, status : 'A', isDeleted : false})
        const findUsername = await Users.findOne({username : username, status : 'A', isDeleted : false})
        if(findUser || findUsername) {
            return res.status(status.conflict).json({
                message : 'please enter unique value'
            })
        }
        const createUser = await Users.create(data).fetch()
        res.status(status.ok).json({
            message : 'ok',
            data : createUser
        })
    },
    login : async (req,res) => {
        let { username,password } = req.body
        const findUser = await Users.findOne({username : username, status : 'A', isDeleted : false})
        if(!findUser){
            return res.status(status.notFound).json({
                message : 'user not found'
            })
        }
        password = await bcrypt.compare(password,findUser.password)
        const token = jwt.sign(
            {
            email: findUser.email,
            username : findUser.username,
            userId: findUser.id
            },
            process.env.JWT_KEY,
                {
                    expiresIn : "8h"
                }
        )
        await Users.update({username : username},{token : token})
        return res.status(status.accepted).json({
            message : 'login successfully',
            token : token
        })
    },
    logout : async (req,res) => {
        const user = req.userData.userId
        const findUser = await Users.findOne({id : user, status : "A", isDeleted : false})
        if(!findUser){
            return res.status(status.notFound).json({
                message : 'user not found'
            })
        }
        await Users.update({ id : user},{token : ""})
        return res.status(status.ok).json({
            message : 'logout successfully'
        })
    },
    listAll : async (req,res) => {
        const findUsers = await Users.find({status : 'A', isDeleted : false}).omit(['token'])
        return res.status(status.ok).json({
            Users : findUsers
        })
    },
    listOne : async (req,res) => {
        const user = req.userData.userId
        const { id } = req.body
        const findUser = await Users.findOne({ id : user , status : 'A', isDeleted : false })
        if(!findUser) {
            return res.status(status.notFound).json({
                message : 'user not found'
            })
        }
        const userOne = await Users.findOne({ id : id, status : 'A'}).omit(['password','token','status'])
        if(!userOne) {
            return res.status(status.notFound).json({
                message : 'user not found'
            })
        }
        let findPost
        if(userOne.accType == 'PU'){
            findPost = await Post.find({ postedBy : id })
        } else {
            const findFollow = await Follow.find({ user : user, follow : id })
            if(findFollow){
                return res.status(status.unAuthorized).json({
                    message : 'user account is private'
                })
            } else {
                findPost = await Post.find({ postedBy : id})
            }
        }
        return res.status(status.ok).json({
            user : userOne,
            post : findPost
        })
    },
    searchUser : async (req,res) => {
        const findUser = await Users.find({ where: {
            username: {'contains' : req.param('name')},
            isDeleted : false
        },
        limit : 5,
        select : ['id','username','name','profile_photo']
        })
        return res.status(status.ok).json({
            List : findUser
        })
    },
    searchPost : async (req,res) => {
        const findPost = await Post.find({ where: {
            or: [
              { title : {'contains' : req.param('name')}},
              { caption : {'contains' : req.param('name')}}
            ],
            isDeleted : false
        },
        limit : 5,
        sort : 'postedAt DESC'
        })
        return res.status(status.ok).json({
            List : findPost
        })
    },
    changeType : async (req,res) => {
        const user = req.userData.userId
        let accType
        const findUser = await Users.findOne({ id : user})
        if(!findUser) {
            return res.status(status.notFound).json({
                message : 'user not found'
            })
        }
        if(findUser.accType == 'PU'){
            accType = 'PR'
        } else {
            accType == 'PU'
        }
        await Users.update({ id : user}, { accType : accType})
        return res.status(status.ok).json({
            message : `Your account is ${accType}`
        })
    },
    resetPassword : async (req,res) => {
        let { email, new_pass } = req.body
        const findUser = await Users.findOne({ email : email, isDeleted : false})
        if(!findUser) {
            return res.status(status.notFound).json({
                message : 'email id is not found'
            })
        }
        new_pass = await bcrypt.compare(password,new_pass)
        const findPass = await Users.findOne({ email : email, password : new_pass})
        if(findPass) {
            return res.status(status.conflict).json({
                message : 'you enter your old password please enter another password'
            })
        }
        new_pass = await bcrypt.hash(new_pass, 10)
        await Users.update({email : email},{ password : new_pass})
        return res.status(status.ok).json({
            message : 'password updated'
        })

    }
};
