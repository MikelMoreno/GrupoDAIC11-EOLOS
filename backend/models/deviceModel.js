const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    identifier: String,
    public_url: String,
    room: {
        name: String,
        description: String,
        volume: Number
    },
    grafana_panels: [ String ]
});

const Device = mongoose.model("Device", deviceSchema);

module.exports.Device = Device;
module.exports.DeviceSchema = deviceSchema;