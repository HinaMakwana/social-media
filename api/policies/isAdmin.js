const jwt = sails.config.custom.jwt
const {status} = sails.config.constant

module.exports =async (req,res,next) =>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        let admin = await Admin.findOne({id : decoded.adminId});
        if(token === admin.token) {
            req.adminData = decoded;
            return next();
        } else {
            res.status(status.unAuthorized).json({
                message: 'Token invalid'
            });
        }
    } catch(error) {
        return res.status(status.unAuthorized).json({
            message: 'Auth failed'
        });
    }
}
