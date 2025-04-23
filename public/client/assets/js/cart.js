// Lấy ra các nút mua hàng và bắt sự kiên
const buttons = document.querySelectorAll("[path-order]");
if (buttons.length) {
  const formOrder = document.querySelector("[form-order]");
  const token = getCookie("token_user");

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      if (token) {
        const path = button.getAttribute("path-order");
        const flag = button.getAttribute("flag-button");
        const value = formOrder.querySelector("input[name='ids']");
        formOrder.action = path;
        if (flag == "addProduct") {
          value.value = "";
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          await Toast.fire({
            icon: "success",
            title: "Thành công",
            customClass: {
              container: "!top-12 !end-5", // Cách top 10px, right 5px
              popup: "!mt-0", // Reset margin
            },
            width: "280px",
            padding: "10px 20px",
          });
          formOrder.submit();
        } else if (flag == "buynow") {
          formOrder.submit();
        }
      } else {
        const overlay = document.querySelector(".loginOverlay");
        overlay.classList.remove("hidden");
      }
    });
  });
}
// hết Lấy ra các nút mua hàng và bắt sự kiên
// showAlert
const showAlert = document.querySelector("[showAlert]");
if (showAlert) {
  const time = showAlert.getAttribute("showAlert");
  setTimeout(() => {
    showAlert.classList.add("hidden");
  }, time);
}
// end showAlert

const tableOrder = document.querySelector("[table-order]");
if (tableOrder) {
  let arrayPrice = [];
  const inputCheckAll = tableOrder.querySelector("input[name='checkAll']");
  const inputCheckBoxs = tableOrder.querySelectorAll("input[name='check']");
  const elementPrices = document.querySelector("[total-prices]");
  const elementBuy = document.querySelector("[buy-product]");
  const elementPayMent = document.querySelector("[total-payment]");

  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      inputCheckBoxs.forEach((input) => {
        input.checked = true;
        const price = input.getAttribute("price-product");
        const quantity = input.getAttribute("quantity-product");
        const totalPrice = price * quantity;
        arrayPrice.push(totalPrice);
      });
    } else {
      inputCheckBoxs.forEach((input) => {
        input.checked = false;
        arrayPrice.length = 0;
      });
    }
    let totalPrices = arrayPrice.reduce((sum, item) => sum + item, 0);
    elementPrices.innerHTML = totalPrices.toLocaleString();
    if (totalPrices === 0) {
      elementPayMent.innerHTML = `Vui lòng chọn sản phẩm `;
    } else {
      elementPayMent.innerHTML = `${totalPrices.toLocaleString()} <sup style="text-decoration: underline; color: red; font-size:12px; font-weight: 500;">đ</sup>`;
    }
    elementBuy.innerHTML = `Mua hàng (${arrayPrice.length})`;
  });

  const lengthCheckBox = inputCheckBoxs.length;
  inputCheckBoxs.forEach((item, index) => {
    item.addEventListener("click", () => {
      const checkeds = tableOrder.querySelectorAll(
        "input[name='check']:checked"
      ).length;
      const price = item.getAttribute("price-product");
      const quantity = item.getAttribute("quantity-product");
      const totalPrice = price * quantity;

      if (item.checked) {
        arrayPrice.push(totalPrice);
      } else {
        const priceIndex = arrayPrice.indexOf(totalPrice);

        if (priceIndex > -1) {
          arrayPrice.splice(priceIndex, 1);
        }
      }
      let totalPrices = arrayPrice.reduce((sum, item) => sum + item, 0);
      elementPrices.innerHTML = totalPrices.toLocaleString();

      if (totalPrices === 0) {
        elementPayMent.innerHTML = `Vui lòng chọn sản phẩm `;
      } else {
        elementPayMent.innerHTML = `${totalPrices.toLocaleString()} <sup style="text-decoration: underline; color: red; font-size:12px; font-weight: 500;">đ</sup>`;
      }
      elementBuy.innerHTML = `Mua hàng (${arrayPrice.length})`;

      if (checkeds == lengthCheckBox) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}
// xóa sản phẩm khỏi giỏ hàng
const buttonsDelete = document.querySelectorAll("[button-path]");
if (buttonsDelete.length > 0) {
  buttonsDelete.forEach((button) => {
    button.addEventListener("click", async () => {
      const pathDelete = button.getAttribute("button-path");

      const confirmDelete = confirm(
        "Bạn chắc có muốn xóa sản phẩm khỏi giỏ hàng ?"
      );
      if (confirmDelete) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        await Toast.fire({
          icon: "success",
          title: "Xóa thàng công",
          customClass: {
            container: "!top-12 !end-5", // Cách top 10px, right 5px
            popup: "!mt-0", // Reset margin
          },
          width: "280px",
          padding: "10px 20px",
        });
        window.location.href = pathDelete;
      }
    });
  });
}
// xóa sản phẩm khỏi giỏ hàng

// Tăng sô lượng cho sản phẩm ở giỏ hàng
const forms = document.querySelectorAll("[form-change-product]");
if (forms.length > 0) {
  forms.forEach((form) => {
    const input = form.querySelector("[product-quantity]");
    const buttons = form.querySelectorAll("[button-prev-quantity]");
    console.log(buttons);
    buttons.forEach((button) => {
      button.addEventListener("click", async () => {
        const value = button.getAttribute("button-prev-quantity");
        let inputNew;
        switch (value) {
          case "+":
            inputNew = parseInt(input.value) + 1;
            input.value = inputNew;
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              },
            });
            await Toast.fire({
              icon: "success",
              title: "Tăng thành công!",
              customClass: {
                container: "!top-12 !end-5", // Cách top 10px, right 5px
                popup: "!mt-0", // Reset margin
              },
              width: "280px",
              padding: "10px 20px",
            });
            form.submit();
            break;
          case "-":
            if (parseInt(input.value) === 1) {
              inputNew = 1;
              // form.submit();
            } else {
              inputNew = parseInt(input.value) - 1;
              input.value = inputNew;
              const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                },
              });
              await Toast.fire({
                icon: "success",
                title: "Giảm thành công!",
                customClass: {
                  container: "!top-12 !end-5", // Cách top 10px, right 5px
                  popup: "!mt-0", // Reset margin
                },
                width: "280px",
                padding: "10px 20px",
              });
              form.submit();
            }

            break;

          default:
            break;
        }
      });
    });
    // input.addEventListener("change", (e) => {
    //   const quantityNew = input.value;
    //   form.submit();
    // });
  });
}

