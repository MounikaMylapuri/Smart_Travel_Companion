const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChecklistTemplateSchema = new Schema({
  cityType: {
    type: String, // e.g., "urban", "tropical", "cold"
    required: true,
    index: true,
  },
  weatherCondition: {
    type: String, // e.g., "hot", "cold", "rainy"
    required: true,
  },
  items: [
    {
      name: String,
      category: String, // e.g., "clothing", "essentials", "gear"
      required: { type: Boolean, default: false },
    },
  ],
});

module.exports = mongoose.model("ChecklistTemplate", ChecklistTemplateSchema);
