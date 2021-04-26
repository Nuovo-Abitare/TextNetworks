
$(document).ready(function () {

	setupinterface();
});


var stopwords = null;
var filetoload = "";
var titleviz = "";


var graph = null;

var ga = null;

var minb = 99999999;
var maxb = -99999999;

function setupinterface(){


	$("#vizclose").click(function(){
		$("#vizholder").fadeIn(function(){
			$("#viz").html("");
			$("#vizholder").css("display","none");
		});
	});


	$("#resTotaleTesti").click(function(){
		ga = null;
		visualize("Titolo della visualizzazione","dati/i_dati.txt");
	});



}



function visualize(title,file){
	
	graph = new Object();
	graph.nodes = new Array();
	graph.links = new Array();

	ga = new jsnx.Graph();

	minb = 99999999;
	maxb = -99999999;

	filetoload = file;
	titleviz = title;
	d3.json("dati/stopwords.json",function(data){
		stopwords = data;
		d3.text(filetoload,function(data){
			//var lines = data.split("\n");
			var lines = data.split(/[\n.;]/g);
			
			lines.forEach(function(l){
				var allparts = new Array();
				l = l.replace(/[^0-9a-zA-Zàòùèéì]/g, ' ');
				var parts = l.split(" ");
				parts.forEach(function(pp,idx,a){
					a[idx] = pp.trim().toLowerCase();
					allparts.push( a[idx] );
				});
				for(var i = 0; i<allparts.length ; i++){
					if(allparts[i]!="" && !isstopword(allparts[i]) ){
						var idx1 = addnode(allparts[i]);
						for(var j = i+1; j<allparts.length ; j++){
							if(allparts[j]!="" && !isstopword(allparts[j])){
								//var idx2 = addnode(allparts[j]);
								addrel(allparts[i],allparts[j]);
							}
						}
					}	
				}
			});
			
			

			for(var i = 0; i<graph.nodes.length; i++){
				graph.nodes[i].id = i;
			}

			for(var i = 0; i<graph.links.length; i++){
				var f = -1;
				for(var j=0; j<graph.nodes.length && f==-1; j++){
					if(graph.nodes[j].word==graph.links[i].source){
						f = j;
						graph.links[i].source = f;
					}
				}
				f = -1;
				for(var j=0; j<graph.nodes.length && f==-1; j++){
					if(graph.nodes[j].word==graph.links[i].target){
						f = j;
						graph.links[i].target = f;
					}
				}
			}

			for(var i = 0; i<graph.nodes.length; i++){
				ga.addNode( graph.nodes[i].id , { word: graph.nodes[i].word });
			}
			for(var i = 0; i<graph.links.length; i++){
				ga.addEdge( graph.links[i].source , graph.links[i].target	 );
			}

			
			var map = jsnx.betweennessCentrality(ga , { normalized: true , weight: "weight" });

			console.log(map._numberValues);

			for(var i = 0; i<graph.nodes.length; i++){
				graph.nodes[i].betweenness = map._numberValues[i];
				if( map._numberValues[i]<minb ){
					minb = map._numberValues[i];
				}
				if( map._numberValues[i]>maxb ){
					maxb = map._numberValues[i];
				}
			}

			console.log(graph);

			
			$("#viz").html("");
			$("#vizholder").fadeIn(function(){
				createGraph(graph,true);
			});

		});
	});

}


function addnode(w){
	var idx = -1;
	for(var i = 0; i<graph.nodes.length && idx==-1; i++){
		if(w==graph.nodes[i].id){
			idx = i;
			graph.nodes[i].weight++;
		}
	}
	if(idx==-1){
		var o = new Object();
		o.id = w;
		o.word = w;
		o.weight = 1;
		graph.nodes.push( o );
	}
}


function addrel(w1,w2){
	var idx = -1;
	for(var i = 0; i<graph.links.length && idx==-1; i++){
		if(    
			( w1==graph.links[i].source  && w2==graph.links[i].target )
			||
			( w2==graph.links[i].source  && w1==graph.links[i].target )
		){
			idx = i;
			graph.links[i].weight++;
		}
	}
	if(idx==-1){
		var o = new Object();
		o.source = w1;
		o.target = w2;
		o.weight = 1;
		graph.links.push( o );
	}
}



