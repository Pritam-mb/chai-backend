import mongoose,{Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber :{
        type: Schema.Types.ObjectId, // who is subscribing
        ref: "User",

    },
    channel:{
        type: Schema.Types.ObjectId, //owner of channel
        ref: "User",
    }
})

export const subscription = mongoose.model("subscription",subscriptionSchema)