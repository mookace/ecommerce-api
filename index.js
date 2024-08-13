const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
var fileUpload = require("express-fileupload");
global.appRoot = __dirname;

app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

dotenv.config();

mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.muabrik.mongodb.net/ecommerce?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api/products", productRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("connected to port 5000");
});
