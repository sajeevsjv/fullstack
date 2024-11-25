const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const mongoConnect = require('./db/connect');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const https = require("https");
const fs = require("fs");
const path = require("path");

app.use(cors()); // Enable CORS for all routes
app.get('/test', (req, res) => {
    res.status(200).send("Test successful");
});

//Serving static files
// app.use(express.static( "../client"));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/upload",express.static("./upload"));

//Database connection
mongoConnect();

//Parse JSON Datas
app.use(express.json({ limit: "100mb" }));

//Parse form datas
app.use(express.urlencoded({extended : true}));

//userRoutes
app.use(userRoutes);

//authRoutes
app.use(authRoutes);



// app.listen(process.env.PORT, () => {
//     console.log(`Server running at http://localhost:${process.env.PORT}`);
// });

https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
  }, app).listen(process.env.PORT, () => {
    console.log(`listening on port https://localhost:${process.env.PORT}`);
  });