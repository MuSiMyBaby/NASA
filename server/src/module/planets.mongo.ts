import mongoose from "mongoose";

const planetSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    require: true,
  },
});

//nodeJs -> Mongoose(middleWare)[model -> Schema]-> MongoDB(collections->documents)
const planets = mongoose.model("Planet", planetSchema);

export default planets;
