var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();

// Connection to MONGODB
mongoose.connect('mongodb://localhost:27017/onlineStore', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection failed:"));
db.once("open", function () {
  console.log("connection successful");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Order
var orderSchema = new mongoose.Schema({
  name: String,
  address: String,
  city: String,
  phone: Number,
  email: String,
  province: String,
  postal: String,
  product1: Number,
  product2: Number,
  total: Number,
});
var Order = mongoose.model("Order", orderSchema);

// Displaying the form
app.get("/", function (req, res) {
  res.render("form");
});

// Preoccessing the form
app.post("/", function (req, res) {
  var name = req.body.name;
  var address = req.body.address;
  var city = req.body.city;
  var phone = req.body.phone;
  var email = req.body.email;
  var province = req.body.province;
  var postal = req.body.postal;
  var product1 = parseInt(req.body.product1);
  var product2 = parseInt(req.body.product2);

  // Calculation
  var price1 = 6.99;
  var price2 = 9.99;
  var total1 = price1 * product1;
  var total2 = price2 * product2;
  var total = total1 + total2;

  // Saving data to the mongoDb database
  var order = new Order({
    name: name,
    address: address,
    city: city,
    phone: phone,
    email: email,
    province: province,
    postal: postal,
    product1: product1,
    product2: product2,
    total: total,
  });
  order
    .save()
    .then(function (order) {
      console.log(order);
    })
    .catch(function (err) {
      console.error(err);
    });

  // Receipt
  res.render("receipt", {
    name: name,
    address: address,
    city: city,
    phone: phone,
    email: email,
    province: province,
    postal: postal,
    product1: product1,
    product2: product2,
    price1: price1,
    price2: price2,
    total1: total1,
    total2: total2,
    total: total,
  });
});

app.get("/orders", function (req, res) {
  Order.find(function (err, orders) {
    if (err) return console.error(err);
    console.log(orders);
    res.render("orders", { orders: orders });
  });
});

// Server
app.listen(3000, function () {
  console.log("Server started on port http://localhost:3000");
});
