require("dotenv").config();
const express = require("express");

const cors = require("cors");
const { dbConnection } = require("./database/config");
const app = express();

app.use(cors());

//public folder
app.use(express.static("public"));

//Db Connection
dbConnection();

//Reading and parse body
app.use(express.json());

//routes
app.use("/api/users", require("./routes/users.route"));
app.use("/api/hospitals", require("./routes/hospitals.route"));
app.use("/api/medics", require("./routes/medics.route"));
app.use("/api/all", require("./routes/search.route"));
app.use("/api/login", require("./routes/auth.route"));
app.use("/api/upload", require("./routes/uploads.route"));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port: ${process.env.PORT}`);
});
