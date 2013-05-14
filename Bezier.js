/**
  * coordinate point used in calculations
  * @param {Number} x x coordinate
  * @param {Number} y y coordinate
  */
function Point2D(x,y)
{
	this.x=x;
	this.y=y;
}
 
function PointOnCubicBezier( cp, t )
{
    var ax, bx, cx;
    var ay, by, cy;
    var tSquared, tCubed;
 
    cx = 3.0 * (cp[1].x - cp[0].x);
    bx = 3.0 * (cp[2].x - cp[1].x) - cx;
    ax = cp[3].x - cp[0].x - cx - bx;
 
    cy = 3.0 * (cp[1].y - cp[0].y);
    by = 3.0 * (cp[2].y - cp[1].y) - cy;
    ay = cp[3].y - cp[0].y - cy - by;
 
    tSquared = t * t;
    tCubed = tSquared * t;
 
    var x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x;
    var y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y;

    return new Point2D(x,y);;
}
 
function ComputeBezier( cp, numberOfPoints)
{
    var dt;
    var i;
	var avg = new Point2D(0,0);
    var curve = new Array();
    var traject = new Array();
 
    dt = 1.0 / ( numberOfPoints - 1 );
 
    for( i = 0; i < numberOfPoints; i++) {
        curve[i] = PointOnCubicBezier( cp, i*dt );
		avg.y+=curve[i].y;
	}
    var acc=0.0;
    for( i = 0; i < numberOfPoints; i++) {
		acc += curve[i].y / avg.y;
		traject[i] = acc;
	}

    return traject;
}

function test_bezier()
{
    var p0 = new Point2D(  2.0,  2.0) ;
    var p1 = new Point2D( 12.0,  4.0) ;
    var p2 = new Point2D(  5.0, 14.0) ;
    var p3 = new Point2D(  9.0, 14.0) ;
    
    var cp=new Array(p0,p1,p2,p3);
    var result=new Array();
    
    result = ComputeBezier(cp,10);
    
    var x=0;
    for (var i=0; i < 10; i++) {
        x += result[i];
	    print(result[i] + ":" + x);
    }
    //print(avg.x + "," + avg.y + "=" + avg.x*avg.y);
}

//test_bezier();