// Hết Tăng sô lượng cho sản phẩm ở giỏ hàng

// Lấy ra sản phẩm chọn để mua
const buttonBuy = document.querySelector("[button-buy-checkout]");
const formCheckOutOrder = document.querySelector("[form-checkout-order]");
if (formCheckOutOrder) {
  const inputCheckOutOrder =
    formCheckOutOrder.querySelector("input[name='ids']");
  buttonBuy.addEventListener("click", () => {
    const inputCheckeds = tableOrder.querySelectorAll(
      "[price-product]:checked"
    );
    let ids = [];

    inputCheckeds.forEach((item) => {
      const id = item.value;
      ids.push(id);
    });
    if (ids.length < 1) {
      alert("Bạn chưa chọn sản phẩm!");
      return;
    }

    const stringIds = ids.join(", ");
    inputCheckOutOrder.value = stringIds;
    formCheckOutOrder.submit();
  });
}
// Hết lấy ra sản phẩm chọn để mua

// order-success
const buttonOrderProduct = document.querySelector("[button-order]");
if (buttonOrderProduct) {
  const form = document.querySelector("[form-order-success]");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const dataOrder = document
      .querySelector("[data-order-ids]")
      .getAttribute("data-order-ids");
    const inputIdsOrder = document.querySelector("input[name='idsOrder']");
    inputIdsOrder.value = dataOrder;
    form.submit();
  });
}
// end order-success

// buy product now
const formBuyNow = document.querySelector("[form-buy-now]");
if (formBuyNow) {
  const buttonBuyNow = document.querySelector("[path-buyNow]");
  const path = buttonBuyNow.getAttribute("path-buyNow");
  const inputQuantity = document.querySelector("[input-order]");
  // console.log(inputQuantity.value);
  buttonBuyNow.addEventListener("click", () => {
    formBuyNow.action = path;
    // formBuyNow.submit();
  });
}
// end buy product now

// show market
const buttonShows = document.querySelectorAll("[button-flag-show]");
if (buttonShows.length > 0) {
  const marketView = document.querySelector("[market-view]");
  buttonShows.forEach((button, index) => {
    button.addEventListener("click", () => {
      const flagShow = button.getAttribute("button-flag-show");
      if (flagShow == "view") {
        button.classList.add("hidden");
        const buttonHidden = buttonShows[1];
        buttonHidden.classList.remove("hidden");
        marketView.classList.remove("hidden");
      } else if (flagShow == "hidden") {
        const buttonView = buttonShows[0];
        buttonView.classList.remove("hidden");
        button.classList.add("hidden");
        marketView.classList.add("hidden");
      }
    });
  });
}
// end show market
