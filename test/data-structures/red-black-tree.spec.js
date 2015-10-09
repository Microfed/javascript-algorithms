'use strict';

var mod = require('../../src/data-structures/red-black-tree.js');
var Vertex = mod.Node;
var RBTree = mod.RBTree;
var Colors = mod.Colors;

// from http://www.eternallyconfuzzled.com/tuts/datastructures/jsw_tut_rbtree.aspx
var getTreeHeight = function (node) {
  var lh, rh;

  if (node == null) {
    return 1;
  } else {
    var ln = node.getLeft();
    var rn = node.getRight();

    /* Consecutive red links */
    if (node.isRed() && ln && rn) {
      if (ln.isRed() || rn.isRed()) {
        console.log('red');
        // Red violation
        return 0;
      }
    }

    lh = getTreeHeight(ln);
    rh = getTreeHeight(rn);

    /* Invalid binary search tree */
    if ((ln != null && ln.getKey() >= node.getKey())
        || (rn != null && rn.getKey() <= node.getKey())) {
      console.log('binary');
      // Binary tree violation
      return 0;
    }

    /* Black height mismatch */
    if (lh != 0 && rh != 0 && lh != rh) {
      console.log('black', 'left', lh, 'right', rh);
      // Black violation
      return 0;
    }

    /* Only count black links */
    if (lh != 0 && rh != 0) {
      return node.isRed() ? lh : lh + 1;
    } else {
      return 0;
    }
  }
};

var isItRedBlackTree = function (tree) {
  return getTreeHeight(tree._root) !== 0;
};

describe('Node', function () {

  it('should be a constructor function', function () {
    expect(typeof Vertex).toBe('function');
  });

  it('should set all properties via the constructor', function () {
    var node = new Vertex('key', 'value', 1, 2, Colors.RED);
    expect(node.getKey()).toBe('key');
    expect(node.getLeft()).toBe(1);
    expect(node.getRight()).toBe(2);
    expect(node.getValue()).toBe('value');
    expect(node.isRed()).toBeTruthy();
  });

  describe('Node flipColor', function () {
    it('should has method flipColor', function () {
      var node = new Vertex();
      expect(typeof node.flipColor).toBe('function');
    });
    it('should work properly', function () {
      var node = new Vertex();
      expect(node.isRed()).toBe(false);
      node.flipColor();
      expect(node.isRed()).toBe(true);
      node.flipColor();
      expect(node.isRed()).toBe(false);
    });
  });
});

