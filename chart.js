var graphValue =
    [{
        id: 1, title: 1, x: 4, y: 7, child: [
            { id: 2, title: 2, x: 2, y: 8 }, { id: 3, title: 3, x: 6, y: 3 }, { id: 4, title: 4, x: 9, y: 9 }
        ]
    },
    {
        id: 5, title: 1, x: 4, y: 7, child: [
            { id: 6, title: 2, x: 6, y: 5 }
        ]
    }
    ]

var mousePosition;

var isMouseDown;

var c = document.getElementById("myCanvas");
var previousPosition = document.getElementById("previousPostion")
var currentPosition = document.getElementById("currentPosition")


var ctx = c.getContext("2d");

document.addEventListener('mousemove', move, false);
document.addEventListener('mousedown', setDraggable, false);
document.addEventListener('mouseup', setDraggable, false);

var circles = [];
var lines = [];
graphValue.map(item => {

    circles.push(new Circle(item.x * 50, item.y * 50, 30, "#25404E", "", true, item.id))
    item.child.map((children, index) => {

        lines.push(new line(item.x * 50, item.y * 50, ((children.x * 50)), children.y * 50, item.id, children.id))
        circles.push(new Circle(children.x * 50, children.y * 50, 30, "#25404E", "", false, children.id))


    })
  
})


//main draw method
function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "white"
    start = 50;
    for (i = 1; i <= 11; i++) {


        ctx.beginPath();
        ctx.moveTo(50, start * i);
        ctx.lineTo(550, start * i);
        ctx.stroke();
        ctx.lineWidth = 2
        ctx.closePath();
        ctx.beginPath();
        ctx.fillText(0, 40, 550);
        ctx.fillText(0, 50, 560);
        if ((11 - i) % 2 == 0) {
            ctx.fillText(11 - i, 40, 50 * i);
        }
        if (i % 2 == 0) {
            ctx.fillText(i, 50 * i, 560);
            
        }
        ctx.fillStyle="black"
        ctx.moveTo(start * i, 50);
        ctx.lineTo(start * i, 550);

        ctx.stroke();
        ctx.closePath();
    }

    drawCircles()

}

//draw circles
function drawCircles() {

    for (var i = circles.length - 1; i >= 0; i--) {
        circles[i].draw();
    }
    for (var j = lines.length - 1; j >= 0; j--) {
        lines[j].draw();
    }
    console.log(lines)
}

//key track of circle focus and focused index
var focused = {
    key: 0,
    state: false
}


//circle Object
function Circle(x, y, r, fill, stroke, parent, selfId) {
    console.log(parent)
    this.startingAngle = 0;
    this.endAngle = 2 * Math.PI;
    this.x = x;
    this.y = y;
    this.parent = parent
    this.r = r;
    this.selfId = selfId

    this.fill = fill;
    this.stroke = stroke;

    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, this.startingAngle, this.endAngle);
        ctx.fillStyle = this.fill;
        ctx.fill();
        ctx.strokeStyle = this.stroke;
        let ctx2 = c.getContext("2d");
        ctx2.beginPath()
        ctx2.fillStyle = "white"
        ctx2.fillText(this.selfId, this.x, this.y);

        ctx.stroke();
        ctx.closePath();

    }
}
function line(x, y, x1, y1, parent, selfId) {

    this.x = x;
    this.y = y;

    this.x1 = x1;
    this.y1 = y1;
    this.parent = parent
    this.selfId = selfId

    this.draw = function () {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x1, this.y1);
        ctx.stroke();
        ctx.strokeStyle="grey"
        ctx.closePath();
    }
}

function move(e) {
    if (!isMouseDown) {
        return;
    }
    getMousePosition(e);
    //if any circle is focused
    if (focused.state) {
        let newCircles = []
        let newLines = []
        let previousPostionX = circles[focused.key].x
        let previousPostionY = circles[focused.key].x

        circles[focused.key].x = mousePosition.x;
        circles[focused.key].y = mousePosition.y;
        let newPostionX = mousePosition.x;
        let newPostionY = mousePosition.y

        graphValue.map(currentItem => {
            if (currentItem.id == circles[focused.key].selfId) {
                console.log(currentItem.id)
                currentItem.x = mousePosition.x / 50
                currentItem.y = mousePosition.y / 50
            }
            newCircles.push(new Circle(currentItem.x * 50, currentItem.y * 50, 30, "#25404E", "", true, currentItem.id))
            currentItem.child.map(children => {
                if (children.id == circles[focused.key].selfId) {
                    children.x = mousePosition.x / 50
                    children.y = mousePosition.y / 50
                }
                newLines.push(new line((currentItem.x * 50), currentItem.y * 50, ((children.x * 50)), children.y * 50, currentItem.id, children.id))
                newCircles.push(new Circle(children.x * 50, children.y * 50, 30, "#25404E", "", false, children.id))

            })
        })
        lines = newLines

        // console.log( circles[focused.key].parent)
        // if(circles[focused.key].parent){
        // lines.map((item,index) => {

        //     if(item.parent == circles[focused.key].selfId){
        //         console.log(item)
        //         item.x = circles[focused.key].x
        //         item.y = circles[focused.key].y
        //     }

        //     console.log(lines)
        // })
        previousPosition.innerHTML = "";
        previousPosition.append(previousPostionX + "" + previousPostionY)
        currentPosition.innerHTML = "";
        currentPosition.append(previousPostionX + "" + previousPostionY)
        draw();
        return;
    }
    //no circle currently focused check if circle is hovered
    for (var i = 0; i < circles.length; i++) {
        if (intersects(circles[i])) {
            circles.move(i, 0);
            focused.state = true;
            break;
        }
    }
    draw();

}

//set mousedown state
function setDraggable(e) {
    var t = e.type;
    if (t === "mousedown") {
        isMouseDown = true;
    } else if (t === "mouseup") {
        isMouseDown = false;
        releaseFocus();
    }
}

function releaseFocus() {
    focused.state = false;
}

function getMousePosition(e) {
    var rect = c.getBoundingClientRect();
    mousePosition = {
        x: Math.round(e.x - rect.left),
        y: Math.round(e.y - rect.top)
    }
}

//detects whether the mouse cursor is between x and y relative to the radius specified
function intersects(circle) {
    // subtract the x, y coordinates from the mouse position to get coordinates 
    // for the hotspot location and check against the area of the radius
    var areaX = mousePosition.x - circle.x;
    var areaY = mousePosition.y - circle.y;
    //return true if x^2 + y^2 <= radius squared.
    return areaX * areaX + areaY * areaY <= circle.r * circle.r;
}

Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
};
draw();
