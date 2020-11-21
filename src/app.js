const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config");
const { port } = config;

const app = express();

const userRoutes = require("./routes/user.router");
const authRoutes = require("./routes/auth.route");

app.use(bodyParser.json());
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );

app.get("/", (req, res) => {
  res.json("hello world");
});

app.use("/user", userRoutes);
app.use("/auth", authRoutes);

const DB = require("./db");

const startSever = async () => {
  app.listen(port, async () => {
    console.log(`QLBH API is running on port ${port} http://localhost:${port}`);
  });
};
startSever();

//Connect to Database
DB().then(() => {
  console.log("MongoDb connected");
});
