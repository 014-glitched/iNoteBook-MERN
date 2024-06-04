const jwt = require('jsonwebtoken');
const JWT_Secret = "AbhyudaiSrivastava##Footballer";

const fetchUser = (req, res, next) => {
    //Get the user from the jwt token and add it to the req object
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).send({error: "Please authenticate using a valid token"});
    }
    try {
        const data = jwt.verify(token, JWT_Secret);
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).send({error: "Please authenticate using a valid token"});
    }
   
}

module.exports = fetchUser;