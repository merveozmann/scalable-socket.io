const User = require("../model/userModel")
const brcypt = require("bcrypt")

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password ,langue,country} = req.body;

        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.json({ msg: "Email already used", status: false });
        }
        const hashedPassword = await brcypt.hash(password, 10);
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
            langue:langue,
            country:country
        });
        delete user.password;
        return res.json({ status: true, user })
    } catch (error) {
        next(error);
    }
}
module.exports.login = async (req, res, next) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ msg: "Incorrect email", status: false });
        }
        const isPasswordValid = await brcypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.json({ msg: "Incorrect password", status: false });
        }
        delete user.password;
        
        return res.json({ status: true, user })
    } catch (error) {
        next(error);
    }
}
module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({_id:{$ne:req.params.id}}).select([
            "email","username","langue","country"
        ]);
        return res.json(users)
    } catch (error) {
        next(error)
    }

    
}
module.exports.getUserDetail = async (req, res, next) => {
    try {
        const users = await User.findById(req.params.id)
        return res.json(users)
    } catch (error) {
        next(error)
    }
}