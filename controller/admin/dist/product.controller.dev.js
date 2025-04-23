"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var createTreeHelper = require("../../helpers/create.tree.helper");

var ProductCategory = require("../../models/product.category");

var Product = require("../../models/product.model");

var systemConfig = require("../../config/system.config");

var buttonStatusHelper = require("../../helpers/button.status.helper");

var paginationHelper = require("../../helpers/pagination.helper"); // [GET] /admin/products


module.exports.index = function _callee(req, res) {
  var user, permissions, find, buttons, keyword, sort, objectpagination, countProducts, pagination, allProduct;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          user = res.locals.user;
          permissions = res.locals.role.permissions;

          if (!(user && permissions.includes("product_view"))) {
            _context.next = 20;
            break;
          }

          find = {
            deleted: false
          }; // button status

          if (req.query.status) {
            find.status = req.query.status;
          }

          buttons = buttonStatusHelper.buttonStatus(req.query); // end button status
          // search

          if (req.query.keyword) {
            keyword = new RegExp(req.query.keyword, "i");
            find.title = keyword;
          } // end search
          // sort


          sort = {};

          if (req.query.sortkey && req.query.sortvalue) {
            sort[req.query.sortkey] = req.query.sortvalue;
          } else {
            sort.position = "asc";
          } // end sort
          // pagination


          objectpagination = {
            limit: 4,
            currentPage: 1
          };
          _context.next = 12;
          return regeneratorRuntime.awrap(Product.countDocuments());

        case 12:
          countProducts = _context.sent;
          pagination = paginationHelper.pagination(objectpagination, req.query, countProducts); // end pagination

          _context.next = 16;
          return regeneratorRuntime.awrap(Product.find(find).limit(pagination.limit).skip(pagination.skip).sort(sort));

        case 16:
          allProduct = _context.sent;
          res.render("./admin/pages/product/index", {
            pageTitle: "Sản phẩm",
            products: allProduct,
            buttonStatus: buttons,
            keyword: req.query.keyword,
            pagination: pagination
          });
          _context.next = 22;
          break;

        case 20:
          res.status(400).send("loi");
          return _context.abrupt("return");

        case 22:
        case "end":
          return _context.stop();
      }
    }
  });
}; // [GET] /admin/products/create


module.exports.getCreateProduct = function _callee2(req, res) {
  var user, permissions, categorys, newCategorys;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          user = res.locals.user;
          permissions = res.locals.role.permissions;

          if (!(user && permissions.includes("product_create"))) {
            _context2.next = 10;
            break;
          }

          _context2.next = 5;
          return regeneratorRuntime.awrap(ProductCategory.find({
            deleted: false
          }));

        case 5:
          categorys = _context2.sent;
          newCategorys = createTreeHelper.createTree(categorys);
          res.render("./admin/pages/product/create", {
            pageTitle: "Tạo Sản phẩm Mới",
            newCategorys: newCategorys
          });
          _context2.next = 12;
          break;

        case 10:
          res.status(400).send("loi");
          return _context2.abrupt("return");

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  });
}; // [POST] /admin/products/create


module.exports.postCreateProduct = function _callee3(req, res) {
  var user, permissions, allProduct, createdBy, newProduct;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          user = res.locals.user;
          permissions = res.locals.role.permissions;

          if (!(user && permissions.includes("product_create"))) {
            _context3.next = 18;
            break;
          }

          _context3.next = 5;
          return regeneratorRuntime.awrap(Product.countDocuments());

        case 5:
          allProduct = _context3.sent;

          if (req.body.position === "") {
            req.body.position = allProduct + 1;
          } else {
            req.body.position = parseInt(req.body.position);
          }

          if (req.body.thumbnail) {
            req.body.thumbnail = req.body.thumbnail[0];
          }

          req.body.price = parseInt(req.body.price);

          if (req.body.discountPersent !== "") {
            req.body.discountPersent = parseInt(req.body.discountPersent);
          } else {
            req.body.discountPersent = 0;
          }

          createdBy = {
            account_id: res.locals.user.id,
            fullName: res.locals.user.fullname,
            createdAt: Date.now()
          };
          newProduct = new Product(_objectSpread({}, req.body, {
            createdBy: createdBy
          }));
          _context3.next = 14;
          return regeneratorRuntime.awrap(newProduct.save());

        case 14:
          req.flash("sucess", "Tạo sản phẩm thành công !");
          res.redirect("".concat(systemConfig.pathglobal, "/products"));
          _context3.next = 20;
          break;

        case 18:
          res.status(400).send("loi");
          return _context3.abrupt("return");

        case 20:
        case "end":
          return _context3.stop();
      }
    }
  });
}; // [GET] /admin/products/edit/productId


