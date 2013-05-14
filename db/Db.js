var selectioncolor="#FFEEEE";
var bgcolor="#DDCCCC";
var hdrcolor="#BBAAAA";
var dt; // database translation strings

function fok_us()
{
    this.focus();
}

function DbInit()
{
	dt = lang.get_strings("db");
}

function DbColData(data)
{
	this.split_type=function(typestring)
	{
		var spl = typestring.split('(');
		this.type = spl[0];
		if (spl[1]) {
			spl = spl[1].split(')');
			this.typedata= spl[0];
		}
	}

	//this.split_type(data.Type);
	this.type=data.type;
	this.name=data.name;
	this.nul=data.not_null!=0;
	this.def=data.def;
	this.extra=data.Extra;
	this.key=data.primary_key;
	this.pwd=false;
}

function DbData(data,editable,deletable)
{
	this.data=data;
	this.editable=true;
	this.deletable=true;
	if (editable) this.editable=editable;
	if (deletable) this.deletable=editable;
}

function changefield(e)
{
	e.target.value = addslashes(e.target.value);
}

function CellTextInputField(coldata,val,xtra)
{
	var d=document.createElement("textarea");
	if (val == null) val = "NULL";
	d.value=val;
	d.rows=10;
	d.onchange=changefield;
	d.xtra=xtra;
	d.oldval=val;
	d.onselectstart=null;

	return d;
}

function CellInputField(coldata,val,xtra)
{
	var d=document.createElement("input");
	if (val == null && coldata.extra) val = coldata.extra;
	if (val == null) val = "NULL";
	d.value=val;
	d.onchange=changefield;
	d.xtra=xtra;
	d.oldval=val;
	d.onselect=null;
	d.onselectstart=null;

	return d;
}

function CellOptionField(opts,val,cb,xtra)
{
	var d=document.createElement("select");

	var O=opts.length;
	d.selectedIndex=-1;

	for (i=0; i< O; i++) {
		var opt=opts[i];

		if (opt=="" || opt==",") continue;
		var o=document.createElement("option");

		o.innerHTML=opt;
		d.appendChild(o);

		if (opt==val) { 	// select
			d.selectedIndex=i;
		}
	}

	d.onchange=cb;

	return d;
}

