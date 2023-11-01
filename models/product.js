import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({
    owner_id: {
        type: String,
    },
    type:{
        type: String,
        required: true
    },
    name :{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    sizes:{
        type: Number,       
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    images:{
        type: [String],
        required: true
    },
    Style_tip:{
        type: String,
    },
    Address:{
        type: String,
        required: true
    },
    City:{
        type: String,
        required: true
    },
    Landmark:{
        type: String,
    },
    State:{
        type: String,
        required: true
    },
    Pincode: {
        type: Number,
        required: true
    },
    location: {
        type: {
          type: String, 
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    
},{timestamps: true})
productSchema.index({ location: "2dsphere" });
export default mongoose.model('Product',productSchema,'products');