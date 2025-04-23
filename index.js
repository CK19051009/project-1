const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const moment = require("moment");
const flash = require("express-flash");
const dataBase = require("./config/database.config");
const systemConfig = require("./config/system.config");

require("dotenv").config();

dataBase.connect();
const routerAdmin = require("./router/admin/index");
const routerClient = require("./router/client/index");
const app = express();
const port = process.env.PORT;
// SocketIo
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
global._io = io;
// End SocketIo
app.use(cookieParser("dsfsfdsfewetewf3r23r23rewfewf"));
app.use(
  session({
    secret: "your_secret_key", // Khóa bí mật để mã hóa session
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);
app.use(flash());
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.locals.urlAdmin = systemConfig.pathglobal; // Tại biến admin dung cho file pug
app.locals.moment = moment;
app.use(methodOverride("_method"));
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// tiny mce
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);
//ebd tiny mce

app.use(express.static(path.join(__dirname, "public")));
// router
routerAdmin(app);
routerClient(app);

server.listen(
  port,
  console.log(`Example app listening on port ${port} http://localhost:${port}`)
);
