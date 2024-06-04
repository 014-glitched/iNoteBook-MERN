const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1/iNoteBook?directConnection=true&tls=false";

const connectToMongo = () => {
    mongoose.connect(mongoURI);
}

module.exports = connectToMongo;