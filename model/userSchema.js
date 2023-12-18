const mongoose = require('mongoose');
const { Schema } = mongoose;
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    name:{
        type: String,
        required: [true, 'username is required'],
        minlength: [2, 'name must be atleast 2 char'],
        maxlenght: [20, 'namevmust be less then char'],
        trim: true
    },
    email:{
        type: String,
        required: [true,'user email is required'],
        unique: [true, 'already exits'],
        lowercase: true,

    },
    password:{
        type: String,
        select: false
    },
    forgotPasswordToken:{
        type: String
    },
    forPasswordExpireDate:{
        type: Date
    }
},{
        timestamps: true
    
});
userSchema.pre('save', async function(next) {
    if(!this.markModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    return next();
})
userSchema.methods = {
    jwtToken(){
        return JWT.sign(
            {id:this._id, email:this.email},
            process.env.SECRET,
            {expiresIn: '24h'}
        )
    }
}

const userModel = mongoose.model('user',userSchema);
module.exports = userModel;



