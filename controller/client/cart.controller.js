const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const priceHelper = require("../../helpers/price.helper");
const Order = require("../../models/order.model");
const momoHelper = require("../../helpers/payment/momo.helper");
// ham tinh gia cho 1 don hang
const allPriceOreder = (array) => {
  const totalPrice = array.reduce((sum, item) => {
    const sumOnePrice =
      item.price - item.price * (item.discountPersent / 100) * item.quantity;

    return sum + sumOnePrice;
  }, 0);

  return totalPrice;
};
// het ham tinh gia cho 1 don hang
// [GET] /cart
module.exports.index = async (req, res) => {
  const productCart = res.locals.cart;
  for (const item of productCart.products) {
    const idProduct = item.product_id;
    const product = await Product.findOne({ _id: idProduct, deleted: false });
    // console.log("gia san pham", product);
    const productNew = priceHelper.priceItem(product);

    item.newPrice = productNew.newPrice;
    item.price = productNew.price;
    item.discountPersent = productNew.discountPersent;
    item.thumbnail = productNew.thumbnail;
    item.title = productNew.title;
    item.totalPrice = productNew.newPrice * item.quantity;
    item.slug = productNew.slug;
  }
  res.render("./client/pages/cart/index.pug", {
    pageTitle: "Giỏ hàng",
    productCarts: productCart,
  });
};

// [POST] /cart/add/:productId
module.exports.addProduct = async (req, res) => {
  const id = req.params.productId;
  const quantity = req.body.quantity;
  // console.log(res.locals.cart);
  const cart = res.locals.cart;
  const checkCart = cart.products.find((item) => item.product_id === id);

  if (checkCart) {
    await Cart.updateOne(
      { _id: cart.id, "products.product_id": id },
      {
        $set: {
          "products.$.quantity": checkCart.quantity + parseInt(quantity),
        },
      }
    );
  } else {
    const productQuantity = {
      product_id: id,
      quantity: quantity,
    };
    await Cart.updateOne(
      { _id: cart.id },
      {
        $push: { products: productQuantity },
      }
    );
  }
  req.flash("sucess", "Thêm sản phẩm vào giỏ hàng thành công!");
  res.redirect("back");
};

//[GET] /cart/delete/:productId

module.exports.deleteProduct = async (req, res) => {
  const productId = req.params.productId;
  const cart = res.locals.cart;
  await Cart.updateOne(
    { _id: cart.id },
    {
      $pull: {
        products: { product_id: productId },
      },
    }
  );
  req.flash("sucess", "Đã xóa sản phẩm!");
  res.redirect("back");
};

//[POST] /cart/change/:productId
module.exports.changeProduct = async (req, res) => {
  const productId = req.params.productId;
  const newQuantity = parseInt(req.body.quantity);
  const cart = res.locals.cart;
  await Cart.updateOne(
    { _id: cart.id, "products.product_id": productId },
    {
      $set: { "products.$.quantity": newQuantity },
    }
  );
  req.flash("sucess", "Cập nhập thành công!");
  res.redirect("back");
};

//[POST] /cart/checkout
module.exports.checkout = async (req, res) => {
  const ids = req.body.ids.split(", ");
  // const cartId = req.cookies.cart_id;

  if (ids[1] == "buynow") {
    const cart = res.locals.cart;
    ids.splice(1, 1);
    const [id] = ids;
    const checkCart = cart.products.find((item) => item.product_id === id);

    if (checkCart) {
      await Cart.updateOne(
        { _id: cart.id, "products.product_id": id },
        {
          $set: {
            "products.$.quantity": parseInt(req.body.quantity),
          },
        }
      );
    } else {
      const data = {
        product_id: id,
        quantity: parseInt(req.body.quantity),
      };

      await Cart.updateOne(
        { _id: cart.id },
        {
          $push: { products: data },
        }
      );
    }
    const updatedCart = await Cart.findOne({ _id: cart.id });
    res.locals.cart = updatedCart; // Cập nhật lại cart
  }
  // console.log("xong su kien buy now 1 ");

  const cart = res.locals.cart;
  let cartCheckOut = [];
  for (const item of ids) {
    const productInfo = await Product.findOne({ _id: item, deleted: false });
    // console.log(productInfo);
    const productNew = priceHelper.priceItem(productInfo);

    cart.products.forEach((product) => {
      if (item === product.product_id) {
        product.newPrice = productNew.newPrice;
        product.price = productNew.price;
        product.discountPersent = productNew.discountPersent;
        product.thumbnail = productNew.thumbnail;
        product.title = productNew.title;
        product.totalPrice = productNew.newPrice * product.quantity;

        cartCheckOut.push(product);
      }
    });
  }
  const allPricePay = cartCheckOut.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );
  const allPriceDiscount = cartCheckOut.reduce((sum, item) => {
    return sum + item.price * (item.discountPersent / 100) * item.quantity;
  }, 0);

  res.render("./client/pages/cart/checkout.pug", {
    pageTitle: "CheckOut",
    title: "Thanh toán",
    cartCheckOut: cartCheckOut,
    allPricePay: allPricePay,
    allPriceDiscount: allPriceDiscount,
  });
};

