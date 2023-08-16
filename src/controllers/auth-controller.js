const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const {
    registerValidation,
    loginValidation,
} = require("../middlewares/validation");

const signup = async (req, res) => {
    const { error } = registerValidation(req.body);

    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    // check if username already exists
    const usernameExists = await User.findOne({ username: req.body.username })
    if (usernameExists) {
        return res.status(400).send({ message: "User with that username already exists" });
    }

     // check if email already exists
     const emailExists = await User.findOne({ email: req.body.email })
     if (emailExists) {
         return res.status(400).send({ message: "User with that email already exists" });
     }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const user = new User({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
    });

    try {
        const savedUser = await user.save();
        res.status(201).send({
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email
        });
    } catch (err) {
        res.status(400).send(err);
    }
}

const signin = async (req, res) => {
    const { error } = loginValidation(req.body);

    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    // Checking if the email or password is correct
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send({ message: "Email or password is wrong" });
    }
    // Checking if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
        return res.status(400).send({ message: "Email or password is wrong" });
    }

    //   Create and assign a token for authorization
    const token = jwt.sign({ _id: user._id }, process.env.ACCESS_KEY, {
        expiresIn: "30m",
        algorithm: "HS256",
    });
    res.header("Authorization", token).send({ token: token, id: user._id, username: user.username, email: user.email });
}

module.exports = {
    signup,
    signin
};