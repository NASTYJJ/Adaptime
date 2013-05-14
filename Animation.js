/** @fileoverview 
 *	Animation support for appointments, to slide or fade them into view etc.
 */
/**
 * @class Object store for objects needed in timer functions 
 */
function ObjectStore()
{
    this.objs=new Object();
    this.counter=0;

    /**
     * Add an object to the store
     * @param  {Object} o Object to place in the store
     * @return {Number} length of the aray after addition
     */
    this.add_object=function(o)
    {
        this.objs[this.counter++] = o;
        return this.counter-1;
    }

    /**
     * Delete an object from the store
     * @param  {Number} position of the object to delete
     */
    this.del_object=function(n)
    {
        delete (this.objs[n]);
    }

    /**
     * Get an object from the store
     * @param  {Number} position of the object to get
     * @return {Object} object at given position
     */
    this.get_object=function(n)
    {
        return this.objs[n];
    }
}

var store=new ObjectStore();

function act(n)
{
   var obj = store.get_object(n);
   val = obj.curve[obj.n++];
   // avoid E notation by rounding, 
   val = Math.round(val*1000)/1000;
   dp (obj.n + ":" + val + ":" + obj.effect.steps);

   obj.tfunc(obj.obj, val);
   if (obj.n >= obj.effect.steps) {
       window.clearInterval(obj.id);
       if (obj.efunc) obj.efunc(obj.obj);
   }
}

function AnimationEffect() 
{
    
}

/**
 * @class Animation effect with equally divided steps
 */
function LinearEffect() 
{
    this.traject=new Array();

    /**
     * calculate the steps according to the animation duration
     * @param  {Number} duration of the animation in milliseconds
     * @return {Array} trajectory of the animation
     */
    this.calc=function(ms)
    {
        start=0.0;
        this.steps=ms/Animation.smooth_ms;
        for (s=0; s<= this.steps; s++)
        {
            this.traject[s]= start;
            start += 1.0/this.steps;
        }
        return this.traject;
    }
}

/**
 * @class Bouncing Animation effect based on dissipating parabola's
 * @param {Number} start start position of the effect
 * @param {Number} stop end position of the effect
 * @param {Number} speed factor to speed the animation effect up by (default 16)
 * @param {Number} dissipation factor by which the bounces 'die out' (default 3)
 */
function BounceEffect(start,stop,speed,dissipation)
{
    var self=this;
    distance=(stop-start);
    
    /**
     * calculate the steps according to the parameters given in the constructor
     * @param  {Number} duration (is ignored)
     * @return {Array} trajectory of the animation
     */
    this.calc=function(ms)
    {
        self.traject = ComputeBounce(distance,speed,dissipation);
        self.n=0;
        self.steps = self.traject.length;

        return self.traject;
    }
}

/**
 * @class Animation effect based on bezier curve, smoothing the effect
 * @param {Number} start start position of the effect
 * @param {Number} stop end position of the effect
 */
function BezierEffect(start,stop)
{
    var self=this;
    var p0 = new Point2D(  0.0,  0.0) ;
    var p1 = new Point2D(  0.0,  10000.0) ;
    var p2 = new Point2D(  10.0,  10000.0) ;
    var p3 = new Point2D(  10.0, 0.0) ;

    var cp=new Array(p0,p1,p2,p3);

    self.start=start;
    self.stop=stop;

    /**
     * calculate the steps according to the animation duration
     * @param  {Number} duration of the animation in milliseconds
     * @return {Array} trajectory of the animation
     */
    this.calc=function(ms)
    {
        distance=(self.stop-self.start);
        self.current=self.start;
        self.steps=ms / Animation.smooth_ms;
        self.steps = Math.ceil(self.steps);
        self.n=0;
        self.traject = ComputeBezier(cp,self.steps+1);
        return self.traject;
    }
}

Animation.linear=1;
Animation.bezier=2;
Animation.bounce=3;

/**
 * @class Animation class 
 * @param {Function} trans transformation function which is called with values between 0.0 and 1.0. This function should translate these into animation steps.
 * @param {Object} obj the object this animation works on
 * @param {Number} start start position
 * @param {Number} stop end position
 * @param {AnimationEffect} effect effect to use (defaults to BezierEffect)
 * @param {Function} wrapup function called after the animation is finished
 */
function Animation(trans,obj,start,stop,dur,effect,wrapup)
{
    var self=this;

    self.start=start;
    self.stop=stop;
    self.dur=dur;
    self.obj=obj;
    self.tfunc=trans;
    self.efunc=wrapup;
    self.effect = effect;
    if (!self.effect) self.effect=new BezierEffect(start,stop); // default

    if (self.style == Animation.bezier) {
        var p0 = new Point2D(  0.0,  0.0) ;
        var p1 = new Point2D(  0.0,  10000.0) ;
        var p2 = new Point2D(  10.0,  10000.0) ;
        var p3 = new Point2D(  10.0, 0.0) ;

        var cp=new Array(p0,p1,p2,p3);
    }

    /** 
      * go and start the animation
      */
    this.go=function()
    {
        total = 0;
        self.n=0;
        self.curve = self.effect.calc(self.dur);
        var distance = self.stop-self.start;
        for (t=0;t<= self.effect.steps; t++) {
            total = self.curve[t] * distance;
            self.curve[t] = self.start + total;
        }

        var n = store.add_object(self);
        self.id = window.setInterval("act("+n+")", Animation.smooth_ms);
    }
}
/**
 * current stepsize in milliseconds (40 ms) which appears as smooth motion 
 */
Animation.smooth_ms=40;

function Panner(container,oldtree,newtree,xoffset,yoffset)
{
    var w = oldparent.clientWidth;
    var h = oldparent.clientHeight;

    var viewport=document.createElement("div");
    dom_xywh(0,0,w,h);
    var slider=document.createElement("div");
    dom_xywh(0,0,w*2,h*2);
}