module.exports.getEditProduct = function _callee4(req, res) {
  var user, permissions, product, categorys, newCategorys;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          user = res.locals.user;
          permissions = res.locals.role.permissions;

          if (!(user && permissions.includes("product_edit"))) {
            _context4.next = 19;
            break;
          }

          _context4.prev = 3;
          _context4.next = 6;
          return regeneratorRuntime.awrap(Product.findOne({
            deleted: false,
            _id: req.params.productId
          }));

        case 6:
          product = _context4.sent;
          _context4.next = 9;
          return regeneratorRuntime.awrap(ProductCategory.find({
            deleted: false
          }));

        case 9:
          categorys = _context4.sent;
          newCategorys = createTreeHelper.createTree(categorys); // console.log(categoryParent);

          res.render("./admin/pages/product/edit", {
            pageTitle: "Chỉnh sửa sản phẩm ",
            product: product,
            newCategorys: newCategorys
          });
          _context4.next = 17;
          break;

        case 14:
          _context4.prev = 14;
          _context4.t0 = _context4["catch"](3);
          res.status(400).send("loi");

        case 17:
          _context4.next = 21;
          break;

        case 19:
          res.status(400).send("loi");
          return _context4.abrupt("return");

        case 21:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[3, 14]]);
}; // [PATCH] /admin/products/edit/productId


module.exports.patchEditProduct = function _callee5(req, res) {
  var user, permissions, id, editBy;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          user = res.locals.user;
          permissions = res.locals.role.permissions;

          if (!(user && permissions.includes("product_edit"))) {
            _context5.next = 22;
            break;
          }

          _context5.prev = 3;
          req.body.position = parseInt(req.body.position);
          req.body.price = parseInt(req.body.price);
          req.body.discountPersent = parseInt(req.body.discountPersent);
          id = req.params.productId;
          editBy = {
            account_id: res.locals.user.id,
            fullName: res.locals.user.fullname,
            editAt: Date.now()
          };
          _context5.next = 11;
          return regeneratorRuntime.awrap(Product.updateOne({
            _id: id
          }, _objectSpread({}, req.body, {
            $push: {
              editBy: editBy
            }
          })));

        case 11:
          req.flash("sucess", "Chỉnh sửa sản phẩm thành công!");
          res.redirect("".concat(systemConfig.pathglobal, "/products"));
          _context5.next = 20;
          break;

        case 15:
          _context5.prev = 15;
          _context5.t0 = _context5["catch"](3);
          console.log(_context5.t0);
          req.flash("error", "Chỉnh sửa sản phẩm không thành công!");
          res.redirect("back");

        case 20:
          _context5.next = 24;
          break;

        case 22:
          res.status(400).send("loi");
          return _context5.abrupt("return");

        case 24:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[3, 15]]);
}; // [GET] /admin/products/delete/:productId


module.exports.deleteProduct = function _callee6(req, res) {
  var user, permissions, id, userDeleted;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          user = res.locals.user;
          permissions = res.locals.role.permissions;

          if (!(user && permissions.includes("product_delete"))) {
            _context6.next = 18;
            break;
          }

          _context6.prev = 3;
          id = req.params.productId;
          userDeleted = {
            account_id: res.locals.user.id,
            fullName: res.locals.user.fullname,
            deletedAt: Date.now()
          };
          _context6.next = 8;
          return regeneratorRuntime.awrap(Product.updateOne({
            _id: id
          }, {
            deleted: true,
            deletedBy: userDeleted
          }));

        case 8:
          req.flash("sucess", "Xóa sản phẩm thành công!");
          res.redirect("back");
          _context6.next = 16;
          break;

        case 12:
          _context6.prev = 12;
          _context6.t0 = _context6["catch"](3);
          req.flash("error", "Xóa sản phẩm không thành công!");
          res.redirect("back");

        case 16:
          _context6.next = 20;
          break;

        case 18:
          res.status(400).send("loi");
          return _context6.abrupt("return");

        case 20:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[3, 12]]);
}; // [GET] /admin/products/change-status/:status/:productId


