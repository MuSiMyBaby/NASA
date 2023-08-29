import mongoose from "mongoose";
const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
    },
    launchDate: {
        type: Date,
        require: true,
    },
    mission: {
        type: String,
        require: true,
    },
    rocket: {
        type: String,
        require: true,
    },
    target: {
        // type: mongoose.ObjectId  //it's the SQL's stuff.
        type: String,
        ref: "Planet",
    },
    upcoming: {
        type: Boolean,
        require: true,
    },
    success: {
        type: Boolean,
        require: true,
        default: true,
    },
    customers: {
        type: [String],
        require: true,
    },
});
export default mongoose.model("Launch", launchesSchema);
