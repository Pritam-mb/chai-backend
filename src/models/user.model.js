import mongoose,{Schema} from "mongoose";
import { use } from "react";
const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true  // for optimise searching techniqs
    }
    ,
     email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        // index: true  // for optimise searching techniqs
    },
     fullname:{
        type: String,
        required: true,
        // unique: true,
        // lowercase: true,
        trim: true,
        index: true  // for optimise searching techniqs
    },
    avater:{
        type: String,
        required: true
    },
    coverImage:{
        type: String,
        // required: true 
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: "Videos"
        }
    ],
    password:{
        type: String,
        required: [true, 'password is required']

    },
    refreshToken:{
        type: String
    }


},{
    timestamps:true
})

export const User = mongoose.model("User",userSchema)