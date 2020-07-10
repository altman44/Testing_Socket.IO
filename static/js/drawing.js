document.addEventListener("DOMContentLoaded", () => {
  let draw = false;
  let allPoints = [];
  let allLines = [];
  let points = [];
  let lines = [];
  let svg = null;
  let showDrawing = true;
  let erasingShowed = false;
  // let drawingPromises = []; // this will contain promises to wait the point being draw to keep with the other one
  let drawingPromise;

  render();

  function render() {
    // Create the selection area
    svg = d3.select("#draw").attr("height", "100%").attr("width", "100%");

    svg.on("mousedown", async function () {
      draw = true;
      const coords = d3.mouse(this);
      x = coords[0];
      y = coords[1];
      const thickness = document.querySelector("#thickness-picker").value;
      const color = document.querySelector("#color-picker").value;
      const connected = false;
      //await drawPoint(x, y, connected);
      points = [];
      socket.emit("draw", { x, y, connected, thickness, color });
    });

    // svg.on("mouseup", () => {
    document.addEventListener("mouseup", () => {
      draw = false;
      points = [];
      // const { built, shape } = catchDraw();
      // showDrawing = false;
      // points = [];
      // socket.emit("draw", { built, shape });
      showDrawing = false;
      socket.emit("stop drawing");
    });

    svg.on("mousemove", async function () {
      if (!draw) {
        return;
      }
      const coords = d3.mouse(this);
      const x = coords[0];
      const y = coords[1];
      const thickness = document.querySelector("#thickness-picker").value;
      const color = document.querySelector("#color-picker").value;
      const connected = true;
      //let allowedToContinue = false;
      //while (!allowedToContinue) {

      await drawPoint(x, y, connected, thickness, color);
      showDrawing = false;
      socket.emit("draw", { x, y, connected, thickness, color });
      //}
      //const { built, shape } = catchDraw();
    });

    document.querySelector("#erase").onclick = () => {
      for (i = 0; i < allPoints.length; i++) {
        allPoints[i].remove();
      }
      for (i = 0; i < allLines.length; i++) {
        allLines[i].remove();
      }
      allPoints = [];
      allLines = [];

      if (!erasingShowed) {
        socket.emit("erase drawing");
      }
    };
  }

  function drawPoint(x, y, connect, thickness, color) {
    drawingPromise = new Promise((resolve, reject) => {
      // Thickness and color
      if (!thickness) {
        thickness = document.querySelector("#thickness-picker").value;
      }
      if (!color) {
        color = document.querySelector("#color-picker").value;
      }

      // Is the last point connected with the current one?
      if (connect && points.length) {
        const lastPoint = points[points.length - 1];
        console.log("Last: ", lastPoint.attr("cx"), lastPoint.attr("cy"));
        const line = svg
          .append("line")
          .attr("x1", lastPoint.attr("cx"))
          .attr("y1", lastPoint.attr("cy"))
          .attr("x2", x)
          .attr("y2", y)
          .attr("stroke-width", thickness * 2)
          .style("stroke", color);

        lines.push(line);
        allLines.push(line);
      }

      const point = svg
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", thickness)
        .style("fill", color);

      points.push(point);
      console.log("x & y: ", x, y);
      allPoints.push(point);
      resolve(0);
    });
    //drawingPromises.push(newDrawingPromise);
    //return newDrawingPromise;
    return drawingPromise;
  }

  // function catchDraw() {
  //   let built = [];
  //   let shape = "points";
  //   let builtPoint = {};
  //   let builtCircle = {};
  //   let currentPoint;

  //   points.forEach((point) => {
  //     currentPoint = point._groups[0][0];
  //     builtCircle = stringifyCircle(currentPoint);
  //     builtPoint = stringifyPoint(builtCircle);
  //     built.push(builtPoint);
  //   });

  //   if (lines.length) {
  //     shape = "lines";
  //   }
  //   return { built, shape };
  // }

  // function stringifyCircle(currentPoint) {
  //   return JSON.stringify({
  //     cx: currentPoint.cx.baseVal.value,
  //     cy: currentPoint.cy.baseVal.value,
  //     r: currentPoint.r.baseVal.value,
  //     style: currentPoint.style,
  //   });
  // }

  // function stringifyPoint(builtCircle) {
  //   return JSON.stringify({
  //     groups: builtCircle,
  //   });
  // }

  socket.on("show draw", (data) => {
    if (showDrawing) {
      //let circle;
      //let connected = false;

      drawPoint(data.x, data.y, data.connected, data.thickness, data.color);

      // data.built.forEach((pt, index) => {
      //   pt = JSON.parse(pt);
      //   circle = JSON.parse(pt.groups);
      //   connected = false;
      //   //if (data.shape === "lines") {
      //     //connected = true;
      //   //}
      //   console.log(circle)

      //   // drawPoint(circle.cx, circle.cy, connected, circle.r, circle.style.fill);
      //   // if (index == data.built.length - 1) {
      //   //   points = [];
      //   //   lines = [];
      //   // }
      // });
    }
    showDrawing = true;
  });

  socket.on("stop drawing", () => {
    if (showDrawing) {
      points = [];
    }
  });

  socket.on("show erasing", () => {
    console.log("show erasing");
    //if (!erasingShowed) {
    erasingShowed = true;
    document.querySelector("#erase").click();
    erasingShowed = false;
    //}
  });
});
