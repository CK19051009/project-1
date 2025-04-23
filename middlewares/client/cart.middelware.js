const Cart = require("../../models/cart.model");
const Client = require("../../models/client.model");
const createNewCart = async (userId, res) => {
  data = {
    userId: userId,
    products: [],
  };
  const cart = new Cart(data);
  await cart.save();
  const dateCart = 1000 * 60 * 60 * 24 * 180 * 100;
  res.cookie("cart_id", cart.id, {
    expires: new Date(Date.now() + dateCart),
    httpOnly: false,
    secure: false, // Chỉ gửi cookie qua kết nối HTTPS
    sameSite: "lax", // Ngăn chặn gửi cookie qua trang khác,
    path: "/",
  });
  return cart;
};
module.exports.createCart = async (req, res, next) => {
  let cart;
  const token = req.cookies.token_user;
  if (token) {
    // console.log("đã cso cart");

    const client = await Client.findOne({ tokenClient: token });

    cart = await Cart.findOne({ userId: client.id });
    // trường hợp người dùng mới lập tài khoản và chưa có cartID
    if (!cart) {
      console.log("Tài khoản mới");
      cart = await createNewCart(client.id, res);
    }
    if (cart.products.length > 0) {
      cart.totalProduct = cart.products.reduce((sum, item) => {
        return sum + item.quantity;
      }, 0);
    } else {
      cart.totalProduct = 0;
    }
  }
  res.locals.cart = cart;
  res.locals.token = token;
  next();
};