function EnumOptionField(coldata,val,xtra)
{
	var opts = coldata.typedata.replace(/'/g,"");
	opts = opts.split(",");
	return CellOptionField(opts,val,null,xtra);
}

function CellEditor(coldata,val,xtra)
{
	switch (coldata.type) {
		case "enum":
			d = EnumOptionField(coldata,val,xtra);
		break;
		case "text":
			d = CellTextInputField(coldata,val,xtra);
		break;
		default:
			d = CellInputField(coldata,val,xtra);
			if (coldata.pwd) d.type="passwd";
		break;
	}
  	d.onmouseup=fok_us;
	return d;
}

// 
function DbSelectTable(maindiv,query,cb)
{
	var thisobj=this;
	thisobj.maindiv=maindiv;
	thisobj.query=query;

    this.get_query=function()
    {
        var jc = new JsonContext("feyenoord/db.php");
        var jm = new JsonMessage("get_selection");

		var query = thisobj.query;

		jm.add_object(thisobj.loginkey);
		jm.add_object(query);

        msg = jc.get_sync(jm);
        stat = msg.get_status(0);

        if (stat != 'ok') 
			return null;

        var rows = msg.get_object(0);
		return rows;
    }

	var rows=this.get_query();
	var opts=Array();
	opts[0]="select one";
	for (r=0; r< rows.length; r++) {
		opts[r+1]=rows[r][0];
	}
	var sel = CellOptionField(opts,"",cb,null);
	maindiv.appendChild(sel);
}

// table representing any query, non-editable 
// since "show tables" etc are not genericly editable
function DbQueryTable(maindiv,loginkey,query)
{
	var thisobj=this;
	thisobj.maindiv=maindiv;
	thisobj.rows=Array();
	thisobj.query=query;
	thisobj.selectedrow=-1;
	thisobj.loginkey=loginkey;

	this.getselectedrow=function()
	{
		return thisobj.selectedrow;
	}
	
	this.setselectioncb=function(cb)
	{
		this.selcb=cb;
	}

	function deselect(r)
	{
		if (r<0) return;
		var i=0;
		var row = thisobj.rows[r];

		for (c in row.data) {
			var col=row.data[c];
			var tc = row.tr.childNodes[i++];
			//tc.style.background=bgcolor;
		}
		row.selected=false;
		if (thisobj.selcb) thisobj.selcb(r,false,row.data);
	}

	function select(r)
	{
		var i=0;
		var row = thisobj.rows[r];

		for (c in row.data) {
			var col=row.data[c];
			var tc = row.tr.childNodes[i++];
			tc.style.background=selectioncolor;
		}
		row.selected=true;
		thisobj.selectedrow=r;
		if (thisobj.selcb) thisobj.selcb(r,true,row.data);
	}

	function rowselect()
	{
		deselect(thisobj.selectedrow);
		thisobj.selectedrow=this.r;
		select(this.r);
	}

	this.generate_table=function(base)
	{
		var r=0;
		var row;
		var tbl=document.createElement("table");
		if (base) {
			for (b=0; b < base.length; b++) {
				row = base[b];
				row.tr = tbl.insertRow(r);
				var t=0;

				for (c in row.data) {
					var mem = row.data[c];
					var tc = row.tr.insertCell(t);
					if (mem == null) mem = "NULL";
					tc.innerHTML=mem;
					tc.onclick=rowselect;
					tc.r=r;
					tc.className="DbTable";
					t++;
				}
				r++;
			}
		}
		if (!row) return tbl;
		// now add the header with the last row's column names
		var tr = tbl.insertRow(0);
		t=0;
		for (c in row.data) {
			var tc = tr.insertCell(t);
			tc.innerHTML=c;
			tc.className="DbTableHeader";
			t++;
		}
		
		return tbl;
	}

	this.generate_row_table=function()
	{
		return this.generate_table(this.rows);
	}

    this.get_query=function()
    {
        var jc = new JsonContext("feyenoord/db.php");
        var jm = new JsonMessage("get_query");

		jm.add_object(thisobj.loginkey);
		jm.add_object(query);
	
        msg = jc.get_sync(jm);
        stat = msg.get_status(0);

        if (stat != 'ok') 
			return null;

        var rows = msg.get_object(0);
		return rows;
    }

	var rows=this.get_query(query);
	var l = 0;
	if (rows) {
		for (r=0; r< rows.length; r++)
			this.rows[l++] = new DbData(rows[r]);
	}

	this.maintbl = this.generate_row_table();
	maindiv.appendChild(this.maintbl);
}

// database table editor, all columns are editable
// TODO: disable editing per-column (maybe even per row)
function DbEditTable(maindiv,loginkey,tbname,query)
{
	var thisobj=this;
	thisobj.maindiv=maindiv;
	thisobj.cols=Array();
	thisobj.rows=Array();
	thisobj.ce=Array();
	thisobj.tbname=tbname;
	thisobj.selectedrow=-1;
	thisobj.loginkey=loginkey;
	thisobj.query=query;

	this.set_icon=function(domelm,img,cb,active,xtra)
	{
		var button = document.createElement("button");
		domelm.appendChild(button);
		button.style.width="16px";
		button.style.height="16px";
		button.style.border="0px";
		set_img_single (button,img);
		button.onmouseup= cb;
		button.data=xtra; 	// handler data
		if (active == false) {
			button.disabled=true;
			dom_set_opacity(button,0.2);
		}
		return button;
	}

	this.ispassword=function(row)
	{
		thisobj.cols[row].pwd=true;
	}

	this.getselectedrow=function()
	{
		return thisobj.selectedrow;
	}

	//this.setselectioncb=function(cb)
	//{
		//this.selcb=cb;
	//}

	function deselect(r)
	{
		if (r<0) return;
		var i=0;
		var row = thisobj.rows[r];

		for (c in row.data) {
			var col=row.data[c];
			var tc = row.tr.childNodes[i++];
			//tc.style.background=bgcolor;
		}
		row.selected=false;
		if (thisobj.selcb) thisobj.selcb(r,false,row.data);
	}

	function select(r)
	{
		var i=0;
		var row = thisobj.rows[r];

		for (c in row.data) {
			var col=row.data[c];
			var tc = row.tr.childNodes[i++];
			tc.style.background=selectioncolor;
		}
		row.selected=true;
		thisobj.selectedrow=r;
		if (thisobj.selcb) thisobj.selcb(r,true,row.data);
	}

	function set_editable(r)
	{
		var i=0;
		var row = thisobj.rows[r];

		for (c in row.data) {
			var col=row.data[c];
			var coldata=thisobj.cols[i];
			var tc = row.tr.childNodes[i++];
			thisobj.ce[c] = new CellEditor(coldata,col,row);
			remove_children(tc);
			tc.appendChild(thisobj.ce[c]);
			thisobj.ce[c].style.width='100%';
		}
		thisobj.editrow=row;
	}

	function rowselect()
	{
		deselect(thisobj.selectedrow);
		thisobj.selectedrow=this.r;
		select(this.r);
	}

	function reset_editable()
	{
		var i=0;
		var row = thisobj.editrow;

		for (c in row.data) {
			var col=row.data[c];
			var tc = row.tr.childNodes[i];
			remove_children(tc);
			tc.innerHTML=col;
			tc.r=i;
			i++;
		}
		thisobj.editrow=null;
	}

	thisobj.db_write=function()
	{
		if (thisobj.editrow) {
			var changed = thisobj.what_to_do();
			if (changed == "update") {
				var x = confirm("Save changes ?");
				if (x) thisobj.update();
			} else 
			if (changed == "insert") {
				var x = confirm("Save new line ?");
				if (x) thisobj.update();
				thisobj.insert();
			} 
			reset_editable();
		}
	}

	function editcb()
	{
		var i=0;
		var r = this.data;
		thisobj.db_write();
		set_editable(r);
	}

	this.del=function(r)
	{
		var row = thisobj.rows[r];

		var i=0;
		var nkey=0;
		var keys=" WHERE ";

		for (c in row.data) {
			var col=row.data[c];
			if (thisobj.cols[i].key != "") {
				if (nkey>0) keys += " AND ";
				keys += thisobj.cols[i].name + "='" + col + "'";
				nkey++;
			}
			i++;
		}
		var rows = thisobj.del_row(keys);

		var l=0;
		thisobj.rows=Array();

		if (rows) {
			for (r=0; r< rows.length; r++) {
				thisobj.rows[l++] = new DbData(rows[r]);
			}
		}
	
		thisobj.maindiv.removeChild(thisobj.maintbl);
		thisobj.maintbl = thisobj.generate_row_table();
		thisobj.maindiv.appendChild(thisobj.maintbl);
	}

	this.insert=function()
	{	
		var row = thisobj.editrow;
		var i=0;
		var hdrs="";
		var vals="";
		for (c in row.data) {
			var newval = thisobj.ce[c].value;

			if (i>0) { hdrs += ","; vals += ","; }

			hdrs+= "`" + thisobj.cols[i].name + "`"
			vals+= "'" + newval + "'"
			i++;
		}
		qry = "(" + hdrs + ") VALUES (" + vals + ")";
		var rows = this.ins_row(qry);
		var l=0;
		if (rows) {
			for (r=0; r<  rows.length; r++)
				thisobj.rows[l++] = new DbData(rows[r]);
		}

		thisobj.maindiv.removeChild(thisobj.maintbl);
		thisobj.maintbl = thisobj.generate_row_table();
		thisobj.maindiv.appendChild(thisobj.maintbl);
	}

	this.update=function()
	{
		var row = thisobj.editrow;
		var i=0;
		var nkey=0;
		var keys=" WHERE ";
		var nupd=0;
		var upds=" SET ";
		for (c in row.data) {
			var col=row.data[c];
			if (thisobj.cols[i].key != "") {
				if (nkey>0) keys += " AND ";
				keys += thisobj.cols[i].name + "='" + col + "'";
				nkey++;
			}
			var newval = thisobj.ce[c].value;
			if (newval != col) {
				if (nupd>0) upds += ",";
				if (newval == "null" || newval == "NULL") // nokwoots
					upds += thisobj.cols[i].name + "=NULL";
				else
					upds += "`" + thisobj.cols[i].name + "`='" + newval + "'";
				nupd++;
			}
			i++;
		}
		qry = upds + keys;
		var rows = this.set_row(qry);
		var l=0;
		if (rows)
			for (r=0; r<  rows.length; r++)
				thisobj.rows[l++] = new DbData(rows[r]);

		thisobj.maindiv.removeChild(thisobj.maintbl);
		thisobj.maintbl = thisobj.generate_row_table();
		thisobj.maindiv.appendChild(thisobj.maintbl);
	}

	this.what_to_do=function()
	{
		var action = "nothing";
		var row = thisobj.editrow;
		var i=0;
		for (c in row.data) {
			var col=row.data[c];
			var coldata=thisobj.cols[i];
			var newval = thisobj.ce[c].value;
			if (newval != col) {
				action="update";
				// filter out NULL strings 
				if (col == null && (newval=="NULL" || newval == "null"))
					action="nothing";
			}
			if (coldata.key != "" ) {
				if (col == "" || col == null || newval == "auto_increment") {
					return "insert";
				}
			}
			i++;
		}
		return action;
	}

	function delcb()
	{
		var row = this.data;
		var yes = confirm("Do you realy want to delete this row ?");
		if (!yes) return;

		thisobj.del(row);
	}

	function savecb()
	{
		thisobj.db_write();
	}

	function empty_row(coldata)
	{
		var o = new Object();
		if (coldata) { 
			for (c=0; c < coldata.length; c++) {
				var col = coldata[c];
				o[col.name]= col.def;
			}
		}

		return o;
	}

	function inscb()
	{
		var i=0;
		var r = this.data;

		thisobj.db_write();

		//var l = thisobj.rows.length;
		thisobj.rows.splice(0,0, new DbData(empty_row(thisobj.cols)));
		thisobj.maindiv.removeChild(thisobj.maintbl);
		thisobj.maintbl = thisobj.generate_row_table();
		thisobj.maindiv.appendChild(thisobj.maintbl);
		set_editable(0);
	}

	this.set_edit_icon=function(tc,row,r)
	{
		return this.set_icon(tc,"feyenoord/images/stock_edit.png", editcb, row.editable, r);
	}

	this.set_trash_icon=function(tc,row,r)
	{
		return this.set_icon(tc,"feyenoord/images/stock_delete.png", delcb,row. deletable,r);
	}

	this.set_insert_icon=function(tc,active,data)
	{
		return this.set_icon(tc,"feyenoord/images/stock_insert-rows.png", inscb,active,data);
	}

	this.set_save_icon=function(tc,active,data)
	{
		return this.set_icon(tc,"feyenoord/images/stock_save.png", savecb,active,data);
	}

	this.generate_table=function(base)
	{
		var r=0;
		var tbl=document.createElement("table");
		if (base) {
			for (b=0; b< base.length; b++) {
				var row = base[b];
				row.editable=true;
				row.deletable=true;
				row.tr = tbl.insertRow(r);
				var t=0;
				for (c in row.data) {
					var mem = row.data[c];
					var tc = row.tr.insertCell(t);
					if (mem == null) mem = "NULL";
					tc.innerHTML=mem;
					tc.r=r;
					tc.className="DbTable";
					t++;
				}
				tc = row.tr.insertCell(t++);
				tc.className="DbTable";
				var ei = this.set_edit_icon(tc,row,r);
				tc = row.tr.insertCell(t++);
				var ti = this.set_trash_icon(tc,row,r);
				r++;
			}
		}
		// now add the header with the last row's column names
		var tr = tbl.insertRow(0);
		t=0;
		if (this.cols)
		for (c=0; c < this.cols.length; c++) {
			var tc = tr.insertCell(t);
			col=this.cols[c];
			tc.innerHTML=col.name;
			tc.className="DbTableHeader";
			t++;
		}
		tc = tr.insertCell(t++);
		tc.className="DbTableHeader";
		var ei = this.set_insert_icon(tc);
		tc = tr.insertCell(t++);
		tc.className="DbTableHeader";
		var ti = this.set_save_icon(tc);
		
		return tbl;
	}

	this.generate_col_table=function()
	{
		return this.generate_table(this.cols);
	}

	this.generate_row_table=function()
	{
		return this.generate_table(this.rows);
	}

    this.get_cols=function()
    {
        var jc = new JsonContext("feyenoord/db.php");
        var jm = new JsonMessage("get_cols");

		jm.add_object(thisobj.loginkey);
		jm.add_object(tbname);

        msg = jc.get_sync(jm);
        stat = msg.get_status();

        if (stat != 'ok') {
			alert(msg.get_object(0));
			return null;
		}

        var cols = msg.get_object(0);
		return cols;
    }

    this.get_rows=function()
    {
        var jc = new JsonContext("feyenoord/db.php");
        var jm = new JsonMessage("get_rows");

		jm.add_object(thisobj.loginkey);
		jm.add_object(tbname);

        msg = jc.get_sync(jm);
        stat = msg.get_status(0);

        if (stat != 'ok') 
			return null;

        var rows = msg.get_object(0);
		return rows;
    }

    this.get_rowcols=function()
    {
        var jc = new JsonContext("feyenoord/db.php");
        var jm = new JsonMessage("get_rowcols");

		jm.add_object(thisobj.loginkey);
		jm.add_object(tbname);
		jm.add_object(thisobj.query);

        msg = jc.get_sync(jm);
        stat = msg.get_status(0);

        if (stat != 'ok') 
			return null;

        var rows = msg.get_object(0);
        var cols = msg.get_object(1);

		var l=0;
		if (cols) {
			for (c=0; c< cols.length; c++) 
				this.cols[l++] = new DbColData(cols[c]);
		}
		l = 0;
		if (rows) {
			for (r=0; r< rows.length; r++)
				this.rows[l++] = new DbData(rows[r]);
		}
    }

    this.ins_row=function(qry)
    {
        var jc = new JsonContext("feyenoord/db.php");
        var jm = new JsonMessage("ins_row");

		jm.add_object(thisobj.loginkey);
		jm.add_object(thisobj.query); // for return values
		jm.add_object(this.tbname);
		jm.add_object(qry);

        msg = jc.get_sync(jm);
		rows = msg.get_object(0);
		return rows;
    }

    this.set_row=function(qry)
    {
        var jc = new JsonContext("feyenoord/db.php");
        var jm = new JsonMessage("set_row");

		jm.add_object(thisobj.loginkey);
		jm.add_object(thisobj.query); // for return values
		jm.add_object(this.tbname);
		jm.add_object(qry);

        msg = jc.get_sync(jm);
		rows = msg.get_object(0);
		return rows;
    }

    this.del_row=function(keys)
    {
        var jc = new JsonContext("feyenoord/db.php");
        var jm = new JsonMessage("del_row");

		jm.add_object(thisobj.loginkey);
		jm.add_object(this.query);
		jm.add_object(this.tbname);
		jm.add_object(keys);

        msg  = jc.get_sync(jm);
		rows = msg.get_object(0);
		return rows;
    }

	//this.get_cols(tbname);
	this.get_rowcols(this.query);

	this.maintbl = this.generate_row_table();
	maindiv.appendChild(this.maintbl);
}
