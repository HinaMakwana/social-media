/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const id = sails.config.custom.uuid;
const bcrypt = sails.config.custom.bcrypt;
const jwt = sails.config.custom.jwt;
const {status,UserStatus,accType} = sails.config.constant;

module.exports = {

    signUp : async (req,res) => {
        try {
            let {
                username,
                name,
                email,
                password
            } = req.body;
            let fileUpload = await sails.helpers.uploadImage(req,'image',`profile/${username}`)
            if(fileUpload !== null){
                if (fileUpload.type.includes('image/')) {
                    fileUpload = fileUpload.fd;
                } else {
                    return res.status(status.unAuthorized).json({
                        message : 'you can upload images only'
                    })
                }
            }
            password = await bcrypt.hash(password, 10);

            const findUser = await Users.findOne({
                email : email,
                status : UserStatus.A,
                isDeleted : false
            })
            const findUsername = await Users.findOne({
                username : username,
                status : UserStatus.A,
                isDeleted : false
            })
            if(findUser || findUsername) {
                return res.status(status.conflict).json({
                    message : 'please enter unique value'
                })
            }

            const data = {
                id : id(),
                username : username,
                name : name,
                email : email,
                password : password,
                profile_photo : fileUpload
            }
            const createUser = await Users.create(data).fetch()
            res.status(status.ok).json({
                data : createUser
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
                username,
                password
            } = req.body;
            const findUser = await Users.findOne({
                username : username,
                status : UserStatus.A,
                isDeleted : false
            })
            if(!findUser){
                return res.status(status.notFound).json({
                    message : 'user not found'
                })
            }
            let comparePass = await bcrypt.compare(password,findUser.password);
            if(!comparePass) {
                return res.status(status.badRequest).json({
                    message: 'Invalid Email or Password'
                })
            }
            const token = jwt.sign(
                {
                email: findUser.email,
                username : findUser.username,
                id: findUser.id
                },
                process.env.JWT_KEY,
                {
                    expiresIn : "8h"
                }
            )
            await Users.updateOne({username : username},{token : token})
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
            const user = req.userData.id;
            const findUser = await Users.findOne({
                id : user,
                status : UserStatus.A,
                isDeleted : false
            })
            if(!findUser){
                return res.status(status.notFound).json({
                    message : 'user not found'
                })
            }
            await Users.updateOne({ id : user},{token : null})
            return res.status(status.ok).json({
                message : 'logout successfully'
            })
        } catch (error) {
            return res.status(status.serverError).json({
                message: 'server error ' + error
            })
        }
    },
    // listAll : async (req,res) => {
    //     try {
    //         const findUsers = await Users.find({
    //             status : UserStatus.A,
    //             isDeleted : false
    //         }).omit(['token','password'])
    //         return res.status(status.ok).json({
    //             Users : findUsers
    //         })
    //     } catch (error) {
    //         return res.status(status.serverError).json({
    //             message: 'server error ' + error
    //         })
    //     }
    // },
    listOne : async (req,res) => {
        try {
            const user = req.userData.id;
            const { id } = req.body;
            const findUser = await Users.findOne({
                id : user ,
                status : UserStatus.A,
                isDeleted : false
            })
            if(!findUser) {
                return res.status(status.notFound).json({
                    message : 'user not found'
                })
            }
            const userOne = await Users.findOne({
                id : id,
                status : UserStatus.A
            })
            .omit(['password','token','status'])
            if(!userOne) {
                return res.status(status.notFound).json({
                    message : 'user not found'
                })
            }
            let findPost;
            if(userOne.accType == accType.PU){
                findPost = await Post.find({
                    postedBy : id,
                    isDeleted : false
                })
            } else {
                const findFollow = await Follow.find({
                    user : user,
                    follow : id
                })
                if(findFollow){
                    return res.status(status.unAuthorized).json({
                        message : 'user account is private'
                    })
                } else {
                    findPost = await Post.find({
                        postedBy : id,
                        isDeleted : false
                    })
                }
            }
            return res.status(status.ok).json({
                user : userOne,
                post : findPost
            })
        } catch (error) {
            return res.status(status.serverError).json({
                message: 'server error ' + error
            })
        }
    },
    searchUser : async (req,res) => {
        try {
            const findUser = await Users.find({
                where: {
                    username: {'contains' : req.param('name')},
                    isDeleted : false
                },
                limit : 5,
                select : [
                    'id',
                    'username',
                    'name',
                    'profile_photo'
                ]
            })
            return res.status(status.ok).json({
                List : findUser
            })
        } catch (error) {
            return res.status(status.serverError).json({
                message: 'server error ' + error
            })
        }
    },
    searchPost : async (req,res) => {
        try {
            const findPost = await Post.find({
                where: {
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
        } catch (error) {
            return res.status(status.serverError).json({
                message: 'server error ' + error
            })
        }
    },
    changeType : async (req,res) => {
        try {
            const user = req.userData.id;
            let type;
            const findUser = await Users.findOne({
                id : user,
                isDeleted : false
            })
            if(!findUser) {
                return res.status(status.notFound).json({
                    message : 'user not found'
                })
            }
            console.log(findUser);
            if(findUser.accType === accType.PU){
                type = accType.PR;
            } else {
                console.log(accType.PU);
                type = accType.PU;
            }
            await Users.updateOne({ id : user}, { accType : type})
            return res.status(status.ok).json({
                message : `Your account is ${type}`
            })
        } catch (error) {
            return res.status(status.serverError).json({
                message: 'server error ' + error
            })
        }
    },
    resetPassword : async (req,res) => {
        try {
            let { email, new_pass } = req.body;
            const findUser = await Users.findOne({
                email : email,
                isDeleted : false
            })
            if(!findUser) {
                return res.status(status.notFound).json({
                    message : 'email id is not found'
                })
            }

            let comparePass = await bcrypt.compare(findUser.password,new_pass);
            if(comparePass) {
                return res.status(status.conflict).json({
                    message : 'you enter your old password please enter another password'
                })
            }
            // const findPass = await Users.findOne({
            //     email : email,
            //     password : new_pass,
            //     isDeleted : false
            // })
            
            new_pass = await bcrypt.hash(new_pass, 10)
            await Users.updateOne({email : email},{ password : new_pass})
            return res.status(status.ok).json({
                message : 'password updated'
            })
        } catch (error) {
            return res.status(status.serverError).json({
                message: 'server error ' + error
            })
        }
    }
};
