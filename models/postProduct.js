var mongoose = require('mongoose');
var config = require('../config/config');


var postProduct = new mongoose.Schema({
  user_Id: { type: String },
  profileId: { type: String },
  shopId: { type: String },
  shopName: { type: String },
  product: { type: String },
  categories: { type: Array },
  sizes: { type: Array },
  quantity: { type: Number },
  price: { type: Object },
  salePrice: { type: Object },
  materialType: { type: String },
  description: { type: String },
  color: { type: Array },
  images: { type: Array },
  productSKU: { type: String },
  date:{type:String},
  time:{type:String},

});

mongoose.model('postProduct', postProduct);
