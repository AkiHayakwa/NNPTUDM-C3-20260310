let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "Username must be unique"],
        required: [true, "Username is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    email: {
        type: String,
        unique: [true, "Email must be unique"],
        required: [true, "Email is required"]
    },
    fullName: {
        type: String,
        default: ""
    },
    avatarUrl: {
        type: String,
        default: "https://i.sstatic.net/l60Hf.png"
    },
    status: {
        type: Boolean,
        default: false
    },
    role: {
        type: mongoose.Types.ObjectId,
        ref: 'Role'
    },
    loginCount: {
        type: Number,
        default: 0,
        min: [0, "loginCount must be greater than or equal to 0"]
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = new mongoose.model('User', userSchema);
