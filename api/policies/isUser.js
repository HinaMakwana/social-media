const jwt = sails.config.custom.jwt
const {status} = sails.config.constant

module.exports =async (req,res,next) =>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        let user = await Users.findOne({id : decoded.userId, isDeleted : false});
        if(token === user.token) {
            req.userData = decoded;
            return next();
        } else {
            res.status(status.unAuthorized).json({
                message: 'Token invalid'
            });
        }
    } catch(error) {
        return res.status(status.unAuthorized).json({
            message: 'User is not authorized'
        });
    }
}
