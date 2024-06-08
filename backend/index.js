const connectToMongo = require('./db');
const express = require('express')

connectToMongo();

const app = express()
const port = 5000

app.use(express.json()); //The express.json() function is a built-in middleware function in Express. It parses incoming requests with JSON
//If we want to use request method then we need to use this command then we can deal with json data.

//Available routes
app.use('/api/auth', require('./routes/auth'));   //app.use(path, callback);
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`iNoteBook backend listening on port ${port}`)
})

