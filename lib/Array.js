/*\
 * Array Functionality
 * script: array.js
 * for: browsers not implementing the full array functionality of ECMA262-3
 * by: liorean <http://liorean.web-graphics.com/>
 * thanks to: beetle
\*/

if(typeof Array.prototype.copy=='undefined')
    Array.prototype.copy=function(a){
        var
            i=0,
            b=[];
        for(i;i<this.length;i++)
            b[i]=(typeof this[i].copy!='undefined')?
                this[i].copy():
                this[i];
        return b
    };

if(typeof Array.prototype.concat=='undefined')
    Array.prototype.concat=function(a){
        var
            i=0,
            b=this.copy();
        for(i;i<a.length;i++)
            b[b.length]=a[i];
        return b
    };
    
if(typeof Array.prototype.pop=='undefined')
    Array.prototype.pop=function(){
        var
            b=this[this.length-1];
        this.length--;
        return b
    };

if(typeof Array.prototype.push=='undefined')
    Array.prototype.push=function(){
        var
            i=0,
            b=this.length,
            a=arguments;
        for(i;i<a.length;i++)
            this[b+i]=a[i];
        return this.length
    };

if(typeof Array.prototype.shift=='undefined')
    Array.prototype.shift=function(){
        var
            i=0,
            b=this[0];
        for(i;i<this.length-1;i++)
            this[i]=this[i+1];
        this.length--;
        return b
    };

if(typeof Array.prototype.slice=='undefined')
    Array.prototype.slice=function(a,c){
        var
            i=0,
            b,
            d=[];
        if(!c)
            c=this.length;
        if(c<0)
            c=this.length+c;
        if(a<0)
            a=this.length-a;
        if(c<a){
            b=a;
            a=c;
            c=b
        }
        for(i;i<c-a;i++)
            d[i]=this[a+i];
        return d
    };

if(typeof Array.prototype.splice=='undefined')
    Array.prototype.splice=function(a,c){
        var
            i=0,
            e=arguments,
            d=this.copy(),
            f=a;
        if(!c)
            c=this.length-a;
        for(i;i<e.length-2;i++)
            this[a+i]=e[i+2];
        for(a;a<this.length-c;a++)
            this[a+e.length-2]=d[a-c];
        this.length-=c-e.length+2;
        return d.slice(f,f+c)
    };

if(typeof Array.prototype.unshift=='undefined')
    Array.prototype.unshift=function(a){
        var
            b;
        this.reverse();
        b=this.push(a);
        this.reverse();
        return b
    };
