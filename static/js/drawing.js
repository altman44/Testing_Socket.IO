document.addEventListener("DOMContentLoaded", () => {
  let draw = false;
  let allPoints = [];
  let allLines = [];
  let points = [];
  let lines = [];
  let svg = null;
  let showDrawing = true;
  let erasingShowed = false;

  const divDrawing = document.querySelector("#div-drawing-td");
  divDrawing.addEventListener("resize", () => {
    console.log("hey");
  });

  render();

  function render() {
    // Create the selection area
    svg = d3
      .select("#draw")
      .attr("height", divDrawing.clientHeight)
      .attr("width", divDrawing.clientWidth);

    svg.on("mousedown", function () {
      draw = true;
      const coords = d3.mouse(this);
      drawPoint(coords[0], coords[1], false);
    });

    svg.on("mouseup", () => {
      draw = false;
      const { built, shape } = catchDraw();
      showDrawing = false;
      points = [];
      socket.emit("draw", { built, shape });
    });

    svg.on("mousemove", function () {
      if (!draw) {
        return;
      }
      const coords = d3.mouse(this);
      drawPoint(coords[0], coords[1], true);
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
      } else {
          erasingShowed = false;
      }
    };
  }

  function drawPoint(x, y, connect, thickness, color) {
    if (!thickness) {
      thickness = document.querySelector("#thickness-picker").value;
    }
    if (!color) {
      color = document.querySelector("#color-picker").value;
    }

    if (connect && points.length) {
      const lastPoint = points[points.length - 1];
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
    allPoints.push(point);
  }

  function catchDraw() {
    let built = [];
    let shape = "points";
    let builtPoint = {};
    let builtCircle = {};
    let currentPoint;

    points.forEach((point) => {
      currentPoint = point._groups[0][0];
      builtCircle = stringifyCircle(currentPoint);
      builtPoint = stringifyPoint(builtCircle);
      built.push(builtPoint);
    });

    if (lines.length) {
      shape = "lines";
    }
    return { built, shape };
  }

  function stringifyCircle(currentPoint) {
    return JSON.stringify({
      cx: currentPoint.cx.baseVal.value,
      cy: currentPoint.cy.baseVal.value,
      r: currentPoint.r.baseVal.value,
      style: currentPoint.style,
    });
  }

  function stringifyPoint(builtCircle) {
    return JSON.stringify({
      groups: builtCircle,
    });
  }

  socket.on("show draw", (data) => {
    if (showDrawing) {
      let circle;
      let connected = false;

      data.built.forEach((pt, index) => {
        pt = JSON.parse(pt);
        circle = JSON.parse(pt.groups);
        connected = false;
        if (data.shape == "lines") {
          connected = true;
        }
        drawPoint(circle.cx, circle.cy, connected, circle.r, circle.style.fill);
        if (index == data.built.length - 1) {
          points = [];
          lines = [];
        }
      });
    }
    showDrawing = true;
  });

  socket.on("show erasing", () => {
    console.log("show erasing");
    //if (!erasingShowed) {
      document.querySelector("#erase").click();
      erasingShowed = true;
    //}
  });
});
