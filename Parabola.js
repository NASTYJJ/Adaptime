function parabola(c,a,i)
{
    return (i * i * a) + c;
}
 
function ComputeParabola(c,a)
{
    var t=0;
	var avg=0;
    var curve = new Array();
 
    var i=0;
    val=c;
    do {
        curve[t] = val;
        i++;
        t++;
        val = parabola(c,a,i);
    } while (val>=0) 

    return curve;
}

function ComputeBounce(distance,speed,dissipation)
{
    var result=new Array();
    var traject=new Array();

	// tuning 
	if (!dissipation) dissipation=3; 
	if (!speed) speed=16;
    
    result = ComputeParabola(16384,-1 * speed);
    var l = result.length;
    var x = 0;
    var step=1;
    var distance = 567;

    for (var i = 0; i < l; i+=step) {
        traject[x] = 1.0 - (result[i]) / 16384 / step;
        x++;
    }
    distance /= dissipation;
    step *=dissipation;
    while (distance>1) {
        for (var i = l-1; i >= 0;  i-=step) {
            traject[x] = 1.0 - (result[i]) / 16384 / step;
            x++;
        }
        for (var i = 0; i < l; i+=step) {
            traject[x] = 1.0 - (result[i]) / 16384 / step;
            x++;
        }
        distance/=dissipation;
        step *=dissipation;
    }

    return traject;
}

function test()
{
    var traject = ComputeBounce(567);

    l = traject.length;
    for (var i = 0; i < l; i++) {
	    print(traject[i]);
    }
    print(l);
}

//test();
