const Client = require("../../models/client.model");
const Cart = require("../../models/cart.model");
module.exports.authMiddleware = async (req, res, next) => {
  const token = req.cookies.token_user;
  const client = await Client.findOne({ tokenClient: token });
  if (!client) {
    res.redirect("/");
    return;
  }
  let cart;
  // NGƯỜI DÙNG VỪA MỚI LẬP TÀI KHOẢN
  cart = await Cart.findOne({ userId: client.id });
  // trường hợp người dùng mới lập tài khoản và chưa có cartID

  // trường hợp người dùng đã lập tài khoản nhưng đăng xuất ra lúc này sẽ lấy cartId lưu ra thêm vào cookies
  if (cart) {
    const dateCart = 1000 * 60 * 60 * 24 * 180 * 100;
    res.cookie("cart_id", cart.id, {
      expires: new Date(Date.now() + dateCart),
      httpOnly: false,
      secure: false, // Chỉ gửi cookie qua kết nối HTTPS
      sameSite: "lax", // Ngăn chặn gửi cookie qua trang khác,
      path: "/",
    });
    if (cart.products.length > 0) {
      cart.totalProduct = cart.products.reduce((sum, item) => {
        return sum + item.quantity;
      }, 0);
    } else {
      cart.totalProduct = 0;
    }
  }
  res.locals.client = client;
  res.locals.cart = cart;
  next();
};
