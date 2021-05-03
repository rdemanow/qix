let nSlider, cSlider;
function setup() {
  pageWidth = document.getElementById("qixCanvas").clientWidth;
  qixWidth = Math.trunc(pageWidth * 0.8);
  qixHeight = Math.trunc(2*qixWidth/3);

  const qCanv = createCanvas(qixWidth, qixHeight);
  qCanv.parent(document.getElementById('qixCanvas'));
  
  nSlider = createSlider(10, 200, 40);
  cSlider = createSlider(1, 100, 10);
  nSlider.parent(document.getElementById('qixNSlider'));
  cSlider.parent(document.getElementById('qixCSlider'));
}      

function qix() {
  let lines = [];
  const qixDelta = 10;
  
  //start each side at random points
  lines.push([
    {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height)
    },
    {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height)
    },
    {
      red: 255,
      green: 255,
      blue: 255
    },
  ]);
  
  //random slope
  let delta1 = {
    x: Math.ceil(Math.random() * qixDelta),
    y: Math.ceil(Math.random() * qixDelta)
  };
  let delta2 = {
    x: Math.ceil(Math.random() * qixDelta),
    y: Math.ceil(Math.random() * qixDelta)
  };
    
  //Check bounds and randomize delta if necessary
  let check = function(position,delta,against) {
    if(position < 0) { //new delta needs to be positive
      return Math.ceil(Math.random() * qixDelta);//random(0,10);
    } else if (position > against){//new delta needs to be negative
      return -Math.ceil(Math.random() * qixDelta);//random(-10,0);
    } else {//no change to delta
      return delta;
    }
  };
  
  let numLines = nSlider.value();
  let i = 0;  
  let newRed = 255;
  let newGreen = 255;
  let newBlue = 255;
  let nLinesPerColor = cSlider.value();
  
  draw = function() {
    background(0,0,0);
    
    //draw the lines
    lines.forEach(endpoint => {
      stroke(endpoint[2].red, endpoint[2].green, endpoint[2].blue);
      line(endpoint[0].x, endpoint[0].y, endpoint[1].x, endpoint[1].y);
    });

    i++;
    if (i % nLinesPerColor == 0) {
      newRed = Math.floor(Math.random() * 255);
      newGreen = Math.floor(Math.random() * 255);
      newBlue = Math.floor(Math.random() * 255);
      i = 0;
    }
    //increment the endpoints and put the new
    //points at the front
    lines.unshift(
      [
        {
          x: lines[0][0].x + delta1.x,
          y: lines[0][0].y + delta1.y
        },
        {
          x: lines[0][1].x + delta2.x,
          y: lines[0][1].y + delta2.y
        },
        {
          red: newRed,
          green: newGreen,
          blue: newBlue
        }
      ]
    );
    
    //and, so the arrays don't get ridiculously large
    while(lines.length > numLines) {
      lines.pop();
    }
    
    //check to see if we need to bounce off a wall
    //if we do, invert the slope and randomize
    delta1.x = check(lines[0][0].x, delta1.x, qixWidth);
    delta1.y = check(lines[0][0].y, delta1.y, qixHeight);
    delta2.x = check(lines[0][1].x, delta2.x, qixWidth);
    delta2.y = check(lines[0][1].y, delta2.y, qixHeight);

    //check to see if the sliders have been adjusted
    numLines = nSlider.value();
    nLinesPerColor = cSlider.value();

    //output the slider values to the HTML
    document.getElementById("NL").innerText = `Lines: ${numLines}`;
    document.getElementById("NLPC").innerText = `Lines per Color: ${nLinesPerColor}`;
  };
  
}

