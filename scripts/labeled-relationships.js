var links = [
    {"source":0,"target":"Algeria","value":2},
    {"source":0,"target":"Israel, West Bank, Gaza","value":16},
    {"source":0,"target":"Jordan","value":2},
    {"source":0,"target":"Kuwait","value":2},
    {"source":0,"target":"Lebanon","value":2},
    {"source":0,"target":"Tunisia","value":1},
    {"source":0,"target":"Yemen","value":2},
    {"source":1,"target":"Algeria","value":1},
    {"source":1,"target":"Bahrain","value":1},
    {"source":1,"target":"Israel, West Bank, Gaza","value":3},
    {"source":1,"target":"Morocco","value":1},
    {"source":1,"target":"Saudi Arabia","value":2},
    {"source":2,"target":"Algeria","value":2},
    {"source":2,"target":"Egypt","value":1},
    {"source":2,"target":"Iraq","value":12},
    {"source":2,"target":"Israel, West Bank, Gaza","value":8},
    {"source":2,"target":"Saudi Arabia","value":2},
    {"source":3,"target":"Algeria","value":1},
    {"source":3,"target":"Egypt","value":4},
    {"source":3,"target":"Israel, West Bank, Gaza","value":8},
    {"source":3,"target":"Jordan","value":2},
    {"source":3,"target":"Qatar","value":1},
    {"source":4,"target":"Algeria","value":2},
    {"source":4,"target":"Egypt","value":2},
    {"source":4,"target":"Iraq","value":1},
    {"source":4,"target":"Israel, West Bank, Gaza","value":3},
    {"source":4,"target":"Jordan","value":1},
    {"source":4,"target":"Lebanon","value":5},
    {"source":4,"target":"Saudi Arabia","value":1},
    {"source":4,"target":"Yemen","value":2},
    {"source":5,"target":"Algeria","value":6},
    {"source":5,"target":"Israel, West Bank, Gaza","value":8},
    {"source":5,"target":"Lebanon","value":3},
    {"source":5,"target":"Morocco","value":4},
    {"source":5,"target":"Saudi Arabia","value":2},
    {"source":5,"target":"Yemen","value":1},
    {"source":6,"target":"Algeria","value":5},
    {"source":6,"target":"Iraq","value":15},
    {"source":6,"target":"Israel, West Bank, Gaza","value":12},
    {"source":6,"target":"Lebanon","value":5},
    {"source":6,"target":"Tunisia","value":1},
    {"source":6,"target":"Yemen","value":6},
    {"source":7,"target":"Algeria","value":4},
    {"source":7,"target":"Egypt","value":3},
    {"source":7,"target":"Iraq","value":3},
    {"source":7,"target":"Israel, West Bank, Gaza","value":27},
    {"source":7,"target":"Saudi Arabia","value":1},
    {"source":7,"target":"Yemen","value":3},
    {"source":8,"target":"Algeria","value":3},
    {"source":8,"target":"Iraq","value":11},
    {"source":8,"target":"Israel, West Bank, Gaza","value":3},
    {"source":8,"target":"Palestinian Territories","value":4},
    {"source":8,"target":"Jordan","value":3},
    {"source":8,"target":"United Arab Emirates","value":1},
    {"source":8,"target":"Yemen","value":8},
    {"source":9,"target":"Bahrain","value":1},
    {"source":9,"target":"Iraq","value":14},
    {"source":9,"target":"Israel, West Bank, Gaza","value":7},
    {"source":9,"target":"Lebanon","value":7},
    {"source":9,"target":"Morocco","value":1},
    {"source":9,"target":"Algeria","value":5},
    {"source":9,"target":"Yemen","value":16},
    {"source":10,"target":"Bahrain","value":6},
    {"source":10,"target":"Iraq","value":9},
    {"source":10,"target":"Lebanon","value":6},
    {"source":10,"target":"Saudi Arabia","value":1},
    {"source":10,"target":"Yemen","value":23} 
];

var nodes = {};

// Compute the distinct nodes from the links.
links.forEach(function(link) {
  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
});

var width = 960,
    height = 500;

var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(60)
    .charge(-300)
    .on("tick", tick)
    .start();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// Per-type markers, as they don't inherit styles.
svg.append("defs").selectAll("marker")
    .data(["suit", "licensing", "resolved"])
  .enter().append("marker")
    .attr("id", function(d) { return d; })
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("path")
    .attr("d", "M0,-5L10,0L0,5");

var path = svg.append("g").selectAll("path")
    .data(force.links())
  .enter().append("path")
    .attr("class", function(d) { return "link " + d.type; })
    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

var circle = svg.append("g").selectAll("circle")
    .data(force.nodes())
  .enter().append("circle")
    .attr("r", 6)
    .call(force.drag);

var text = svg.append("g").selectAll("text")
    .data(force.nodes())
  .enter().append("text")
    .attr("x", 8)
    .attr("y", ".31em")
    .text(function(d) { return d.name; });

// Use elliptical arc path segments to doubly-encode directionality.
function tick() {
  path.attr("d", linkArc);
  circle.attr("transform", transform);
  text.attr("transform", transform);
}

function linkArc(d) {
  var dx = d.target.x - d.source.x,
      dy = d.target.y - d.source.y,
      dr = Math.sqrt(dx * dx + dy * dy);
  return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
}

function transform(d) {
  return "translate(" + d.x + "," + d.y + ")";
}
