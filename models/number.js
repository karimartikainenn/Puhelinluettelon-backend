const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connection to url", url);
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error.message);
  });

const numberSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(v) {
        const parts = v.split('-');
        if (parts.length !== 2) {
          return false;
        }

        if (!/^\d{2,3}$/.test(parts[0])) {
          return false;
        }

        if (!/^\d+$/.test(parts[1])) {
          return false;
        }

        return true;
      },
      message: props => `${props.value} ei ole kelvollinen puhelinnumero!`
    },
    required: [true, 'Puhelinnumero vaaditaan']
  }
});

numberSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    return returnedObject;
  },
});

const Number = mongoose.model("Number", numberSchema);

module.exports = Number;
