var o;

function go()
{
	o.relax();
}

function Dimension(w,h)
{
	this.width=w;
	this.height=h;
}

function Node() {
    this.x=0;
    this.y=0;

    this.dx=0;
    this.dy=0;

    this.fixed=false;

    this.lbl="";
}

function Edge () {
    from: Number;
    to: Number;

    len: Number;
	wid: Number;
}

function GraphCanvas (div)
{
    this.nnodes=0;
    this.nodes = Array();

    this.nedges=0;
    this.edges = Array();

    this.stress= false;
    this.random=false;

	this.getSize=function()
	{
		return new Dimension(this.canvas.width, this.canvas.height);
	}

    this.addNode=function(lbl) {
		var n = new Node();
		n.x = 10 + 980*Math.random();
		n.y = 10 + 980*Math.random();
		n.lbl = lbl;
		this.nodes[this.nnodes] = n;
		return this.nnodes++;
    }

    this.findNode=function(lbl) {
		for (i = 0 ; i < this.nnodes ; i++) {
	    	if (this.nodes[i].lbl == lbl) {
			return i;
	    	}
		}
		return this.addNode(lbl);
    }


    this.addEdge=function(from, to, len, wid) {
		var e = new Edge();
		e.from = this.findNode(from);
		e.to = this.findNode(to);
		e.len = len;
		e.wid = wid;
		this.edges[this.nedges++] = e;
    }

    function run() {
		while (relaxer == me) {
	    	relax();
	    	if (random && (Math.random() < 0.03)) {
				var n = this.nodes[(int)(Math.random() * this.nnodes)];
				if (!n.fixed) {
		    		n.x += 100*Math.random() - 50;
		    		n.y += 100*Math.random() - 50;
				}
	    	}
		}
    }

    this.relax=function() {
		for (var i = 0 ; i < this.nedges ; i++) {
	    	var e = this.edges[i];
	    	var vx = this.nodes[e.to].x - this.nodes[e.from].x;
	    	var vy = this.nodes[e.to].y - this.nodes[e.from].y;
	    	var len = Math.sqrt(vx * vx + vy * vy);
            	len = (len == 0) ? .0001 : len;
	    	var f = (this.edges[i].len - len) / (len * 3);
	    	var dx = f * vx;
	    	var dy = f * vy;
	
	    	this.nodes[e.to].dx += dx;
	    	this.nodes[e.to].dy += dy;
	    	this.nodes[e.from].dx += -dx;
	    	this.nodes[e.from].dy += -dy;
		}

		for (var i = 0 ; i < this.nnodes ; i++) {
	    	var n1 = this.nodes[i];
	    	var dx = 0;
	    	var dy = 0;

	    	for (var j = 0 ; j < this.nnodes ; j++) {
			if (i == j) {
		    	continue;
			}
			var n2 = this.nodes[j];
			var vx = n1.x - n2.x;
			var vy = n1.y - n2.y;
			var len = vx * vx + vy * vy;
			if (len == 0) {
		    	dx += Math.random();
		    	dy += Math.random();
			} else if (len < 100*100) {
		    	dx += vx / len;
		    	dy += vy / len;
			}
	    }
	    var dlen = dx * dx + dy * dy;
	    if (dlen > 0) {
		dlen = Math.sqrt(dlen) / 2;
		n1.dx += dx / dlen;
		n1.dy += dy / dlen;
	    }
	}

	var d = this.getSize();
	for (var i = 0 ; i < this.nnodes ; i++) {
	    var n = this.nodes[i];
	    if (!n.fixed) {
		n.x += Math.max(-5, Math.min(5, n.dx));
		n.y += Math.max(-5, Math.min(5, n.dy));
            }
            if (n.x < 0) {
                n.x = 0;
            } else if (n.x > d.width) {
                n.x = d.width;
            }
            if (n.y < 0) {
                n.y = 0;
            } else if (n.y > d.height) {
                n.y = d.height;
            }
	   	 	n.dx /= 2;
	   	 	n.dy /= 2;
		}
		this.update();
    }

    var pick;
    var pickfixed;
    var offscreen;
    var offscreensize;
    var offgraphics;

    var fixedColor = "#ffaaaa";
    var selectColor = "pink";
    var edgeColor = "black";
    var nodeColor = "#ccccff";
    var stressColor = "darkGray";
    var arcColor1 = "black";
    var arcColor2 = "pink";
    var arcColor3 = "red";

    this.paintNode=function (n) {
		var x = n.x;
		var y = n.y;
		var clr = ((n == pick) ? selectColor : (n.fixed ? fixedColor : nodeColor));

		var block;
		var w;
		var h;
		if (n.domelm) {
			block = n.domelm;
			w = n.w;
			h = n.h;
		} else { 
			block = document.createElement("div");
			block.style.position="absolute";
			block.style.background=clr;
			block.style.zIndex=10; 	// appear under canvas otherwise
		// to test the line placement :
        //global.browser.set_opacity(block,0.4)
			block.innerHTML = n.lbl;
			block.style.border="1px solid";
			this.domelement.appendChild(block);
			w = block.clientWidth;
			h = block.clientHeight;
		}

		block.style.left=(x-(w/2))+"px";
		block.style.top=(y-(h/2))+"px";

		block.style.width=w+"px";
		block.style.height=h+"px";

		n.domelm = block;
		n.w= w;
		n.h = h;
    }

	this.drawLine=function(x1,y1,x2,y2,clr,wid)
	{
		this.ctx.fillStyle=clr;
		this.ctx.strokeStyle = clr; // red
		this.ctx.lineWidth   = wid;

		this.ctx.beginPath();
		this.ctx.moveTo(x1,y1);
		this.ctx.lineTo(x2,y2);
		//this.ctx.bezierCurveTo(x2,y2,100,100,x2,y2);
		this.ctx.stroke();
	}
	
	this.clearCanvas=function()
	{
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
	}

    this.update=function () {
		var d = this.getSize();

		this.clearCanvas();
	
		for (var i = 0 ; i < this.nedges ; i++) {
	    	var e = this.edges[i];
	    	var x1 = this.nodes[e.from].x;
	    	var y1 = this.nodes[e.from].y;
	    	var x2 = this.nodes[e.to].x;
	    	var y2 = this.nodes[e.to].y;
	    	var wid = e.wid;
	    	var len = Math.abs(Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2)) - e.len);
	    	var clr = ((len < 10) ? arcColor1 : (len < 20 ? arcColor2 : arcColor3)) ;
	    	this.drawLine(x1, y1, x2, y2,clr,wid);
		}

		for (var i = 0 ; i < this.nnodes ; i++) {
	   		this.paintNode(this.nodes[i]);
		}
   	}

    function mousePressed(e) {
		var bestdist = Double.MAX_VALUE;
		var x = e.getX();
		var y = e.getY();
		for (var i = 0 ; i < this.nnodes ; i++) {
	    	var n = this.nodes[i];
	    	var dist = (n.x - x) * (n.x - x) + (n.y - y) * (n.y - y);
	    	if (dist < bestdist) {
			pick = n;
			bestdist = dist;
	    	}
		}
		pickfixed = pick.fixed;
		pick.fixed = true;
		pick.x = x;
		pick.y = y;
		repaint();
		e.consume();
    }

    function mouseReleased(e) {
        removeMouseMotionListener(this);
        if (pick != null) {
            pick.x = e.getX();
            pick.y = e.getY();
            pick.fixed = pickfixed;
            pick = null;
        }
		repaint();
		e.consume();
    }

    function mouseDragged(e) {
		pick.x = e.getX();
		pick.y = e.getY();
		repaint();
		e.consume();
    }

	// static layout
	this.layout=function()
	{
		this.layout_simple();
		this.update();
	}

	// dynamic layout
    this.start=function() {
		o = this;
		setInterval("go()", 40);
    }

    function stop() {
		relaxer = null;
    }

	this.getSize=function()
	{
		return new Dimension(this.canvas.width,this.canvas.height);
	}

    this.init=function(div) 
	{
		this.domelement = document.createElement("div");
		this.domparent=div;
		this.domparent.appendChild(this.domelement);

		this.canvas=document.createElement("canvas");
		this.canvas.style.zIndex=1;	// to have the divs on top

		this.canvas.id = "my_canvas";
        div.appendChild(this.canvas);
		div.style.position="absolute"; // needed to line up the lines 
        if (!this.canvas.getContext) {
                G_vmlCanvasManager.initElement(this.canvas);
                this.canvas = document.getElementById(this.canvas.id);
        } 
		
		this.ctx= this.canvas.getContext('2d');
		this.canvas.style.position='absolute';
		//this.canvas.style.background="red";
		this.canvas.width=div.clientWidth;
		this.canvas.height=div.clientHeight;
		this.domparent.appendChild(this.canvas);


		function randomstring(sChrs,iLen) {
				var sRnd = '';
				for (var i=0; i< iLen; i++) {
						var randomPoz = Math.floor(Math.random() * sChrs.length);
						sRnd += sChrs.substring(randomPoz,randomPoz+1);
				}
		return sRnd;
		}

		this.draw=function(data)
		{
			var d;
			for (d=0; d<data.getNumberOfRows(); d++) {
				var l = data.getValue(d,0);
				var r = data.getValue(d,1);
				var len = data.getValue(d,2);
				var wid = data.getValue(d,3);
				this.addEdge(l,r,len, wid);
			}
			this.layout();
		}

		this.add_more=function(nodes,edges)
		{
			var nds = Array();
			if (nodes < 2) nodes = 2;

			for (n=0; n< nodes; n++) {
				nds[n] = randomstring('abcdefghijklmnop', 8);
			}

			for (t = 0; t<edges; t++) {
				var l = Math.floor(Math.random() * nodes);
				var r = l;
				while (r==l) {
					r = Math.floor(Math.random() * nodes);
				}

				var len = Math.floor(Math.random() * 150);
				this.addEdge(nds[l],nds[r], len, 1);

			}
			var d = this.getSize();
			var l = Math.floor(Math.random() * nodes);
			var center=nds[l];
			if (center != null){
				var n = this.nodes[this.findNode(center)];
				n.x = d.width / 2;
				n.y = d.height / 2;
				n.fixed = true;
			}
		}

		this.add_edges=function()
		{
				var edges = "joe-food,joe-dog,joe-tea,joe-cat,joe-table,table-plate/50,plate-food/30,food-mouse/100,food-dog/100,mouse-cat/150,table-cup/30,cup-tea/30,dog-cat/80,cup-spoon/50,plate-fork,dog-flea1,dog-flea2,flea1-flea2/20,plate-knife";

				var tokens = edges.split(",");
				for (t = 0; t< tokens.length; t++) {

					var str = tokens[t];
					var nds = str.split('-');
					var len = 50;

					var xtra = nds[1].split('/');
					node1=nds[0];
					node2=nds[1];
					if (xtra[1]) {
						node2=xtra[0];
						len = parseInt(xtra[1],10);
					} 
					this.addEdge(node1,node2, len, 1);
				}
				var d = this.getSize();
				var center = "joe";
				if (center != null){
					var n = this.nodes[this.findNode(center)];
					n.x = d.width / 2;
					n.y = d.height / 2;
					n.fixed = true;
				}
		}
		this.setCenter=function(center)
		{
				var d = this.getSize();
				if (center != null){
					var nd = this.nodes[this.findNode(center)];
					nd.x = d.width / 2;
					nd.y = d.height / 2;
					nd.fixed = true;
				}
		}
    }

	// simple, put the busiest node in the middle and fan out
	this.layout_simple=function()
	{
		//console.log(this.nedges);
	}

    function destroy() {
        //remove(this.panel);
    }

    function actionPerformed(e) {
	var src = e.getSource();

	if (src == scramble) {
	    var d = this.getSize();
	    for (var i = 0 ; i < this.nnodes ; i++) {
			var n = this.nodes[i];
			if (!n.fixed) {
		    	n.x = 10 + (d.width-20)*Math.random();
		    	n.y = 10 + (d.height-20)*Math.random();
			}
	    }
	    return;
	}

	if (src == shake) {
	    var d = this.getSize();
	    for (var i = 0 ; i < this.nnodes ; i++) {
			var n = this.nodes[i];
			if (!n.fixed) {
		    	n.x += 80*Math.random() - 40;
		   	 	n.y += 80*Math.random() - 40;
				}
	   	 	}
		}
    }

    function itemStateChanged(e) {
	var src = e.getSource();
	var on = e.getStateChange() == ItemEvent.SELECTED;
	if (src == this.stress) this.stress = on;
	else if (src == random) this.random = on;
    }

    function getAppletInfo() {
		return "Title: GraphLayout \nAuthor: <unknown>";
    }

	this.init(div);
	this.start();
}