module.exports.changeStatus = function _callee7(req, res) {
  var user, permissions, id, status, editBy, _status;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          user = res.locals.user;
          permissions = res.locals.role.permissions;

          if (!(user && permissions.includes("product_edit"))) {
            _context7.next = 20;
            break;
          }

          _context7.prev = 3;
          id = req.params.productId;
          status = req.params.status;
          editBy = {
            account_id: res.locals.user.id,
            fullName: res.locals.user.fullname,
            editAt: Date.now()
          };
          _context7.next = 9;
          return regeneratorRuntime.awrap(Product.updateOne({
            _id: id
          }, {
            status: status,
            editBy: editBy
          }));

        case 9:
          req.flash("sucess", "Bạn chuyển đổi trạng thái " + status + " thành công!");
          res.redirect("back");
          _context7.next = 18;
          break;

        case 13:
          _context7.prev = 13;
          _context7.t0 = _context7["catch"](3);
          _status = req.params.status;
          req.flash("error", "Bạn chuyển đổi trạng thái " + _status + " không thành công!");
          res.redirect("back");

        case 18:
          _context7.next = 22;
          break;

        case 20:
          res.status(400).send("loi");
          return _context7.abrupt("return");

        case 22:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[3, 13]]);
}; // [PATCH] /admin/products/change-multi


module.exports.changeMultiProduct = function _callee8(req, res) {
  var user, permissions, action, ids, editBy, userDeleted, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item, _item$split, _item$split2, id, position;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          user = res.locals.user;
          permissions = res.locals.role.permissions;

          if (!(user && permissions.includes("product_edit"))) {
            _context8.next = 58;
            break;
          }

          action = req.body.action;
          ids = req.body.ids.split(", "); // console.log(ids);

          editBy = {
            account_id: res.locals.user.id,
            fullName: res.locals.user.fullname,
            editAt: Date.now()
          };
          userDeleted = {
            account_id: res.locals.user.id,
            fullName: res.locals.user.fullname,
            deletedAt: Date.now()
          };
          _context8.t0 = action;
          _context8.next = _context8.t0 === "actives" ? 10 : _context8.t0 === "inactives" ? 15 : _context8.t0 === "deletes" ? 20 : _context8.t0 === "positions" ? 25 : 55;
          break;

        case 10:
          _context8.next = 12;
          return regeneratorRuntime.awrap(Product.updateMany({
            _id: {
              $in: ids
            }
          }, {
            status: "active",
            $push: {
              editBy: editBy
            }
          }));

        case 12:
          req.flash("sucess", "Chuyển trạng thái thành công !");
          res.redirect("back");
          return _context8.abrupt("break", 56);

        case 15:
          _context8.next = 17;
          return regeneratorRuntime.awrap(Product.updateMany({
            _id: {
              $in: ids
            }
          }, {
            status: "inactive",
            $push: {
              editBy: editBy
            }
          }));

        case 17:
          req.flash("sucess", "Chuyển trạng thái thành công !");
          res.redirect("back");
          return _context8.abrupt("break", 56);

        case 20:
          _context8.next = 22;
          return regeneratorRuntime.awrap(Product.updateMany({
            _id: {
              $in: ids
            }
          }, {
            deleted: true,
            deletedBy: userDeleted
          }));

        case 22:
          req.flash("sucess", "X\xF3a ".concat(ids.length, " s\u1EA3n ph\u1EA9m th\xE0nh c\xF4ng !"));
          res.redirect("back");
          return _context8.abrupt("break", 56);

        case 25:
          // console.log(ids);
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context8.prev = 28;
          _iterator = ids[Symbol.iterator]();

        case 30:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context8.next = 38;
            break;
          }

          item = _step.value;
          _item$split = item.split("-"), _item$split2 = _slicedToArray(_item$split, 2), id = _item$split2[0], position = _item$split2[1];
          _context8.next = 35;
          return regeneratorRuntime.awrap(Product.updateOne({
            _id: id
          }, {
            position: position,
            $push: {
              editBy: editBy
            }
          }));

        case 35:
          _iteratorNormalCompletion = true;
          _context8.next = 30;
          break;

        case 38:
          _context8.next = 44;
          break;

        case 40:
          _context8.prev = 40;
          _context8.t1 = _context8["catch"](28);
          _didIteratorError = true;
          _iteratorError = _context8.t1;

        case 44:
          _context8.prev = 44;
          _context8.prev = 45;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 47:
          _context8.prev = 47;

          if (!_didIteratorError) {
            _context8.next = 50;
            break;
          }

          throw _iteratorError;

        case 50:
          return _context8.finish(47);

        case 51:
          return _context8.finish(44);

        case 52:
          req.flash("sucess", "\u0110\u1ED5i v\u1ECB tr\xED th\xE0nh c\xF4ng !");
          res.redirect("back");
          return _context8.abrupt("break", 56);

        case 55:
          return _context8.abrupt("break", 56);

        case 56:
          _context8.next = 60;
          break;

        case 58:
          res.status(400).send("loi");
          return _context8.abrupt("return");

        case 60:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[28, 40, 44, 52], [45,, 47, 51]]);
};