const express = require("express");
const Userschema = require("../models/User");
const router = express.Router();
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function generateJwt(userDetails) {
    const obj = {
        userId: userDetails._id,
        loginTime: new Date()
    };
    var token = jwt.sign(obj, "Tr@n$@ct!0N@Pp");
    userDetails.accessToken = token;
    // obj.accessToken = token;
    return userDetails;
}


const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if(req.method.toLowerCase() == "post" && (
        req.originalUrl == "/api/registerUser/register" || 
        req.originalUrl == "/api/registerUser/login" 
    )) {
        return next();
    }
    if(!token) {
        return res.status(403).json({
            success: false,
            message: "Token not found"
        });
    }
    jwt.verify(token, 'Tr@n$@ct!0N@Pp', function(err, decoded) {
        if(err || !decoded) {
            console.log("err: ", err);
            return res.status(403).json({
                success: false,
                message: "Failed to authenticate user"
            });
        }
        Userschema.findById(decoded.userId).select('name email').lean()
        .then((user) => {
            if(!user) {
                return res.status(403).json({
                    success: false,
                    message: "Unable to identify the user"
                });
            }
            // return resolve(user);
            return next();
        })
        .catch((err) => {
            console.log("Error: ", err);

            return res.status(403).json({
                success: false,
                message: "Problem in finding the user details"
            });
        });
    });
}
// @route POST api/registerUser/login
// @desc Register user
// @access Public
router.post("/register", async (req, res) => {
    try {
        const user = await Userschema.findOne({email: req.body.email}).lean().exec();

        if (user) {
            return res.send({
                success: false,
                message: "Email already exists."
            });
        } else {
            const newUser = new Userschema({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                gender: req.body.gender,
                dob: new Date(req.body.dob),
                description: req.body.description,
                password :req.body.password,
                email: req.body.email,
                location: req.body.location,
                phone: req.body.phone
            });
            const userResponse = await newUser.save();
            if (userResponse) {
                console.log("USer", JSON.stringify(userResponse))
                const authObj = generateJwt(userResponse);
                return res.send({
                    success : true, 
                    message: 'User Created Successfully',
                    response : authObj
                });
            } else {
                console.log(err)
                res.send({
                    success: false,
                    message: 'Registration failed. Please try later!'
                });
            }
        }
    } catch(err) {
        console.log("Error in register api call: ", err);
        return res.send({
            success: false,
            message: 'Registration failed. Please try later!'
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        if(req.body.email) {
            req.body.email = req.body.email.toLowerCase();
        }
        const user = await Userschema.findOne({email: req.body.email}).lean().exec();
        if(!user) {
            return res.status(403).json({
                success: false,
                message: "Wrong username or password"
            });
        }

        if(bcrypt.compareSync(req.body.password, user.password)) {
            // Passwords match
            const authObj = generateJwt(user);
            
            return res.status(200).json({
                success: true,
                message: 'Logged in successful',
                response : authObj
            });
        } else {
            // Passwords don't match
            return res.status(403).json({
                success: false,
                message: "Wrong username or password"
            });
        }
    } catch(err) {
        throw new Error("We are facing some problem in finding the user details");
    }
});






module.exports = router;
module.exports.authenticate = authenticate;