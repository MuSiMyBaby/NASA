import mongoose from "mongoose";
const MONGO_URL = "mongodb+srv://NASA-API:CiNxwcJnG8YeOupF@cluster0.1sfdpwq.mongodb.net/?retryWrites=true&w=majority";
mongoose.connection.once("open", () => {
    console.log("MongoDB connection ready");
});
mongoose.connection.on("error", (err) => {
    console.error(err);
});
async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
}
export default mongoConnect;
