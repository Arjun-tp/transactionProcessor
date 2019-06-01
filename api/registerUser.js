const express = require("express");
const Userschema = require("../models/User");
const router = express.Router();

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    Userschema.findOne({
        email: req.body.email
    }).then(user => {
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
                description: req.body.lastName,
                password :req.body.password,
                email: req.body.email,
                location: req.body.location,
                phone: req.body.phone
            });

            newUser.save(function (err, user) {
                if (user) {
                    console.log("USer", JSON.stringify(user))
                return res.send({success : true, message: 'User Created Successfully',response : user})
                } else {
                    console.log(err)
                    res.send({
                        success: false,
                        message: 'Registration failed. Please try later!'
                    })
                }
            })
        }
    });
});






module.exports = router;