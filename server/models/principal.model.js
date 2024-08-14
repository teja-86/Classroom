import mongoose from "mongoose";

const PrincipalSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const Principal = mongoose.model("Principal", PrincipalSchema);

export default Principal;