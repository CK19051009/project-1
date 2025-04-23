const tbodyPermissions = document.querySelector("[tbody-permissions]");
if (tbodyPermissions) {
  const buttonPermissions = document.querySelector("[button-permissions]");
  buttonPermissions.addEventListener("click", () => {
    let array = [];
    const rowDataNames = tbodyPermissions.querySelectorAll("[data-name]");
    rowDataNames.forEach((rowDataName) => {
      const dataName = rowDataName.getAttribute("data-name");

      if (dataName === "id") {
        const inputIds = rowDataName.querySelectorAll("input");
        inputIds.forEach((inputId) => {
          const id = inputId.value;
          array.push({
            id: id,
            permissions: [],
          });
        });
      }

      const inputCheckBoxs = rowDataName.querySelectorAll("input");
      inputCheckBoxs.forEach((inputCheckBox, index) => {
        if (inputCheckBox.checked) {
          array[index].permissions.push(dataName);
        }
      });
    });

    if (array.length > 0) {
      const formPermissions = document.querySelector("[form-permissions]");
      const inputPermissions = formPermissions.querySelector("input");
      const arrayJson = JSON.stringify(array);

      inputPermissions.value = arrayJson;
      formPermissions.submit();
    }
  });
}

// show checkboxpermissions
const showPermissions = document.querySelector("[data-permissions]");
if (tbodyPermissions) {
  const dataJson = showPermissions.getAttribute("data-permissions");
  const data = JSON.parse(dataJson);
  data.forEach((permissions, index) => {
    permissions.permissions.forEach((permission) => {
      // console.log(index);
      // console.log(permission);
      const trDataNameChecked = tbodyPermissions.querySelector(
        `[data-name = ${permission}]`
      );
      const inputChecked = trDataNameChecked.querySelectorAll("input")[index];
      // console.log(inputChecked);
      if (inputChecked) {
        inputChecked.checked = true;
      }
    });
  });
}
//end show checkboxpermissions
