function Coord(n)
{
    this.n=0;
    this.pfx=null;

  	if (typeof n != 'string') {
        this.n=n;
        return;
    }
  	if (n.slice(-2) == 'px') {
        this.n = parseInt(n.slice(0,-2));
        this.pfx='px';
        return;
    }
  	if (n.slice(-1) == '%') {
        this.n = parseFloat(n.slice(0,-1));
        this.pfx='%';
        return;
    }

    this.get=function()
    {
        if (!this.pfx)return this.n;
        return this.n + this.pfx;
    }
    // EM ??
}
