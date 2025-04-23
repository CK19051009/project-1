module.exports.buttonStatus = (query) => {
  const objectButtons = [
    {
      title: "Tất cả",
      status: "",
      class: "",
    },
    {
      title: "Hoạt động",
      status: "active",
      class: "",
    },
    {
      title: "Dừng hoạt động",
      status: "inactive",
      class: "",
    },
  ];

  if (query.status) {
    const indexActive = objectButtons.findIndex(
      (button) => button.status === query.status
    );
    objectButtons[indexActive].class = "active";
  } else {
    const indexActive = objectButtons.findIndex(
      (button) => button.status === ""
    );
    objectButtons[indexActive].class = "active";
  }

  return objectButtons;
};
