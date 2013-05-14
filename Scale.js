/** @constructor scaling object used to translate between world and model scale
  * @param {Number} wl world left (first) border
  * @param {Number} wr world right (last) border
  * @param {Number} ml model left (first) border
  * @param {Number} mr model right (last) border
  */
function Scale(wl,wr,ml,mr)
{
	// modelleft... worldright

    /** @ignore */
	this.recalc = function()
	{
		this.ww = this.wr-this.wl;
		this.mw = this.mr-this.ml;
		this.scale = this.mw/this.ww;
		// to end up in the middle of each world cell
	}

    /** set the worlds granularity 
      * @param {Number} offset first snap point
      * @param {Number} step recurring space to next snap points
      */
	this.set_world_snap = function(offset,step)
	{
		this.wo = offset;
		this.ws = step;
	}

    /** snap to the worlds granularity 
      * @param {Number} wx from which world point to snap
      * @return {Number} closest snap point to wx
      */
	this.snap_world = function(wx)
	{
		absl = wx - this.wo; // calc from first snap point
		nsnaps = Math.round(absl/this.ws);	// which snapslot is it in
		var left = nsnaps * this.ws;	// get left side of slot
		left += this.wo;	// restore offset

        //dp(left);
		return left;
	}

    /** get world point given a model point
      * @param {Number} m point in the model
      * @return {Number} point in the world
      */
	this.get_world = function(m)
	{
		var wr = ((m - this.ml) / this.scale) + this.wl;
		return wr;
	}

    /** snap to the worlds granularity in model coordinates
      * @param {Number} mr from which model point to snap
      * @return {Number} closest model snap point to m
      */
	this.snap_model = function(mr)
	{
		// get world equivalent
		wrld = this.get_world(mr);
		// snap world !!
		var val = this.snap_world(wrld);
		// return model equivalent
		return this.get_model(val);
	}

    /** get model point from world point
      * @param {Number} w point in the world
      * @return {Number} point in the model
      */
	this.get_model = function(w)
	{
		var mr = ((w - this.wl) * this.scale) + this.ml;
		//return Math.round(mr);
        return mr;
	}

    /** set the worlds start and end point
      * @param {Number} start left point in the world
      * @param {Number} end right point in the world
      */
	this.set_world = function(start,end)
	{
		this.wl = start;
		this.wr = end;
		this.recalc();
	}
	
    /** set the models start and end point
      * @param {Number} start left point in the model
      * @param {Number} end right point in the model
      */
	this.set_model = function(start,end)
	{
		this.ml = start
		this.mr = end;
		this.recalc();
	}

	this.ml = dom_strippx(ml);
	this.mr = dom_strippx(mr);
	this.wl = dom_strippx(wl);
	this.wr = dom_strippx(wr);

	this.recalc()
}
Scale.prototype = new Class();
