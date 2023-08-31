const status = {
    ok : 200,
    created : 201,
    accepted : 202,
    badRequest : 400,
    unAuthorized : 401,
    notFound : 404,
    conflict : 409,
    serverError : 500
}

const UserStatus = {
    A : "A",
    I : "I"
}

const accType = {
    PR : "PR",
    PU : "PU"
}

module.exports.constant = {
    status,
    UserStatus,
    accType
}