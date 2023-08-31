const jwt = sails.config.custom.jwt;
const {status} = sails.config.constant;

module.exports =async (req,res,next) =>{
    try {
			let val;
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        val = await Users.findOne({
					id : decoded.id,
					isDeleted : false
				});
				if(!val) {
					val = await Admin.findOne({
						id: decoded.id,
						isDeleted : false
					})
				}
        if(token === val.token) {
            req.data = decoded;
            return next();
        } else {
            res.status(status.unAuthorized).json({
                message: 'Token invalid'
            });
        }
    } catch(error) {
        return res.status(status.unAuthorized).json({
            message: 'error '+ error
        });
    }
}
