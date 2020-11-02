var graph = {"nodes":[ {"name":1}, {"name":10}, {"name":2}, {"name":5}, {"name":4}, {"name":3}, {"name":9}, {"name":6}, {"name":7}, {"name":8}],"links":[]}; 
var ties = {"10":2, "1":2, "2":5, "5":4, "4":3, "3":6, "6":9, "9":7, "7":8};
var dict = {};
var vs = {};
var k = 2;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(k*25);

var svg = d3.select("body").append("svg");
	
	
	graph.nodes.forEach(function(object, index){
		var num = +object.name;
		dict[num] = index;
		d3.range(11).forEach(function(d, i) { 
			if (!i) { return;}
			
			var nums = num>i? i +"x"+num : num +"x"+i;
			// console.log(nums);
			var name = num+"×"+i;
			
			var lastarr = graph.nodes.push({"name":name, "group":"2", "value":num*i, "base":num, "mty":i, "nums":nums, "f": vs[nums]?1:0});
			vs[nums] = 1;
			var cur_index = lastarr-1;
			dict[name] = cur_index;
			graph.links.push({"source":cur_index,"target":index, "type":1});
		});
	});
	
	for(o in ties){ graph.links.push({"source":dict[o],"target":dict[ties[o]]});};
	

	graph.links.forEach(function(link, index, list) {
        if (typeof graph.nodes[link.source] === 'undefined') {
            console.log('undefined source', link);
        }
        if (typeof graph.nodes[link.target] === 'undefined') {
            console.log('undefined target', link);
        }
    });	
	
	

  force
      .nodes(graph.nodes)
      // .links(graph.links)
      .links([])
	  .on("tick", tick)
      .start();

setTimeout(function() {
  force.links(graph.links)      
      .start();
}, 3000);

setTimeout(function() {
  // force.nodes([])
  // force.nodes(graph.nodes.filter(function(d) { return d.f; }))
      // .start();
}, 6000);	  
	  
  var link = svg.selectAll("line.link")
    .data(graph.links)
    .enter().append("svg:line")
    .attr("class", "link")
    .style("stroke-width", function(d) { return Math.sqrt(d.value); })
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; })
    .attr("marker-end", function(d) {
		return d.type?null:"url(#arrowGray)"; 
	})
	.style("opacity", 0)
    .on("click", function(d) {
    });

    var defs = svg.append('defs')
    defs.append("svg:marker")
		.attr("id", "arrowGray")
		.attr("viewBox","0 0 10 10")
		.attr("refX","20")
		.attr("refY","5")
		.attr("markerUnits","strokeWidth")
		.attr("markerWidth",9*k)
		.attr("markerHeight",5*k)
		.attr("orient","auto")
		.append("svg:path")
		.attr("d","M 0 0 L 10 5 L 0 10 z")
		.attr("fill", "#BBBBBB");

var nodes = svg.selectAll('.node')
		.data(graph.nodes)
		// .data(graph.nodes, function(d) { return d.id; })
		.enter()
		.append('g')		
		.attr('class', 'node')		
		.on("mouseover", function(d) {
			 // console.log("node mouseover");			 
		})
		.style("opacity", 0)
		.call(force.drag);	
		
		nodes
		.transition()
		// .delay ( function ( d , i ) { return i * (200-i) ; })
		.each(function (d,i){
			// console.log(d);
			return d;
		})
		.duration ( 500 )
		.call(endall, function() { 
			console.log("all done"); 
			link
			.transition()
			// .delay (10)
			.duration ( 3000 )
			.style("opacity", 1);
		})
        // .duration(3000)
        .style("opacity", 1);		
		
		  
		  
			
   var circles = nodes
      // .data(graph.nodes)
      // .enter()
	  .append("circle")
	  .attr("class", function(d) { return "res"+d.value+ " n"+d.nums + (d.f?" del":"") + " base"+d.base + " m"+d.mty; })
      .attr("r", 5*k)
      .style("fill", function(d) { return color(d.group); });
	  
	  svg.on("click", function(d) {
		  return;
		  var Arr2Remove = ['.del', '.base10', '.base1', '.m1', '.m10'];
		  
		  Arr2Remove.forEach(function(e) {
			d3.selectAll(e).each(function(nd, b) {
				// console.log(d3.select(this.parentNode));
				d3.select(this.parentNode).remove();
			});
		  });
			
		console.log(d3.selectAll('circle')[0].length-10);
		
		  d3.selectAll("line.link").each(function(nd, b) {
				// console.log(this);
				// console.log(d3.select(this));
				// d3.select(this.parentNode).remove();
			});

		// start();
			
	  });
	  
	  nodes.on("click", function(d) {
		  if (!d.group) { return; }
		  console.log(d.nums, d.value);
		  
		  d3.selectAll('.'+"n"+d.nums)
			.classed('dup', true)
			.classed ("res"+d.value, false)
			
			// d3.select(this)
			.remove();

		  d3.selectAll('.same').classed("same", false);
		  d3.selectAll('.'+"res"+d.value).classed("same", true);
    });
      

	// node.append("title")
      // .text(function(d) { return d.name; });

	nodes.append('text')
	// .attr('class', function(d) { 
		// return ""+d.group?"def":"children";
	// })
	.text(function(d) { 
		return d.name;
	})
	.attr('dy', '0.35em')
	.attr('dx', '0em')
	.style("fill", function(d) { return d.group? "red":"yellow"; })
	.style('font-size', function(d) {
		// console.log(d.name);
		if (d.name == '10') {
			return 8*k+"px";
		} else if (d.name.length > 3){
			return 5*k+"px";
		}
		return (d.group?6*k:10*k+'px');
    });
	
	  
	resize();
	d3.select(window).on("resize", resize);

function start() {
  // link = link.data(force.links(), function(d) { return d.source.id + "-" + d.target.id; });
  // link.enter().insert("line", ".node").attr("class", "link");
  // link.exit().remove();

  // node = node.data(force.nodes(), function(d) { return d.id;});
  // node.enter().append("circle").attr("class", function(d) { return "node " + d.id; }).attr("r", 8);
  // node.exit().remove();

  force.start();
}
	
	function endall(transition, callback) { 
		var n = 0; 
		transition 
			.each(function() { ++n; }) 
			.each("end", function() { if (!--n) callback.apply(this, arguments); }); 
	} 
	  
   function tick() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
	svg.selectAll('.node').attr('transform', function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    // node.attr("cx", function(d) { return d.x; })
		// .attr("cy", function(d) { return d.y; });
  }
  function resize() {
    width = window.innerWidth, height = window.innerHeight;
    svg.attr("width", width).attr("height", height);
    force.size([width, height]).resume();
  }