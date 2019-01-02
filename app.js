var root = document.createElement('div');

var body = document.body;

function cubeFace({className, value}) {
    let face = document.createElement('div');
    face.classList.add('cube__face');
    face.classList.add(className);
    face.innerHTML = value;
    console.log(face);
    return face;
}
function RotateBox(innerHtml) {
    let cube = document.createElement('div');
    cube.appendChild(cubeFace({className:'cube__face--front', value: innerHtml}));
    cube.appendChild(cubeFace({className:'cube__face--back', value: innerHtml}));
    cube.appendChild(cubeFace({className:'cube__face--left', value: innerHtml}));
    cube.appendChild(cubeFace({className:'cube__face--right', value: innerHtml}));
    cube.appendChild(cubeFace({className:'cube__face--top', value: innerHtml}));
    cube.appendChild(cubeFace({className:'cube__face--bottom', value: innerHtml}));
    cube.classList.add('cube');
    cube.classList.add('rotatable');

    return cube;
}

function Node(value, i, root) {
    this.root = root;
    this.position = i;
    this.value = value;
    this.el = document.createElement('span');
    this.animationEl = RotateBox(value);
    this.el.appendChild(this.animationEl);
    this.el.classList.add('node');

    if(root && value <= root.value) {
        this.el.classList.add('left');
    } else {
        this.el.classList.add('right');
    }
    this.activate = () => {
        this.animationEl.classList.add('active');
    }
    this.deactivate = () => {
        this.animationEl.classList.remove('active');
    }
    this.insert = (parent) => {
        parent.appendChild(parent);
    }
}



function BinaryTree(arrayIn) {
    this.tree = [];
    this.timer = 100;
    this.animationQueue = [];

    for(let n of arrayIn) {
        this.insert(n);
    }
}

BinaryTree.prototype.saveAnimationStep = function(callback) {
    this.animationQueue.push(callback);
};

BinaryTree.prototype.animate = function() {
    const stepIt = () => {
        let step = this.animationQueue.shift();
        step();
        this.animate();
    }
    if(this.animationQueue.length) {
        setTimeout(stepIt, 100)
    }
};

BinaryTree.prototype.delete = function(value){
    let i = this.bfs(value);
    console.log('delete not implemented');
};

BinaryTree.prototype.insert = function(value){
  let i = 0;
  if(this.tree[i] === undefined) {
      this.tree[i] = new Node(value, i);
      return i;
  }
  while(this.tree[i]!== undefined) {
      console.log(`tree loop ${i}`);
      let left = (i*2) + 1;
      let right = (i*2) + 2;
      if(this.tree[i].value > value) {
          if(this.tree[left] !== undefined) {
              i = left;
          } else {
              this.tree[left] = new Node(value, left, this.tree[i]);
              this.tree[i].el.appendChild(this.tree[left].el);
              i = -1;
          }
      } else if(this.tree[i].value < value) {
          if(this.tree[right] !== undefined) {
              i = right;
          } else {
              this.tree[right] = new Node(value, right, this.tree[i]);
              this.tree[i].el.appendChild(this.tree[right].el);
              if(i === 0) {
                  this.tree[i].el.classList.add('root');
              }
              i = -1;
          }
      } else {
          i = -1;
      }
  }
  return this.tree[i];
};

BinaryTree.prototype.dfs = function(value){
    let stack = [this.tree[0]];
    while(stack.length) {
        let node = stack.pop();
        this.saveAnimationStep(node.activate);
        setTimeout(node.deactivate, 10000);
        if(node.value === value) {
            this.animate();
            return node;
        } else {
            let p = node.position;
            let left = (p * 2) + 1;
            let right = (p * 2) + 2;
            if(this.tree[right]) {
                stack.push(this.tree[right]);
            }
            if(this.tree[left]) {
                stack.push(this.tree[left]);
            }
        }

    }
};

BinaryTree.prototype.bfs = function(value){
    let q = [this.tree[0]];
    while(q.length) {
        let node = q.shift();
        this.saveAnimationStep(node.activate);
        // this.saveAnimationStep(node.deactivate);
        setTimeout(node.deactivate, 10000);
        if(node.value === value) {
            this.animate();
            return node;
        } else {
            let p = node.position;
            let left = (p * 2) + 1;
            let right = (p * 2) + 2;
            if(this.tree[right]) {
                q.push(this.tree[right]);
            }
            if(this.tree[left]) {
                q.push(this.tree[left]);
            }
        }
    }
};


// var b = new BinaryTree([50, 49, 51, 37, 56, 53, 3, 91]);
var randomArray = [];
let length = Math.random() * 10;
for(let i = 0; i < length; i++) {
    randomArray.push(Math.floor(Math.random() * 10 * Math.random() * 10));
}
var b = new BinaryTree(randomArray);

body.appendChild(b.tree[0].el);