function isstopword(w){
	var r = false;
	if(stopwords!=null){
		for(var i=0;i<stopwords.length&&!r;i++){
			if(w==stopwords[i]){
				r = true;
			}
		}
	}
	return r;
}



var ugwidth, ugheight;
var ugcolor;
var ugforce;
var ugsvg1,ugsvg;
var maxnu = 1;
var maxn = 1;
var maxstroke = 1;

var selectedid = null;

function redrawusers() {
    //console.log("here", d3.event.translate, d3.event.scale);
    ugsvg.attr("transform",
        "translate(" + d3.event.translate + ")"
        + " scale(" + d3.event.scale + ")");
}

function createGraph(gg,clearGraph){

	var maxn = 0;
	maxstroke = 0.0001;

        $("#viz").html("");
        ugwidth = $("#viz").width();
        ugheight = $("#viz").height();

        $("#viz").height( ugheight );

        ugcolor = d3.scale.category20();

        ugforce = d3.layout.force()
          //.linkDistance(40)
          //.linkStrength(0.5)
          //.charge(-90)
          .size([ugwidth, ugheight]);

        ugforce.drag()
          .on("dragstart", function() { d3.event.sourceEvent.stopPropagation(); });

        ugsvg1 = d3.select("#viz").append("svg")
          .attr("width", ugwidth)
          .attr("height", ugheight)
          .attr("pointer-events", "all");

        ugsvg = ugsvg1
          .append('svg:g')
          .call(d3.behavior.zoom().on("zoom", redrawusers))
          .append('svg:g');


          ugsvg
          .append('svg:rect')
          .attr('x', -10000)
          .attr('y', -10000)
          .attr('width', 20000)
          .attr('height', 20000)
          .attr('fill', 'black')
          .attr('opacity', 0);


            var nodes = gg.nodes.slice(),
              links = [],
              bilinks = [];

            maxnu = 1;

            
            gg.links.forEach(function(link) {


            	var wl = link.weight;
            	if(wl>maxstroke){
              		maxstroke = wl;
              	}
                
                var founds = false;
                var foundt = false;
                for(var k = 0; k<nodes.length && (!founds || !foundt); k++){
                    if(nodes[k].id==link.source){
                        founds = true;
                        link.source = k;
                    }
                    if(nodes[k].id==link.target){
                        foundt = true;
                        link.target = k;
                    }
                }
                
              var s = nodes[link.source],
                  t = nodes[link.target],
                  i = {n: 1, weight: 1}; // intermediate node

              nodes.push(i);
              
              if( typeof s != 'undefined'  && typeof t != 'undefined' ){
              	links.push({source: s, target: i  }, {source: i, target: t });
              	bilinks.push([s, i, t, wl]);
              }


            });

            // console.log(nodes);
            // console.log(links);
            // console.log(bilinks);

            ugforce
              .nodes(nodes)
              .links(links)
              .start();


            var link = ugsvg.selectAll(".link")
              .data(bilinks)
              .enter().append("path")
              .attr("class", "link")
              .attr("id", function(d){
              	return "link-" + d[0].id + "-" + d[2].id;
              })
              .attr("stroke-width", function(d){
              	//console.log(d[3] / maxstroke );
              	return d[3]/maxstroke;
              });
              //.attr("stroke",function(d){ return "#ffffff"; });


            var node = ugsvg.selectAll(".node")
              .data(gg.nodes);


            var nodeEnter = node
                            .enter()
                            .append("svg:g")
                            .attr("class", "node")
                            .attr("id", function(d){
                            	return "node-" + d.id;
                            })
                            .call(ugforce.drag);


            nodeEnter.append("circle")
              .attr("r", function(d){ return Math.min(ugwidth/35, Math.max(8,150*d.betweenness)); })
              .attr("id",function(d){ return "circle-" + d.id;  });
              //.style("fill", function(d) { return getNodeColor(d.type); });



            
            var ugtexts = nodeEnter.append("svg:text")
              .attr("class", "nodetext")
              .attr("id",function(d){  return "label-" + d.id; })
              .attr("dx", function(d){  return 0; })
              .attr("dy", "0")
              //.style("font-size",function(d){ return Math.min(ugwidth/10, Math.max(10,0.4*d.weight)); })
              .attr("opacity",function(d){
              	var o = 0;
              	if( d.betweenness>(minb + (maxb-minb)/6 ) ){
              		o = 1;
              	}
              	return o;
              })
              .text(function(d) { 
              	var l = d.word;
              	if(d.word.length>8){
              		l = l.substring(0,8) + "...";
              	}
              	return l;
              });
			

            node.append("title")
              .text(function(d) { return d.word; });




			ugsvg.selectAll(".node .nodetext	")
			.on("mouseenter",function(d){
				d3.select("#label-" + d.id   ).attr("opacity",1);
			})
			.on("mouseout",function(d){
				var o = 0;
              	if( d.betweenness>(minb + (maxb-minb)/6 ) ){
              		o = 1;
              	}
				d3.select("#label-" + d.id   ).attr("opacity",o);
			})
			.on("click",function(d){
				//console.log(d);
				if(selectedid!=null){
					d3.selectAll(".node")
						.attr("opacity",1);	
					d3.selectAll(".link")
						.attr("opacity",0.5);	
				}
				if(selectedid==d.id){
					selectedid = null;
				} else {
					selectedid = d.id;
					d3.selectAll(".node")
						.attr("opacity",0.1);
					d3.selectAll(".link")
						.attr("opacity",0);

					d3.select("#node-" + selectedid)
						.attr("opacity",1);

					for(var i = 0; i<bilinks.length; i++){
						//console.log(bilinks[i]);
						if(bilinks[i][0].id==selectedid){
							var theid = "#node-" + bilinks[i][2].id;
							d3.select(theid)
								.attr("opacity",1);
							var theidl = "#link-" + bilinks[i][0].id + "-" + bilinks[i][2].id;
							console.log(theidl);
							d3.select(theidl)
								.attr("opacity",1);
						}
						if(bilinks[i][2].id==selectedid){
							var theid = "#node-" + bilinks[i][0].id;
							d3.select(theid)
								.attr("opacity",1);
							var theidl = "#link-" + bilinks[i][0].id + "-" + bilinks[i][2].id;
							console.log(theidl);
							d3.select(theidl)
								.attr("opacity",1);
						}
					}
				}
			});




            ugforce.on("tick", function() {

              link.attr("d", function(d) {
                return "M" + d[0].x + "," + d[0].y + "S" + d[1].x + "," + d[1].y + " " + d[2].x + "," + d[2].y;
              });              

              node.attr("transform", function(d) {

                var ddx = d.x;
                var ddy = d.y;
                //if(ddx<0){ddx=0;} else if(ddx>wgwidth){ddx=wgwidth;}
                //if(ddy<0){ddy=0;} else if(ddy>wgheight){ddy=wgheight;}

                return "translate(" + ddx + "," + ddy + ")";
              });

              //node.attr("cx", function(d) { return d.x = Math.max(radius, Math.min( wgwidth - radius, d.x)); })
              //    .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(wgheight - radius, d.y)); });

              link.attr("x1", function(d) { return d[0].x; })
                  .attr("y1", function(d) { return d[0].y; })
                  .attr("x2", function(d) { return d[1].x; })
                  .attr("y2", function(d) { return d[1].y; });

              /*
              ugtexts
                  .attr("dx", function(d) {   

                    val = 0;

                    if(d.x>ugwidth/2){
                      val = -12;// - d.n/4 - this.getComputedTextLength();
                    } else {
                      val = 12;// + d.n/4;
                    }

                    val = d.width*2.1;

                    return val;

                  });

               */


            });

       
        //
}