describe('RBTree', function () {
  it('should be a constructor function', function () {
    expect(typeof RBTree).toBe('function');
  });
  it('should initialize root to null by default', function () {
    expect(new RBTree()._root).toBeNull();
  });

  describe('node insertion', function () {
    it('should be able to insert a node in empty tree', function () {
      var tree = new RBTree();
      tree.put('foo', 'bar');
      expect(tree._root.getKey()).toBe('foo');
      expect(tree._root.getValue()).toBe('bar');
    });

    it('should be able to insert a node in 1 level tree', function () {
      var tree = new RBTree();
      tree.put(1, 'bar');
      tree.put(0, 'baz');
      expect(tree._root.getLeft()).not.toBeNull();
      expect(tree._root.getLeft().isRed()).toBeTruthy();
      tree.put(2, 'baz');
      expect(tree._root.getRight()).not.toBeNull();
      expect(tree._root.getRight().isRed()).toBeFalsy();

      tree = new RBTree();
      tree.put(1, 'bar');
      tree.put(2, 'foo');
      tree.put(3, 'baz');
      expect(tree._root.getRight()).not.toBeNull();
      expect(tree._root.getLeft()).not.toBeNull();
      expect(tree._root.isRed()).toBeFalsy();
      expect(tree._root.getRight().isRed()).toBeFalsy();
      expect(tree._root.getLeft().isRed()).toBeFalsy();
      tree.put(4, 'foobar');
      tree.put(5, 'foobar');
      expect(tree._root.getRight().getRight()).not.toBeNull();
      expect(tree._root.getRight().getRight().isRed()).toBeFalsy();
    });

  });

  describe('get method', function () {
    it('should be able to find value by given key', function () {
      var tree = new RBTree();
      expect(tree.get(1)).toBeUndefined();
      tree.put(1, 'baz');
      expect(tree.get(1)).toBe('baz');
      tree.put(2, 'foo');
      expect(tree.get(2)).toBe('foo');
      tree.put(3, 'bar');
      expect(tree.get(3)).toBe('bar');
      expect(tree.get(4)).toBeUndefined();
      tree.put(5, 'foobar');
      expect(tree.get(5)).toBe('foobar');
      tree.put(5, 'foobar1');
      expect(tree.get(5)).toBe('foobar1');
    });
  });

  describe('remove method', function () {
    xit('should be able to remove value by given key', function () {
      var tree = new RBTree();

      expect(tree.get(1)).toBeUndefined();
      tree.put(1, 'baz');
      expect(tree.get(1)).toBe('baz');

      tree.remove(1);
      expect(tree.get(1)).toBeUndefined();
    });

    xit('should remain the tree balanced after removing a node', function () {
      var tree = new RBTree();
      var color = function (node) {
        return node.isRed() ? 'R': 'B';
      };

      tree.put(1, '1');
      tree.put(2, '2');
      tree.put(3, '3');
      tree.put(4, '4');
      tree.put(5, '5');
      tree.put(6, '6');

      var second = tree._root;
      var first = second.getLeft();
      var fourth = second.getRight();
      var third = fourth.getLeft();
      var fifth = fourth.getRight();
      var sixth = fifth.getRight();

      //tree.remove(1);

      console.log('\n');
      console.log('    2', color(second), second.getKey());
      console.log('    /    \\');
      console.log(' 1', color(first), first.getKey(), ' 4', color(fourth), fourth.getKey());
      console.log('        /    \\');
      console.log('     3', color(third), third.getKey(), ' 5', color(fifth), fifth.getKey());
      console.log('                 \\');
      console.log('                  6', color(sixth), sixth.getKey());

      expect(isItRedBlackTree(tree)).toBeTruthy();
    });
  });

  describe('traverse method', function () {
    it('should be a function', function () {
      expect(RBTree.prototype.traverse).toBeDefined();
      expect(typeof RBTree.prototype.traverse).toBe('function');
    });

    it('should return an array', function () {
      var tree = new RBTree();

      expect(Array.isArray(tree.traverse())).toBeTruthy();
    });

    it('should return an array of tree nodes for the non-empty tree', function () {
      var tree = new RBTree();
      var traversal;
      var isNode = function (object) {
        return object instanceof Vertex;
      };

      tree.put(1, '1');

      traversal = tree.traverse();

      expect(traversal.length).toBeGreaterThan(0);
      expect(traversal.every(isNode)).toBeTruthy();
    });

    it('should return an array with number of elements equal to elements number in the tree', function () {
      var tree = new RBTree();
      var traversal;

      tree.put(1, '1');
      tree.put(2, '2');
      tree.put(3, '3');

      traversal = tree.traverse();

      expect(traversal.length).toEqual(3);
    });

    it('should return the same sequence of nodes every time for the same tree', function () {
      var tree = new RBTree();
      var toStringListOfKeys = function (array) {
        return array.reduce(function (memo, node) {
          return memo + node.getKey();
        }, '');
      };

      tree.put(1, '1');
      tree.put(2, '2');
      tree.put(3, '3');
      tree.put(4, '4');
      tree.put(5, '5');
      //tree.put(6, '6');

      expect(toStringListOfKeys(tree.traverse())).toEqual('21435');
      expect(toStringListOfKeys(tree.traverse())).toEqual('21435');
      expect(toStringListOfKeys(tree.traverse())).toEqual('21435');
    });
  });
});
