const Chat = require("../../models/chat.model");
const Client = require("../../models/client.model");
// [GET] /chat
module.exports.index = async (req, res) => {
  const client = res.locals.client;
  _io.once("connection", (socket) => {
    // console.log("✅ Kết nối thành công với server!");
    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      const dataChat = new Chat({
        userId: client.id,
        content: content,
      });
      await dataChat.save();
      data = {
        userId: client.id,
        fullname: client.fullname,
        content: dataChat,
      };
      _io.emit("SERVER_RETURN_MESSAGE", data);
    });
  });

  const chats = await Chat.find({ deleted: false });
  for (const chat of chats) {
    const client = await Client.findOne({
      deleted: false,
      _id: chat.userId,
    }).select("fullname");
    chat.fullname = client.fullname;
  }
  res.render("./client/pages/chat/index.pug", {
    pageTitle: "Trò chuyện",
    chats: chats,
    breadCrumb: [
      {
        title: "Trang chủ",
        href: "/",
      },
      {
        title: "Trò chuyện",
        href: "#",
      },
    ],
  });
};
