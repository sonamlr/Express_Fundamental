const userModel = require("../model/userSchema");
const emailValidator = require("email-validator");
const bcrypt = require('bcrypt');

const signup = async (req,res,next) => {
    
     
    try{
        const {name, email, password,confirmPassword} = req.body
    console.log(name, email, password, confirmPassword);
    if(!name || !email || !password || !confirmPassword){
        return res.status(400).json({
            success: false,
            message: "Every field is required"
        })
    }
    const validEmail = emailValidator.validate(email);
    if(!validEmail) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid email id'
        })
    }
    if(password !== confirmPassword){
        return res.status(400).json({
            success: false,
            message: "Password and confirm password does not match"
        })
    }
        const userInfo = userModel(req.body);
        const result = await userInfo.save();
        return res.status(200).json({
            success: true,
            data: result
    })
        
    }catch(error){
        if(error.code === 11000){
            return res.status(400).json({
                success: false,
                message: 'Account already exits with provided email id'
            })
        }
        //console.log(error);
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
    
}

const signin = async(req,res,next) => {
    const { email, password} = req.body;
    try {
    if(!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Every field is required"
        })
    }
    const user = await userModel.findOne({ email }).select('+password');
    if(!user || !(await bcrypt.compare(user.password, password))){
        return res.status(400).json({
            success: false,
            message: "invalid crediential"
        })
    }
    const token = user.jwtToken();
    user.password = undefined;

    const cookieOption = {
        maxAge: 24 * 60 * 60 *1000,
        httpOnly: true
    };
    res.cookie("token", token, cookieOption);
    res.status(200).json({
        success: true,
        data: user
    })
}catch(error){
    res.status(400).json({
        success: false,
        message: error.message       
    })
}
}

const getUser = async(req,res) => {
    const userId = req.user.id;

    try{
        const user = await userModel.findById(userId);
        return res.status(200).json({
            success: true,
            data: user
        });
    }catch(error){
        return res.status(200).json({
            success: false,
            message: error.message
        }) 
    }
}

const logout = async(req,res) => {
    try{
        const cookieOption = {
            expires: new Date(),
            httpOnly: true
        };
        res.cookie("token", null, cookieOption)
        res.status(200).json({
            success: true,
            message: "Logged Out"
        })
    }catch(error){
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {signup, signin, getUser, logout}