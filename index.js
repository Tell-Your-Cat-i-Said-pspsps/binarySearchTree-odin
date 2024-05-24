class Node {
  constructor(value) {
    this.value = value;
    this.right = null;
    this.left = null;
  }
}
class Tree {
  constructor(array) {
    //remove duplicates
    this.intialArray = [...new Set(array)];
    // sort  the  array numerically
    this.intialArray.sort((a, b) => {
      return a - b;
    });
    this.root = buildTree(this.intialArray);
    this.balanced = true;
    this.treeHeight = 1;
  }
  //insert a new node with a given value if not found in the tree
  insert(value, current = this.root) {
    if (value > current.value) {
      if (current.right === null) {
        current.right = new Node(value);
        return true;
      } else {
        return this.insert(value, current.right);
      }
    } else if (value < current.value) {
      if (current.left === null) {
        current.left = new Node(value);
        return true;
      } else {
        return this.insert(value, current.left);
      }
    } else {
      return false;
    }
  }
  //delete node of a given value if found
  deleteItem(value, current = this.root, parent = this.root) {
    if (value === current.value) {
      if (current.left === null && current.right === null) {
        if (current === this.root) {
          this.root == null;
          return true;
        } else {
          if (parent.left.value == value) {
            parent.left == null;
            return true;
          } else if (parent.right.value == value) {
            parent.right = null;
            return true;
          }
        }
      } else if (
        (current.left && current.right === null) ||
        (current.right && current.left === null)
      ) {
        if (current === this.root) {
          this.root = current.left ? current.left : current.right;
          return true;
        } else {
          const onlyChild = current.left ? current.left : current.right;
          if (parent.right.value === value) {
            parent.right = onlyChild;
          } else if (parent.left.value === value) {
            parent.left = onlyChild;
          }
        }
      } else if (current.left && current.right) {
        let removedNode = current;
        let parent = current;
        current = current.right;
        while (current.left) {
          parent = current;
          current = current.left;
        }
        const newValue = current.value;
        parent.left = null;
        removedNode.value = newValue;
      }
    } else if (value < current.value) {
      return this.deleteItem(value, current.left, current);
    } else if (value > current.value) {
      return this.deleteItem(value, current.right, current);
    }
  }
  // look up a given value and checks if there is a node in the tree with that value and returns it
  find(value, current = this.root) {
    if (current) {
      console.log(current);
      if (value < current.value) {
        return this.find(value, current.left);
      } else if (value > current.value) {
        return this.find(value, current.right);
      } else if (current.value === value) {
        console.log(current);
        return current;
      }
    } else {
      return null;
    }
  }
  //levelOrder traverse breadth first traverse
  levelOrder(fn) {
    let queue = [this.root];
    while (queue.length > 0) {
      if (queue[0].left) {
        queue.push(queue[0].left);
      }
      if (queue[0].right) {
        queue.push(queue[0].right);
      }
      fn(queue[0]);

      queue.shift();
    }
  }
  //depth first traverse
  //preOrder traverse
  preOrder(current = this.root) {
    if (current === null) {
      return;
    }
    process.stdout.write(`${current.value},`);
    this.preOrder(current.left);
    this.preOrder(current.right);
  }
  //inOrder traverse
  inOrder(current = this.root) {
    if (current === null) {
      return;
    }
    this.inOrder(current.left);
    process.stdout.write(`${current.value},`);
    this.inOrder(current.right);
  }

  //postOrder traverse
  postOrder(current = this.root) {
    if (current === null) {
      return;
    }
    this.postOrder(current.left);
    this.postOrder(current.right);
    process.stdout.write(`${current.value},`);
  }

  // get the tree height and check if tree is balanced or not
  treeInfo(current = this.root) {
    let sumLeft = 0;
    let sumRight = 0;
    let isBalanced = true;
    if (current === null) {
      return [0, isBalanced];
    } else {
      if (current.left) {
        sumLeft++;
      }
      if (current.right) {
        sumRight++;
      }
    }
    let childNodeRight = this.treeInfo(current.right);
    let childNodeLeft = this.treeInfo(current.left);
    sumRight = sumRight + childNodeRight[0];
    sumLeft = sumLeft + childNodeLeft[0];
    if (Math.abs(sumRight - sumLeft) > 1) {
      isBalanced = false;
    }
    if (sumRight > sumLeft) {
      return [sumRight, isBalanced];
    } else {
      return [sumLeft, isBalanced];
    }
  }
  // update the treeInfo then check if the tree is balanced or not
  isBalanced() {
    let tmp = this.treeInfo();
    this.balanced = tmp[1];

    return this.balanced;
  }
  // update the treeInfo then get the hight
  height() {
    let tmp = this.treeInfo();
    this.treeHeight = tmp[0];
    return this.treeHeight;
  }
  depth(node, current = this.root) {
    // just like find but this time return the cound of the steps till we find the node if not found retur  null
    if (current !== null) {
      if (node.value < current.value) {
        return 1 + this.depth(node, current.left);
      } else if (node.value > current.value) {
        return 1 + this.depth(node, current.right);
      } else if (current.value === node.value) {
        return 0;
      }
    } else {
      return null;
    }
  }
  getNewArray() {
    let queue = [this.root];
    let newArray = [];
    //traverse and add new item to the new array
    while (queue.length > 0) {
      if (queue[0].left) {
        queue.push(queue[0].left);
      }
      if (queue[0].right) {
        queue.push(queue[0].right);
      }
      newArray.push(queue[0].value);
      queue.shift();
    }
    return newArray;
  }
  balance() {
    if (this.isBalanced()) {
      return this.root;
    } else {
      let newArray = this.getNewArray();
      newArray.sort((a, b) => {
        return a - b;
      });
      this.root = buildTree(newArray);
    }
  }
}
// Building the Binary Search Tree
function buildTree(array) {
  if (array.length == 0) {
    return null;
  } else {
    let mid = Math.floor(array.length / 2);
    let root = new Node(array[mid]);
    let leftArray = array.slice(0, mid);
    let rightArray = array.slice(mid + 1, array.length);
    root.left = buildTree(leftArray);
    root.right = buildTree(rightArray);
    return root;
  }
}

// Odin Binary Tree Console Print
const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};