// [POST] / cart/checkout/order;
module.exports.postOrder = async (req, res) => {
  const cart = res.locals.cart;
  let ids = [];
  const productOrderSuccess = JSON.parse(req.body.idsOrder);
  for (const item of productOrderSuccess) {
    ids.push(item.product_id);
    const product = await Product.findOne({
      deleted: false,
      _id: item.product_id,
    }).select("-description -editBy");
    item.price = product.price;
    item.discountPersent = product.discountPersent;
  }
  const orderSuccess = {
    cart_id: cart.id,
    user_id: res.locals.client.id,
    userInfo: {
      fullname: req.body.fullname,
      phone: req.body.phone,
      address: req.body.address,
    },
    products: productOrderSuccess,
    payMent: req.body.payment,
    delivery: req.body.delivery,
  };

  // kiểm tra phường thức thanh toán
  const payMent = req.body.payment;
  switch (payMent) {
    case "payMomo": {
      const totalPrice = allPriceOreder(productOrderSuccess);
      const orderProduct = new Order(orderSuccess);
      await orderProduct.save();
      const momo = await momoHelper.momoPaymentApi(
        totalPrice + 25000,
        `${orderProduct.id}`,
        "https://68c4-2405-4803-f805-a300-ec5f-b8c9-62fd-fc6e.ngrok-free.app/api/v1/client/momo-callback"
      );
      await Order.updateOne(
        { _id: orderProduct.id },
        { status: "pending", statusPayment: "pending", payMent: payMent }
      );
      // console.log(momo);
      await Cart.updateOne(
        { _id: cart.id },
        {
          $pull: { products: { product_id: { $in: ids } } },
        }
      );

      return res.redirect(momo.payUrl);
    }
    case "payZalo":
      break;
    case "payCash": {
      const orderProduct = new Order(orderSuccess);
      await orderProduct.save();
      await Cart.updateOne(
        { _id: cart.id },
        {
          $pull: { products: { product_id: { $in: ids } } },
        }
      );
      await Order.updateOne(
        { _id: orderProduct.id },
        {
          status: "pending",
          statusPayment: "pending",
          payMent: payMent,
        }
      );

      await res.redirect(`/cart/checkout/success/${orderProduct.id}`);
      break;
    }
    default:
      break;
  }
};

// [GET] /cart/checkout/success/:successId;
module.exports.orderSuccess = async (req, res) => {
  const id = req.params.successId;
  const order = await Order.findOne({ deleted: false, _id: id });
  const productOrderNew = priceHelper.priceList(order.products);
  const total = productOrderNew.reduce(
    (sum, item) => sum + item.newPrice * item.quantity,
    0
  );
  order.totalPrice = total + 25000;
  // console.log(order.totalPrice);
  res.render("./client/pages/cart/orderSuccess.pug", {
    pageTitle: "Đặt hàng thành công",
    orderSuccess: order,
  });
};
//[POST] /api/v1/client/momo-callback
module.exports.momoCallBack = async (req, res) => {
  try {
    const { orderId, resultCode } = req.body;
    // console.log(req.body);
    // console.log(orderId);
    // console.log(resultCode);
    if (resultCode === 0) {
      // Thanh toán thành công
      await Order.updateOne(
        { _id: orderId },
        { status: "pending", statusPayment: "success" }
      );

      return res.status(200).json({
        message: "Thanh toán thành công!",
        code: 200,
      });
    } else {
      // Thanh toán thất bại
      await Order.updateOne(
        { _id: orderId },
        { status: "pending", statusPayment: "failed" }
      );

      return res.status(400).json({
        message: "Thanh toán thất bại!",
        code: 400,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi trong quá trình xử lý callback từ Momo!",
      code: 500,
      error: error.message,
    });
  }
};
