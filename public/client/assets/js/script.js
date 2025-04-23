// tăng giảm số lượng
const formOrderProduct = document.querySelector("[form-order]");
if (formOrderProduct) {
  const buttonsProduct = document.querySelectorAll("[button-prev-quantity]");
  const elementPrice = document.querySelector("[priceProduct]");
  const price = elementPrice.getAttribute("priceProduct");
  const input = document.querySelector("[input-order]");
  buttonsProduct.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.getAttribute("button-prev-quantity");
      let inputNew;
      switch (value) {
        case "+":
          inputNew = parseInt(input.value) + 1;
          input.value = inputNew;
          const priceNew = parseInt(price) * inputNew;
          elementPrice.innerHTML = priceNew.toLocaleString();
          break;
        case "-":
          if (parseInt(input.value) === 1) {
            inputNew = 1;
          } else {
            inputNew = parseInt(input.value) - 1;
            input.value = inputNew;
            const priceNew = parseInt(price) * inputNew;
            elementPrice.innerHTML = priceNew.toLocaleString();
          }

          break;

        default:
          break;
      }
    });
  });
}

// Hàm đọc cookie theo tên
function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null; // Không tìm thấy cookie
}

function checkToken(button, url) {
  button.addEventListener("click", () => {
    const token = getCookie("token_user");
    if (token) {
      window.location.href = url;
    } else {
      const overlay = document.querySelector(".loginOverlay");
      overlay.classList.remove("hidden");
      console.log(buttonCheckHeader);
    }
  });
}
// chat
const buttonChat = document.querySelector("[button-authen-chat]");
if (buttonChat) {
  checkToken(buttonChat, "/chat");
}

// cart
const buttonCart = document.querySelector("[href-cart]");
if (buttonCart) {
  checkToken(buttonCart, "/cart");
}

// clost overlay
const buttonCloseOverlay = document.querySelector("[button-close-overlay]");
const overlay = document.querySelector(".loginOverlay");

if (overlay) {
  // Đóng khi click nút đóng
  if (buttonCloseOverlay) {
    buttonCloseOverlay.addEventListener("click", () => {
      overlay.classList.add("hidden");
    });
  }

  // Đóng khi click bên ngoài popup
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.add("hidden");
    }
  });

  // Đóng khi nhấn phím ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.classList.contains("hidden")) {
      overlay.classList.add("hidden");
    }
  });
}

const buttonCheckHeader = document.querySelector("[button-header-login]");
if (buttonCheckHeader) {
  checkToken(buttonCheckHeader, "#");
}

// change placeholder input
const inputSearch = document.querySelector("[input-search-header]");
if (inputSearch) {
  const content = [
    "Freeship đơn từ 45k",
    "100% hàng thật",
    "Giá siêu rẻ",
    "Hoàn 200% nếu hàng giả",
    "Giao hàng trong 2H",
    "30 ngày đổi trả",
  ];
  let i = 0;
  const intervalTime = 4000;

  // Hiển thị placeholder đầu tiên ngay lập tức
  inputSearch.setAttribute("placeholder", content[i]);

  // Thiết lập interval để thay đổi placeholder
  const intervalId = setInterval(() => {
    i = (i + 1) % content.length; // Tăng i và quay về 0 khi đến cuối mảng
    inputSearch.setAttribute("placeholder", content[i]);
  }, intervalTime);
  // intervalId();
}

// search

// end search
