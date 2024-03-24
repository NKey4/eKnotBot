import mongoose from 'mongoose';

const statusSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
})

export default mongoose.model("Status", statusSchema)