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

var canvas = document.getElementById("myCanvas");
var previousPosition = document.getElementById("previousPostion")
var currentPosition = document.getElementById("currentPosition")
var mainCanvas = canvas.getContext("2d");
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
function drawGraph() {
    start = 50;
    for (i = 1; i <= 11; i++) {
        const graphXAxis = canvas.getContext("2d");
        graphXAxis.strokeStyle = "white"
        graphXAxis.beginPath();
        graphXAxis.moveTo(50, start * i);
        graphXAxis.lineTo(550, start * i);
        graphXAxis.stroke();
        graphXAxis.lineWidth = 2
        graphXAxis.closePath();

        const graphYAxis = canvas.getContext("2d");
        graphYAxis.strokeStyle = "white"
        graphYAxis.beginPath();
        graphYAxis.moveTo(start * i, 50);
        graphYAxis.lineTo(start * i, 550);
        graphYAxis.stroke();
        graphYAxis.closePath();

        const graphAxisTitle = canvas.getContext("2d");
        graphAxisTitle.beginPath();
        graphAxisTitle.fillText(0, 40, 550);
        graphAxisTitle.fillText(0, 50, 560);
        if ((11 - i) % 2 == 0) {
            graphAxisTitle.fillText(11 - i, 40, 50 * i);
        }
        if (i % 2 == 0) {
            graphAxisTitle.fillText(i, 50 * i, 560);

        }
        graphAxisTitle.fillStyle = "black"
        graphAxisTitle.closePath()
    }
}

function draw() {
    mainCanvas.clearRect(0, 0, canvas.width, canvas.height);
    drawGraph()
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
}

//key track of circle focus and focused index
var focused = {
    key: 0,
    state: false
}
//circle Object
function Circle(x, y, r, fill, stroke, parent, selfId) {
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
        const circle = canvas.getContext("2d")
        circle.beginPath();
        circle.arc(this.x, this.y, this.r, this.startingAngle, this.endAngle);
        circle.fillStyle = this.fill;
        circle.fill();
        circle.strokeStyle = this.stroke;
        let circleTitle = canvas.getContext("2d");
        circleTitle.beginPath()
        circleTitle.fillStyle = "white"
        circleTitle.fillText(this.selfId, this.x, this.y);
        circle.stroke();
        circle.closePath();

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
        const line = canvas.getContext("2d")
        line.beginPath();
        line.moveTo(this.x, this.y);
        line.lineTo(this.x1, this.y1);
        line.stroke();
        line.strokeStyle = "grey"
        line.closePath();
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
    var rect = canvas.getBoundingClientRect();
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
