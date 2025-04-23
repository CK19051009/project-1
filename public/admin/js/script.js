// Tải ảnh
const inputUpload = document.querySelector(".input_upload");
if (inputUpload) {
  inputUpload.addEventListener("change", (event) => {
    if (inputUpload.files[0]) {
      const imageUrl = document.querySelector(".image_upload");
      imageUrl.src = URL.createObjectURL(inputUpload.files[0]);
      const closeImage = document.querySelector("[close-image]");
      closeImage.style.display = "block";
      imageUrl.style.height = "200px";

      closeImage.addEventListener("click", () => {
        inputUpload.value = "";
        imageUrl.src = "";
        closeImage.style.display = "none";
        imageUrl.style.height = "0";
      });
    }
  });
}

// end

// tải nhiều ảnh
const uploadImages = document.querySelector("[input-upload-images]");
if (uploadImages) {
  uploadImages.addEventListener("change", (e) => {
    let fileArray = [];
    if (uploadImages.files) {
      // console.log(files);
      const files = Array.from(uploadImages.files);

      fileArray.push(...files);
      const productImages = document.querySelector("[productImages]");
      productImages.innerHTML = "";
      fileArray.forEach((file, index) => {
        const urlImgae = URL.createObjectURL(file);
        let image = document.createElement("div");
        // image.classList.add("mr-[5px] ");
        image.innerHTML = `
            <div class="mt-[10px] relative ">
              <button data-index = ${index} class="size-[25px] left-[180px] hidden absolute rounded-[10px] hover:bg-[#c92424] mb-[10px]" button-close  type="button">
                  <i class="fa-solid fa-xmark px-[5px] text-[red] py-[3px] text-center hover:text-[white]"></i>
              </button>
              <img src=${urlImgae} alt="" image_upload class="i w-[200px] object-cover rounded-[8px]">
            </div>
          `;
        productImages.appendChild(image);
      });

      const buttonCloses = document.querySelectorAll("[button-close]");
      const imageUrls = document.querySelectorAll("[image_upload]");
      console.log(imageUrls);
      imageUrls.forEach((image) => {
        image.style.height = "200px";
      });
      buttonCloses.forEach((button, index) => {
        button.style.display = "block";

        button.addEventListener("click", () => {
          const index = button.getAttribute("data-index");
          fileArray.splice(index, 1); // Xóa tệp khỏi mảng

          const dataTransfer = new DataTransfer();
          fileArray.forEach((file) => dataTransfer.items.add(file));
          uploadImages.files = dataTransfer.files; // Cập nhật lại tệp của input

          // Tải lại các ảnh
          button.parentElement.remove();
        });
      });
    }
  });
}
// kết thúc tải nhiều ảnh

// deleteRole
const buttonsDeleteRole = document.querySelectorAll("[button-delete-role]");

if (buttonsDeleteRole.length > 0) {
  buttonsDeleteRole.forEach((button) => {
    button.addEventListener("click", () => {
      const title = button.getAttribute("title");
      const isConfirm = confirm("Bạn có chắc muốn xóa " + title + " không ?");
      if (isConfirm) {
        const formDeleteRole = button.querySelector("[form-delete-role]");
        formDeleteRole.submit();
      }
    });
  });
}
// end deleteRole

// showAlert
const showAlert = document.querySelector("[showAlert]");
if (showAlert) {
  const time = showAlert.getAttribute("showAlert");
  setTimeout(() => {
    showAlert.classList.add("hidden");
  }, time);
}
// end showAlert

// chang-status-one
const buttonStatus = document.querySelectorAll("[button-id]");
if (buttonStatus.length > 0) {
  buttonStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const buttonId = button.getAttribute("button-id");
      const status = button.getAttribute("button-status");
      // console.log(buttonId);
      // console.log(status);
      const newStatus = status == "active" ? "inactive" : "active";
      // console.log(newStatus);

      const formChangStatus = document.querySelector("[path-status]");
      const isConfirm = confirm(
        "Bạn chắc có muốn đổi sang trạng thái " + newStatus + "?"
      );
      if (isConfirm) {
        const pathForm = formChangStatus.getAttribute("path-status");
        const pathStatus = pathForm + `/${newStatus}/${buttonId}`;
        formChangStatus.action = pathStatus;
        formChangStatus.submit();
      }
    });
  });
}
// end chang-status-one

// search
const formSearch = document.querySelector("[form-search]");
if (formSearch) {
  let url = new URL(window.location.href);
  // console.log(url);
  formSearch.addEventListener("submit", (event) => {
    event.preventDefault();

    const keyword = formSearch.keyword.value.trim();
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  });
}
// end search

