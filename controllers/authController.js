const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const { email, username, password } = req.body;
}

if (!email || !username || !password) {
    res.status(400). send("Please provide all fields.");
}

const userExists = await User.findOne({ email });
if (userExists) {
    return res.status(400).send("Email already exists.");
}

const hashedPassword = await bcrypt.hash(password);

const user = await User.create({ email, username, password: hashedPassword });

const token = jwt.sign({ id: user._id }, "123456789", { expiresIn: "1h"}); 


return res.status(201).json({ token });

const login = async (req, res) => {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send("Invalid Credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).send("Invalid Credentials");
    }
    
    const token = jwt.sign({ id: user._id }, "123456789", {expiresIn: "1h"});
    
    return res.status(200).json({ token }); 
};

const verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];
    console.log(token);

    if (!token) return res.status(401).json({ message: "Not Authorized" });

    token = token.split(" ")[1];

    try {
        let user = jwt.verify(token, "123456789");
        req.user = user.id;
        return next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token"});
    }

    next();
};

module.exports = {
    register,
    login,
    verifyToken,
};

