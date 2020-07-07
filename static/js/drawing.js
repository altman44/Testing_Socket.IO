document.addEventListener("DOMContentLoaded", () => {
  const divDrawing = document.querySelector("#div-drawing-td");
  divDrawing.addEventListener("resize", () => {
    console.log("hey");
  });

  let draw = false;
  let points = [];
  let lines = [];
  let svg = null;
  let showDraw = true;
  render();

  function render() {
    console.log(divDrawing.clientWidth, divDrawing.clientHeight);
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
      //const builtPoints = catchDraw();
      const builtLines = catchDraw();
      console.log("------------------------");
      showDraw = false;
      socket.emit("draw", builtLines);
    });

    svg.on("mousemove", function () {
      if (!draw) {
        return;
      }
      const coords = d3.mouse(this);
      drawPoint(coords[0], coords[1], true);
    });

    document.querySelector("#erase").onclick = () => {
      for (i = 0; i < points.length; i++) {
        points[i].remove();
      }
      for (i = 0; i < lines.length; i++) {
        lines[i].remove();
      }
      points = [];
      lines = [];
    };
  }

//   function drawLine(lastPoint, x2, y2) {
//     if (showDraw) {
//       const line = svg
//         .append('line')
//         .attr('x1', lastPoint.attr("cx"))
//         .attr('y2', lastPoint.attr("cy"))
//         .attr('x2', x2)
//         .attr('y2', y2)
//         .style('stroke', 'black');
    
//         lines.push(line)
//     }
//     const point = svg
//       .append("circle")
//       .attr("cx", x2)
//       .attr("cy", y2)
//       .attr("r", 2)
//       .style("fill", 'black');

//     points.push(point);
//     drawLine(points[points.length - 1]);
//   }

  function drawPoint(x, y, connect) {
    const color = document.querySelector("#color-picker").value;
    const thickness = document.querySelector("#thickness-picker").value;

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
    }

    const point = svg
      .append("circle")
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", thickness)
      .style("fill", color);

    points.push(point);
  }

  function catchDraw() {
    //let builtPoints = [];
    // let builtPoint = {};
    // let builtCircle = {};
    let builtLines = [];
    let currentLine;
    // let currentPoint;

    lines.forEach((line) => {
      currentLine = line._groups[0][0];
      builtLine = stringifyLine(currentLine);
      builtLines.push(builtLine);
    });
    return builtLines;
    // points.forEach((point) => {
    //   //console.log(point);
    //   currentPoint = point._groups[0][0];
    //   //console.log(currentPoint.r);
    //   builtCircle = stringifyCircle(currentPoint);
    //   builtPoint = stringifyPoint(builtCircle);
    //   builtPoints.push(builtPoint);
    // });
    // return builtPoints;
  }

  function stringifyLine(currentLine) {
    return JSON.stringify({
      x1: currentLine.x1.baseVal.value,
      y1: currentLine.y1.baseVal.value,
      x2: currentLine.x2.baseVal.value,
      y2: currentLine.y2.baseVal.value,
      // style: currentLine.style
    });
  }

  function stringifyCircle(currentPoint) {
    return JSON.stringify({
      cx: currentPoint.cx.baseVal.value,
      cy: currentPoint.cy.baseVal.value,
      r: currentPoint.r.baseVal.value,
      // style: currentPoint.style
    });
  }

  function stringifyPoint(builtCircle) {
    return JSON.stringify({
      groups: builtCircle,
    });
  }

  socket.on("show draw", (data) => {
    if (showDraw) {
      let groups;
      //let connected = false;
      console.log(data);
    //   data.forEach((pt, index) => {
    //     pt = JSON.parse(pt);
    //     groups = JSON.parse(pt.groups);

    //     drawPoint(groups.cx, groups.cy, false);
    //   });
        let connected = false;
        data.forEach((line, index) => {
            line = JSON.parse(line);
            console.log(line)
            connected = true;
            //drawLine(line.x1, line.y1, line.x2, line.y2)
            if (index == 0) {
                connected = false;
                points = []
            }
            drawPoint(line.x2, line.y2, connected)
        })
    }
    //drawLine(data.x, data.y);
    showDraw = true;
  });
});