// deliver status
const listButtonStatus = document.querySelector("[list-button-status]");
// console.log(listButtonStatus);
if (listButtonStatus) {
  const buttons = listButtonStatus.querySelectorAll("[status]");
  let url = new URL(window.location.href);
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("status");
      if (status !== "") {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }
      window.location.href = url.href;
    });
  });
}
// end status

// change-multi-all
const tableChangeMulti = document.querySelector("[table-change-multi]");
if (tableChangeMulti) {
  const inputCheckedAll = tableChangeMulti.querySelector("[input-checkboxAll]");
  const inputCheckBoxs = tableChangeMulti.querySelectorAll("[inputcheckbox]");
  inputCheckedAll.addEventListener("click", () => {
    if (inputCheckedAll.checked == true) {
      inputCheckBoxs.forEach((button) => {
        button.checked = true;
      });
    } else {
      inputCheckBoxs.forEach((button) => {
        button.checked = false;
      });
    }
  });
  const quantityCheckbox = inputCheckBoxs.length;
  inputCheckBoxs.forEach((button) => {
    button.addEventListener("click", () => {
      const buttonChecked = tableChangeMulti.querySelectorAll(
        "[inputcheckbox]:checked"
      ).length;
      if (buttonChecked === quantityCheckbox) {
        inputCheckedAll.checked = true;
      } else {
        inputCheckedAll.checked = false;
      }
    });
  });
}
//end change-multi-all

// submit-form-change-multi
const formSubmitChangeMulti = document.querySelector("[form-change-multi]");
if (formSubmitChangeMulti) {
  formSubmitChangeMulti.addEventListener("submit", (event) => {
    event.preventDefault();
    const nameSelect = formSubmitChangeMulti.querySelector(
      "select[name='action']"
    ).value;
    const tableChangeMulti = document.querySelector("[table-change-multi]");

    const inputCheckeds = tableChangeMulti.querySelectorAll(
      "[inputcheckbox]:checked"
    );
    const inputIds = formSubmitChangeMulti.querySelector("input[name='ids']");
    // console.log(inputIds);

    if (nameSelect == "deletes") {
      const deleteConfim = confirm(
        "Bạn chắc là muốn xóa " + inputCheckeds.length + " danh mục chứ ?"
      );
      if (!deleteConfim) {
        return;
      }
    }
    let ids = [];

    if (inputCheckeds.length > 0) {
      inputCheckeds.forEach((button) => {
        const id = button.value;
        if (nameSelect == "positions") {
          const position = button
            .closest("tr")
            .querySelector("[input-position]").value;

          const idPosition = `${id}-${position}`;
          ids.push(idPosition);
        } else {
          ids.push(id);
        }
      });
      inputIds.value = ids.join(", ");
      formSubmitChangeMulti.submit();
    } else {
      alert("Bạn phải chọn tối thiểu 1 danh mục");
    }
  });
}
// end submit-form-change-multi

// sort-form
const formSort = document.querySelector("[form-sort]");
if (formSort) {
  formSort.addEventListener("submit", (event) => {
    event.preventDefault();
    const sort = formSort.querySelector("select[name='sort']").value;

    // console.log(optionSelected);

    const sortUrl = sort.split("-");
    const [sortKey, sortValue] = sortUrl;
    let url = new URL(window.location.href);
    if (sortKey && sortValue) {
      url.searchParams.set("sortkey", sortKey);
      url.searchParams.set("sortvalue", sortValue);

      // optionSelected.selected = true;
      // console.log(optionSelected.selected);

      window.location.href = url.href;
    } else {
      url.searchParams.delete("sortkey");
      url.searchParams.delete("sortvalue");
      window.location.href = url.href;
    }
  });

  let url = new URL(window.location.href);
  const sortKey = url.searchParams.get("sortkey");
  const sortValue = url.searchParams.get("sortvalue");
  // console.log(sortKey);
  // console.log(sortValue);
  const sort = `${sortKey}-${sortValue}`;
  const optionSelected = formSort.querySelector(`option[value="${sort}"]`);
  if (optionSelected) {
    optionSelected.selected = true;
  }
}
// end sort-form

// pagination
const buttonPages = document.querySelectorAll("[page-href]");
if (buttonPages.length > 0) {
  let url = new URL(window.location.href);
  buttonPages.forEach((button) => {
    button.addEventListener("click", () => {
      const pagehref = button.getAttribute("page-href");
      url.searchParams.set("page", pagehref);
      window.location.href = url.href;
    });
  });
}
// end  pagination

// active menu
const listMenuSider = document.querySelectorAll("[sider-item-admin]");
if (listMenuSider.length > 0) {
  const currentPath = window.location.pathname;
  console.log(currentPath);
  listMenuSider.forEach((item) => {
    const urlofa = item.querySelector("a").getAttribute("href");
    if (currentPath === urlofa) {
      item.style.background = "#bbd3fa";
    }
  });
}
// end active menu
