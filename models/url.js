const mongoose = require("mongoose");

const urlSchema = mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true
    },
    redirectUrl: {
        type: String,
        required: true,
        unique: true
    },

    visitHistory: [{ timestamp: {type: Number} }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
}, { timestamp: true }
);

const URL = mongoose.model("url", urlSchema);

module.exports = URL;