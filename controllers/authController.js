const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    
    const foundUser = await User.findOne({username: user}).exec();
    if (!foundUser){
        console.log("401: authController1");
        return res.sendStatus(401); //Unauthorized 
    }
    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        // create JWTs
        const accessToken = jwt.sign(
            { "username": foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();

        var IdUser = foundUser._id;
        var roles = foundUser.roles;
        var email = foundUser.email;
        console.log(result); //DEV    

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true,  maxAge: 24 * 60 * 60 * 1000 });
        res.json({ 
            accessToken , 
            user,
            IdUser, 
            roles, 
            email
        });
    } else {
        console.log("401: authController2");
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };

//res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });