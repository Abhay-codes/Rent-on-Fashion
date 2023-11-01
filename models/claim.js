import mongoose from "mongoose";
const Schema = mongoose.Schema;

const claimSchema = new Schema({
    owner_id:{
        type: String,
        required: true
    },
    product_id:{
        type: String,
        required: true
    },
    request_person_id:{
        type: String,
        required: true
    },
    from:{
        type: Number,
        required: true
    },
    to:{
        type: Number,
        required: true
    },
    status:{
        type: Number,
        default: 0
    }
},{timestamps: true})
export default mongoose.model('Claim',claimSchema,'claims');