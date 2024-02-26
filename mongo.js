const mongoose = require("mongoose");

if (process.argv.length > 5) {
    console.log("give only password as argument");
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstackopen:${password}@cluster0.16v1pdt.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const numberSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Number = mongoose.model("Number", numberSchema);

if (process.argv.length === 3) {
    Number.find({}).then(result => {
        console.log("phonebook:");
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`);
            mongoose.connection.close();
        });
        
    });
} else if (process.argv.length === 5) {
    const name = process.argv[3];
    const number = process.argv[4];

    const entry = new Number({
        name: name,
        number: number,
    });

    entry.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    });
} else {
    console.log("Invalid number of arguments.");
    process.exit(1);
}
