/** 
  * @class context used for resize events, objects can register themselves to 
  * receive resize events by adding themselves to the global.resizecontext
  */
function ResizeContext()
{
    var obs = new Array();

    function redraw(e)
    {
        var len=obs.length;
        for (r=0; r< len; r++) {
            var o = obs[r];
            if (o.redraw) o.redraw(e);
        }
    }

    onresize = redraw;
    document.onResize = redraw;

    /** 
      * add an object to the context, making it receive onResize messages
      * @param {Object} obj to register 
      */
    this.add = function(obj)
    {
        var l = obs.length;
        if (!obj.redraw) {
            alert("Your object MUST implement the redraw() method");
            return;
        }
        obs[l] = obj;
    }

    //  only addition for now
}
global.resizecontext = new ResizeContext();
