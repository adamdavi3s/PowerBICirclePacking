
function loadcirclepacking(element, value, width,height) {
	

//****************************************************************************************************************
//start your extension code here	
//****************************************************************************************************************

// This code appears in most D3 extensions which require data in a JSON format
//therefore lets just reuse it to create the data in the correct format rather than re-inventing the wheel
//start copied code here
var data = [];
var nodesArray = [];
var parents = [];
var selectedNode = '';
var showValues = false;
var selectedNodes = [];
var parentTitles = '';

for (var f = 0; f < value.length; f++) {
    var row = value[f];
	
    //shove this into our node:
    var node = [{"name": row[1]}, { "parent": row[0]}, {"size": row[2]}];

    nodesArray.push(node);
    parents.push(row[0]);
}


//fancy code which builds our hierarchy for us
//start fancy code

var uniqueParents = parents.filter(function(itm, i, a) {
    return i == a.indexOf(itm);

});



if (uniqueParents.length == 0) {
    nodesArray.push([{
        "name": uniqueParents[0]
    }, {
        "parent": '-'
    }, {
        "size": 1
    }]);

} else {
    if (selectedNode) {
        for (var i = 0; i < uniqueParents.length; i++) {
            if (uniqueParents[i] == selectedNode) {
                nodesArray.push([{
                    "name": uniqueParents[i]
                }, {
                    "parent": '-'
                }, {
                    "size": 1
                }]);

            }
        }
    }

}


var nodesJson = createJSON(nodesArray);







function createJSON(Data) {
    var happyData = Data.map(function(d) {
        return {
            name: d[0].name,
            parent: d[1].parent,
            size: d[2].size
        };
    });


    function getChildren(name) {
        return happyData.filter(function(d) {
                return d.parent === name;
            })
            .map(function(d) {
                var values = '';
                if (showValues == true) {
                    values = ' (' + parseInt(d.size).toLocaleString() + ')';
                }
                return {
                    name: d.name + '' + values,
                    size: d.size,
                    children: getChildren(d.name)
                };
            });
    }
    return getChildren('-')[0];
}

function traverse(o) {
    for (i in o) {
        if (typeof(o[i]) == "object") {
            if (o[i].name) {
                selectedNodes.push((o[i].name));
            }

            traverse(o[i]);
        }
    }
}

function removeProp(obj, propName) {
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            if (p == propName) {
                delete obj[p];
            } else if (typeof obj[p] == 'object') {
                removeProp(obj[p], propName);
            }
        }
    }
    return obj;
}

// end fancy code here		



var root=nodesJson;



//add some basic niceties to resize the object in the window
var diameter = Math.min(width,height);
var margin = diameter / 30;


var color = d3.scale.linear()
    .domain([-1, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);




var pack = d3.layout.pack()
    .padding(2)
    .size([diameter - margin, diameter - margin])
    .value(function(d) {
        return d.size;
    })

var chart = element
    .append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .append("g")
    .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");


var focus = root,
    nodes = pack.nodes(root),
    view;

var circle = chart.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
   .attr("class", function(d) {
        return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
    }) 
    .style("fill", function(d) {
        return d.children ? color(d.depth) : null;
    })
    .on("click", function(d) {
        if (focus !== d) zoom(d), d3.event.stopPropagation();
    });

	
var text = chart.selectAll("text")
    .data(nodes)
    .enter().append("text")
    .attr("class", "label")
    .style("fill-opacity", function(d) {
        return d.parent === root ? 1 : 0;
    })
    .style("display", function(d) {
        return d.parent === root ? "inline" : "none";
    })
    .text(function(d) {
        return d.name;
    });

var node = chart.selectAll("circle,text");

d3.select("body")
    .style("maincircle", color(-1))
    .on("click", function() {
        zoom(root);
    });

zoomTo([root.x, root.y, root.r * 2 + margin]);

function zoom(d) {
    var focus0 = focus;
    focus = d;

    var transition = d3.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", function(d) {
            var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
            return function(t) {
                zoomTo(i(t));
            };
        });

    transition.selectAll("text")
        .filter(function(d) {
            return d.parent === focus || this.style.display === "inline";
        })
        .style("fill-opacity", function(d) {
            return d.parent === focus ? 1 : 0;
        })
        .each("start", function(d) {
            if (d.parent === focus) this.style.display = "inline";
        })
        .each("end", function(d) {
            if (d.parent !== focus) this.style.display = "none";
        });
}

function zoomTo(v) {
    var k = diameter / v[2];
    view = v;
    node.attr("transform", function(d) {
        return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
    });
    circle.attr("r", function(d) {
        return d.r * k;
    });
}



d3.select(self.frameElement).style("height", diameter + "px");




//end the D3 code here
	
			
			
//****************************************************************************************************************
//end your extension code here
//****************************************************************************************************************

}