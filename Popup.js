/**
  * Create a generic popup, which can contain any dom tree
  */
function Popup()
{
    var self=this;
    self.div = document.createElement("div");

    /**
      * show the popup by attaching it to a parent element
      * @param {Object} Dom element object to attach popup to
      * @param {Number} x coordinate of left side of the popup
      * @param {Number} y coordinate of top side of the popup
      */
    self.show = function(p,x,y) 
    {
        p.appendChild(self.div);
        self.div.style.position ='absolute';
        self.div.style.left = x + 'px';
        self.div.style.top = y + 'px';
        self.div.style.width = '100px';
        self.div.style.height = '100px';
        self.div.style.background = "yellow";
    }

    /**
      * remove popup from parent and view
      */
    self.hide = function(p) 
    {
        p.removeChild(self.div);
    }

    /**
      * set the html content of the popup
      * @param {Object} content top dom element containing html content
      */
    self.set_content=function(content)
    {
        content.style.position ='absolute';
        replace_child(self.div,content);
    }
}

/**
  * @class popup menu object, with menuitems arranged in rows
  * @param {Object} items, array of MenuItem's to display
  */
function PopupMenu(items)
{
    var self=this;
    var i;
    self.div= document.createElement("div");
    self.div.style.position='absolute';
    self.div.style.zIndex= 30;
    if (!items) items= new Array();
    self.items=items;

    function nope(o)
    {
        alert("nakkes");
    }

    self.del_menuitem= function(pos)
    {
        if (!self.items) return;
        var l = self.items.length;
        if (l < pos) return;

        mi = self.items[pos];
        self.div.removeChild(mi.div);
        this.apps.splice(pos,1);
    }

    self.add_menuitem= function(mi)
    {
        var l = 0;
        if (self.items)
            l = self.items.length;
        self.items[l]=mi;
        self.div.appendChild(mi.div);
        mi.div.menu=this;
    }

    if (self.items)
        for (i =0; i< self.items.length; i++) {
            mi = self.items[i];
            self.div.appendChild(mi.div);
            mi.div.menu=this;
        }


    self.set_data = function(d)
    {
        self.data=d;
    }

    self.hide_popup = function() 
    {
        document.body.removeChild(self.div);
        document.onmouseup=null; // restore!
        return false;
    }

    function clear_popup(e)
    {
        self.hide_popup();
    }

    self.show_popup =function(x,y)
    {
        document.body.appendChild(self.div);
        self.div.style.left=x;
        self.div.style.top=y;
        document.onmouseup=clear_popup;
    }

    self.trigger_popup =function(e)
    {
    	if (!e) e = window.event;
        global.browser.event_set_xy(e);
        self.target=e.target;
        self.show_popup(get_scrolled_x(global.browser.x), get_scrolled_y(global.browser.y));
        return false;
    }

    self.popup = new Popup();
    self.popup.set_content(self.div);
    document.oncontextmenu=disable;
    return false;
}

function action_and_popdown(e)
{
    if (this.action) this.action(this.menu.target,this.data);
    if (this.menu) this.menu.hide_popup();
    global.browser.cancel_bubble(e);

    return false;
}

function set_in(e)
{
    this.style.borderStyle="inset";
}

function set_out(e)
{
    this.style.borderStyle="outset";
}

/**
  * @class one row in a PopupMenu
  * @param {String} txt to display
  * @param {Function} action to perform
  * @param {String} classname to use for the item appearence
  */
function MenuItem(txt,action,classname)
{
    var self=this;
    self.div= document.createElement("div");
    // if using buttons all these 3 are needed
    // this looks nicest, buttons dont align very well
    self.div.style.border='1px';
    self.div.style.borderWidth=1;
    self.div.style.borderStyle="outset";

    self.div.style.cursor = 
         global.browser.icon_name(global.mouseicon[0]);

    self.div.innerHTML=txt;
    self.div.className="menuitem"
        if (classname) self.div.className += " " + classname;
    self.div.action=action;

    self.div.onmouseover=set_in;
    self.div.onmouseout=set_out;
    self.div.onmouseup=action_and_popdown;

    self.set_bg = function(bg)
    {
        self.bg=bg;
        self.div.style.background=bg;
    }

    self.set_data = function(d)
    {
        self.div.data=d;
    }
}
