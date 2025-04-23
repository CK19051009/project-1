let count = 0;
function createTree(array, parent_id = "") {
  let tree = [];
  array.forEach((item) => {
    if (item.parent_id === parent_id) {
      const newItem = item;
      count++;
      newItem.count = count;
      const children = createTree(array, item.id);
      if (children.length > 0) {
        newItem.children = children;
      }

      tree.push(newItem);
    }
  });
  return tree;
}

module.exports.createTree = (array, parent_id = "") => {
  count = 0;
  const tree = createTree(array, (parent_id = ""));

  return tree;
};
