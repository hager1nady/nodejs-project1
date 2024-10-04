

import  mongoose from "mongoose"
import { Schema,model} from "mongoose";
////////// create companySchema////////
const copmanySchema=new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        unique: true
      },
      description: {
        type: String,
        required: true
      },
      industry: {
        type: String,
        required: true
      },
      address: {
        type: String,
        required: true
      },
      numberOfEmployees: {
        type: String,
        required: true,
        enum: ['1-10', '11-20', '21-50', '51-100', '101-200', '201-500', '501-1000', '1000+']
      },
      companyEmail: {
        type: String,
        required: true,
        unique: true
      },
      companyHR: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
      }  
})

//////////////// create companykModel//////////////////////////////
const companyModel=mongoose.model("company",copmanySchema)

export default companyModel