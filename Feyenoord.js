
var global=new Object();
function Coord(n)
{this.n=0;this.pfx=null;if(typeof n!='string'){this.n=n;return;}
if(n.slice(-2)=='px'){this.n=parseInt(n.slice(0,-2));this.pfx='px';return;}
if(n.slice(-1)=='%'){this.n=parseFloat(n.slice(0,-1));this.pfx='%';return;}
this.get=function()
{if(!this.pfx)return this.n;return this.n+this.pfx;}}
function SHA1(msg){function rotate_left(n,s){var t4=(n<<s)|(n>>>(32-s));return t4;};function lsb_hex(val){var str="";var i;var vh;var vl;for(i=0;i<=6;i+=2){vh=(val>>>(i*4+4))&0x0f;vl=(val>>>(i*4))&0x0f;str+=vh.toString(16)+vl.toString(16);}
return str;};function cvt_hex(val){var str="";var i;var v;for(i=7;i>=0;i--){v=(val>>>(i*4))&0x0f;str+=v.toString(16);}
return str;};function Utf8Encode(string){string=string.replace(/\r\n/g,"\n");var utftext="";for(var n=0;n<string.length;n++){var c=string.charCodeAt(n);if(c<128){utftext+=String.fromCharCode(c);}
else if((c>127)&&(c<2048)){utftext+=String.fromCharCode((c>>6)|192);utftext+=String.fromCharCode((c&63)|128);}
else{utftext+=String.fromCharCode((c>>12)|224);utftext+=String.fromCharCode(((c>>6)&63)|128);utftext+=String.fromCharCode((c&63)|128);}}
return utftext;};var blockstart;var i,j;var W=new Array(80);var H0=0x67452301;var H1=0xEFCDAB89;var H2=0x98BADCFE;var H3=0x10325476;var H4=0xC3D2E1F0;var A,B,C,D,E;var temp;msg=Utf8Encode(msg);var msg_len=msg.length;var word_array=new Array();for(i=0;i<msg_len-3;i+=4){j=msg.charCodeAt(i)<<24|msg.charCodeAt(i+1)<<16|msg.charCodeAt(i+2)<<8|msg.charCodeAt(i+3);word_array.push(j);}
switch(msg_len%4){case 0:i=0x080000000;break;case 1:i=msg.charCodeAt(msg_len-1)<<24|0x0800000;break;case 2:i=msg.charCodeAt(msg_len-2)<<24|msg.charCodeAt(msg_len-1)<<16|0x08000;break;case 3:i=msg.charCodeAt(msg_len-3)<<24|msg.charCodeAt(msg_len-2)<<16|msg.charCodeAt(msg_len-1)<<8|0x80;break;}
word_array.push(i);while((word_array.length%16)!=14)word_array.push(0);word_array.push(msg_len>>>29);word_array.push((msg_len<<3)&0x0ffffffff);for(blockstart=0;blockstart<word_array.length;blockstart+=16){for(i=0;i<16;i++)W[i]=word_array[blockstart+i];for(i=16;i<=79;i++)W[i]=rotate_left(W[i-3]^W[i-8]^W[i-14]^W[i-16],1);A=H0;B=H1;C=H2;D=H3;E=H4;for(i=0;i<=19;i++){temp=(rotate_left(A,5)+((B&C)|(~B&D))+E+W[i]+0x5A827999)&0x0ffffffff;E=D;D=C;C=rotate_left(B,30);B=A;A=temp;}
for(i=20;i<=39;i++){temp=(rotate_left(A,5)+(B^C^D)+E+W[i]+0x6ED9EBA1)&0x0ffffffff;E=D;D=C;C=rotate_left(B,30);B=A;A=temp;}
for(i=40;i<=59;i++){temp=(rotate_left(A,5)+((B&C)|(B&D)|(C&D))+E+W[i]+0x8F1BBCDC)&0x0ffffffff;E=D;D=C;C=rotate_left(B,30);B=A;A=temp;}
for(i=60;i<=79;i++){temp=(rotate_left(A,5)+(B^C^D)+E+W[i]+0xCA62C1D6)&0x0ffffffff;E=D;D=C;C=rotate_left(B,30);B=A;A=temp;}
H0=(H0+A)&0x0ffffffff;H1=(H1+B)&0x0ffffffff;H2=(H2+C)&0x0ffffffff;H3=(H3+D)&0x0ffffffff;H4=(H4+E)&0x0ffffffff;}
var temp=cvt_hex(H0)+cvt_hex(H1)+cvt_hex(H2)+cvt_hex(H3)+cvt_hex(H4);return temp.toLowerCase();}
var hexcase=0;var b64pad="";var chrsz=8;function hex_md5(s){return binl2hex(core_md5(str2binl(s),s.length*chrsz));}
function b64_md5(s){return binl2b64(core_md5(str2binl(s),s.length*chrsz));}
function str_md5(s){return binl2str(core_md5(str2binl(s),s.length*chrsz));}
function hex_hmac_md5(key,data){return binl2hex(core_hmac_md5(key,data));}
function b64_hmac_md5(key,data){return binl2b64(core_hmac_md5(key,data));}
function str_hmac_md5(key,data){return binl2str(core_hmac_md5(key,data));}
function md5_vm_test()
{return hex_md5("abc")=="900150983cd24fb0d6963f7d28e17f72";}
function core_md5(x,len)
{x[len>>5]|=0x80<<((len)%32);x[(((len+64)>>>9)<<4)+14]=len;var a=1732584193;var b=-271733879;var c=-1732584194;var d=271733878;for(var i=0;i<x.length;i+=16)
{var olda=a;var oldb=b;var oldc=c;var oldd=d;a=md5_ff(a,b,c,d,x[i+0],7,-680876936);d=md5_ff(d,a,b,c,x[i+1],12,-389564586);c=md5_ff(c,d,a,b,x[i+2],17,606105819);b=md5_ff(b,c,d,a,x[i+3],22,-1044525330);a=md5_ff(a,b,c,d,x[i+4],7,-176418897);d=md5_ff(d,a,b,c,x[i+5],12,1200080426);c=md5_ff(c,d,a,b,x[i+6],17,-1473231341);b=md5_ff(b,c,d,a,x[i+7],22,-45705983);a=md5_ff(a,b,c,d,x[i+8],7,1770035416);d=md5_ff(d,a,b,c,x[i+9],12,-1958414417);c=md5_ff(c,d,a,b,x[i+10],17,-42063);b=md5_ff(b,c,d,a,x[i+11],22,-1990404162);a=md5_ff(a,b,c,d,x[i+12],7,1804603682);d=md5_ff(d,a,b,c,x[i+13],12,-40341101);c=md5_ff(c,d,a,b,x[i+14],17,-1502002290);b=md5_ff(b,c,d,a,x[i+15],22,1236535329);a=md5_gg(a,b,c,d,x[i+1],5,-165796510);d=md5_gg(d,a,b,c,x[i+6],9,-1069501632);c=md5_gg(c,d,a,b,x[i+11],14,643717713);b=md5_gg(b,c,d,a,x[i+0],20,-373897302);a=md5_gg(a,b,c,d,x[i+5],5,-701558691);d=md5_gg(d,a,b,c,x[i+10],9,38016083);c=md5_gg(c,d,a,b,x[i+15],14,-660478335);b=md5_gg(b,c,d,a,x[i+4],20,-405537848);a=md5_gg(a,b,c,d,x[i+9],5,568446438);d=md5_gg(d,a,b,c,x[i+14],9,-1019803690);c=md5_gg(c,d,a,b,x[i+3],14,-187363961);b=md5_gg(b,c,d,a,x[i+8],20,1163531501);a=md5_gg(a,b,c,d,x[i+13],5,-1444681467);d=md5_gg(d,a,b,c,x[i+2],9,-51403784);c=md5_gg(c,d,a,b,x[i+7],14,1735328473);b=md5_gg(b,c,d,a,x[i+12],20,-1926607734);a=md5_hh(a,b,c,d,x[i+5],4,-378558);d=md5_hh(d,a,b,c,x[i+8],11,-2022574463);c=md5_hh(c,d,a,b,x[i+11],16,1839030562);b=md5_hh(b,c,d,a,x[i+14],23,-35309556);a=md5_hh(a,b,c,d,x[i+1],4,-1530992060);d=md5_hh(d,a,b,c,x[i+4],11,1272893353);c=md5_hh(c,d,a,b,x[i+7],16,-155497632);b=md5_hh(b,c,d,a,x[i+10],23,-1094730640);a=md5_hh(a,b,c,d,x[i+13],4,681279174);d=md5_hh(d,a,b,c,x[i+0],11,-358537222);c=md5_hh(c,d,a,b,x[i+3],16,-722521979);b=md5_hh(b,c,d,a,x[i+6],23,76029189);a=md5_hh(a,b,c,d,x[i+9],4,-640364487);d=md5_hh(d,a,b,c,x[i+12],11,-421815835);c=md5_hh(c,d,a,b,x[i+15],16,530742520);b=md5_hh(b,c,d,a,x[i+2],23,-995338651);a=md5_ii(a,b,c,d,x[i+0],6,-198630844);d=md5_ii(d,a,b,c,x[i+7],10,1126891415);c=md5_ii(c,d,a,b,x[i+14],15,-1416354905);b=md5_ii(b,c,d,a,x[i+5],21,-57434055);a=md5_ii(a,b,c,d,x[i+12],6,1700485571);d=md5_ii(d,a,b,c,x[i+3],10,-1894986606);c=md5_ii(c,d,a,b,x[i+10],15,-1051523);b=md5_ii(b,c,d,a,x[i+1],21,-2054922799);a=md5_ii(a,b,c,d,x[i+8],6,1873313359);d=md5_ii(d,a,b,c,x[i+15],10,-30611744);c=md5_ii(c,d,a,b,x[i+6],15,-1560198380);b=md5_ii(b,c,d,a,x[i+13],21,1309151649);a=md5_ii(a,b,c,d,x[i+4],6,-145523070);d=md5_ii(d,a,b,c,x[i+11],10,-1120210379);c=md5_ii(c,d,a,b,x[i+2],15,718787259);b=md5_ii(b,c,d,a,x[i+9],21,-343485551);a=safe_add(a,olda);b=safe_add(b,oldb);c=safe_add(c,oldc);d=safe_add(d,oldd);}
return Array(a,b,c,d);}
function md5_cmn(q,a,b,x,s,t)
{return safe_add(bit_rol(safe_add(safe_add(a,q),safe_add(x,t)),s),b);}
function md5_ff(a,b,c,d,x,s,t)
{return md5_cmn((b&c)|((~b)&d),a,b,x,s,t);}
function md5_gg(a,b,c,d,x,s,t)
{return md5_cmn((b&d)|(c&(~d)),a,b,x,s,t);}
function md5_hh(a,b,c,d,x,s,t)
{return md5_cmn(b^c^d,a,b,x,s,t);}
function md5_ii(a,b,c,d,x,s,t)
{return md5_cmn(c^(b|(~d)),a,b,x,s,t);}
function core_hmac_md5(key,data)
{var bkey=str2binl(key);if(bkey.length>16)bkey=core_md5(bkey,key.length*chrsz);var ipad=Array(16),opad=Array(16);for(var i=0;i<16;i++)
{ipad[i]=bkey[i]^0x36363636;opad[i]=bkey[i]^0x5C5C5C5C;}
var hash=core_md5(ipad.concat(str2binl(data)),512+data.length*chrsz);return core_md5(opad.concat(hash),512+128);}
function safe_add(x,y)
{var lsw=(x&0xFFFF)+(y&0xFFFF);var msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&0xFFFF);}
function bit_rol(num,cnt)
{return(num<<cnt)|(num>>>(32-cnt));}
function str2binl(str)
{var bin=Array();var mask=(1<<chrsz)-1;for(var i=0;i<str.length*chrsz;i+=chrsz)
bin[i>>5]|=(str.charCodeAt(i/chrsz)&mask)<<(i%32);return bin;}
function binl2str(bin)
{var str="";var mask=(1<<chrsz)-1;for(var i=0;i<bin.length*32;i+=chrsz)
str+=String.fromCharCode((bin[i>>5]>>>(i%32))&mask);return str;}
function binl2hex(binarray)
{var hex_tab=hexcase?"0123456789ABCDEF":"0123456789abcdef";var str="";for(var i=0;i<binarray.length*4;i++)
{str+=hex_tab.charAt((binarray[i>>2]>>((i%4)*8+4))&0xF)+
hex_tab.charAt((binarray[i>>2]>>((i%4)*8))&0xF);}
return str;}
function binl2b64(binarray)
{var tab="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var str="";for(var i=0;i<binarray.length*4;i+=3)
{var triplet=(((binarray[i>>2]>>8*(i%4))&0xFF)<<16)|(((binarray[i+1>>2]>>8*((i+1)%4))&0xFF)<<8)|((binarray[i+2>>2]>>8*((i+2)%4))&0xFF);for(var j=0;j<4;j++)
{if(i*8+j*6>binarray.length*32)str+=b64pad;else str+=tab.charAt((triplet>>6*(3-j))&0x3F);}}
return str;}
var selectioncolor="#FFEEEE";var bgcolor="#DDCCCC";var hdrcolor="#BBAAAA";var dt;function fok_us()
{this.focus();}
function DbInit()
{dt=lang.get_strings("db");}
function DbColData(data)
{this.split_type=function(typestring)
{var spl=typestring.split('(');this.type=spl[0];if(spl[1]){spl=spl[1].split(')');this.typedata=spl[0];}}
this.type=data.type;this.name=data.name;this.nul=data.not_null!=0;this.def=data.def;this.extra=data.Extra;this.key=data.primary_key;this.pwd=false;}
function DbData(data,editable,deletable)
{this.data=data;this.editable=true;this.deletable=true;if(editable)this.editable=editable;if(deletable)this.deletable=editable;}
function changefield(e)
{e.target.value=addslashes(e.target.value);}
function CellTextInputField(coldata,val,xtra)
{var d=document.createElement("textarea");if(val==null)val="NULL";d.value=val;d.rows=10;d.onchange=changefield;d.xtra=xtra;d.oldval=val;d.onselectstart=null;return d;}
function CellInputField(coldata,val,xtra)
{var d=document.createElement("input");if(val==null&&coldata.extra)val=coldata.extra;if(val==null)val="NULL";d.value=val;d.onchange=changefield;d.xtra=xtra;d.oldval=val;d.onselect=null;d.onselectstart=null;return d;}
function CellOptionField(opts,val,cb,xtra)
{var d=document.createElement("select");var O=opts.length;d.selectedIndex=-1;for(i=0;i<O;i++){var opt=opts[i];if(opt==""||opt==",")continue;var o=document.createElement("option");o.innerHTML=opt;d.appendChild(o);if(opt==val){d.selectedIndex=i;}}
d.onchange=cb;return d;}
function EnumOptionField(coldata,val,xtra)
{var opts=coldata.typedata.replace(/'/g,"");opts=opts.split(",");return CellOptionField(opts,val,null,xtra);}
function CellEditor(coldata,val,xtra)
{switch(coldata.type){case"enum":d=EnumOptionField(coldata,val,xtra);break;case"text":d=CellTextInputField(coldata,val,xtra);break;default:d=CellInputField(coldata,val,xtra);if(coldata.pwd)d.type="passwd";break;}
d.onmouseup=fok_us;return d;}
function DbSelectTable(maindiv,query,cb)
{var thisobj=this;thisobj.maindiv=maindiv;thisobj.query=query;this.get_query=function()
{var jc=new JsonContext("feyenoord/db.php");var jm=new JsonMessage("get_selection");var query=thisobj.query;jm.add_object(thisobj.loginkey);jm.add_object(query);msg=jc.get_sync(jm);stat=msg.get_status(0);if(stat!='ok')
return null;var rows=msg.get_object(0);return rows;}
var rows=this.get_query();var opts=Array();opts[0]="select one";for(r=0;r<rows.length;r++){opts[r+1]=rows[r][0];}
var sel=CellOptionField(opts,"",cb,null);maindiv.appendChild(sel);}
function DbQueryTable(maindiv,loginkey,query)
{var thisobj=this;thisobj.maindiv=maindiv;thisobj.rows=Array();thisobj.query=query;thisobj.selectedrow=-1;thisobj.loginkey=loginkey;this.getselectedrow=function()
{return thisobj.selectedrow;}
this.setselectioncb=function(cb)
{this.selcb=cb;}
function deselect(r)
{if(r<0)return;var i=0;var row=thisobj.rows[r];for(c in row.data){var col=row.data[c];var tc=row.tr.childNodes[i++];}
row.selected=false;if(thisobj.selcb)thisobj.selcb(r,false,row.data);}
function select(r)
{var i=0;var row=thisobj.rows[r];for(c in row.data){var col=row.data[c];var tc=row.tr.childNodes[i++];tc.style.background=selectioncolor;}
row.selected=true;thisobj.selectedrow=r;if(thisobj.selcb)thisobj.selcb(r,true,row.data);}
function rowselect()
{deselect(thisobj.selectedrow);thisobj.selectedrow=this.r;select(this.r);}
this.generate_table=function(base)
{var r=0;var row;var tbl=document.createElement("table");if(base){for(b=0;b<base.length;b++){row=base[b];row.tr=tbl.insertRow(r);var t=0;for(c in row.data){var mem=row.data[c];var tc=row.tr.insertCell(t);if(mem==null)mem="NULL";tc.innerHTML=mem;tc.onclick=rowselect;tc.r=r;tc.className="DbTable";t++;}
r++;}}
if(!row)return tbl;var tr=tbl.insertRow(0);t=0;for(c in row.data){var tc=tr.insertCell(t);tc.innerHTML=c;tc.className="DbTableHeader";t++;}
return tbl;}
this.generate_row_table=function()
{return this.generate_table(this.rows);}
this.get_query=function()
{var jc=new JsonContext("feyenoord/db.php");var jm=new JsonMessage("get_query");jm.add_object(thisobj.loginkey);jm.add_object(query);msg=jc.get_sync(jm);stat=msg.get_status(0);if(stat!='ok')
return null;var rows=msg.get_object(0);return rows;}
var rows=this.get_query(query);var l=0;if(rows){for(r=0;r<rows.length;r++)
this.rows[l++]=new DbData(rows[r]);}
this.maintbl=this.generate_row_table();maindiv.appendChild(this.maintbl);}
function DbEditTable(maindiv,loginkey,tbname,query)
{var thisobj=this;thisobj.maindiv=maindiv;thisobj.cols=Array();thisobj.rows=Array();thisobj.ce=Array();thisobj.tbname=tbname;thisobj.selectedrow=-1;thisobj.loginkey=loginkey;thisobj.query=query;this.set_icon=function(domelm,img,cb,active,xtra)
{var button=document.createElement("button");domelm.appendChild(button);button.style.width="16px";button.style.height="16px";button.style.border="0px";set_img_single(button,img);button.onmouseup=cb;button.data=xtra;if(active==false){button.disabled=true;dom_set_opacity(button,0.2);}
return button;}
this.ispassword=function(row)
{thisobj.cols[row].pwd=true;}
this.getselectedrow=function()
{return thisobj.selectedrow;}
function deselect(r)
{if(r<0)return;var i=0;var row=thisobj.rows[r];for(c in row.data){var col=row.data[c];var tc=row.tr.childNodes[i++];}
row.selected=false;if(thisobj.selcb)thisobj.selcb(r,false,row.data);}
function select(r)
{var i=0;var row=thisobj.rows[r];for(c in row.data){var col=row.data[c];var tc=row.tr.childNodes[i++];tc.style.background=selectioncolor;}
row.selected=true;thisobj.selectedrow=r;if(thisobj.selcb)thisobj.selcb(r,true,row.data);}
function set_editable(r)
{var i=0;var row=thisobj.rows[r];for(c in row.data){var col=row.data[c];var coldata=thisobj.cols[i];var tc=row.tr.childNodes[i++];thisobj.ce[c]=new CellEditor(coldata,col,row);remove_children(tc);tc.appendChild(thisobj.ce[c]);thisobj.ce[c].style.width='100%';}
thisobj.editrow=row;}
function rowselect()
{deselect(thisobj.selectedrow);thisobj.selectedrow=this.r;select(this.r);}
function reset_editable()
{var i=0;var row=thisobj.editrow;for(c in row.data){var col=row.data[c];var tc=row.tr.childNodes[i];remove_children(tc);tc.innerHTML=col;tc.r=i;i++;}
thisobj.editrow=null;}
thisobj.db_write=function()
{if(thisobj.editrow){var changed=thisobj.what_to_do();if(changed=="update"){var x=confirm("Save changes ?");if(x)thisobj.update();}else
if(changed=="insert"){var x=confirm("Save new line ?");if(x)thisobj.update();thisobj.insert();}
reset_editable();}}
function editcb()
{var i=0;var r=this.data;thisobj.db_write();set_editable(r);}
this.del=function(r)
{var row=thisobj.rows[r];var i=0;var nkey=0;var keys=" WHERE ";for(c in row.data){var col=row.data[c];if(thisobj.cols[i].key!=""){if(nkey>0)keys+=" AND ";keys+=thisobj.cols[i].name+"='"+col+"'";nkey++;}
i++;}
var rows=thisobj.del_row(keys);var l=0;thisobj.rows=Array();if(rows){for(r=0;r<rows.length;r++){thisobj.rows[l++]=new DbData(rows[r]);}}
thisobj.maindiv.removeChild(thisobj.maintbl);thisobj.maintbl=thisobj.generate_row_table();thisobj.maindiv.appendChild(thisobj.maintbl);}
this.insert=function()
{var row=thisobj.editrow;var i=0;var hdrs="";var vals="";for(c in row.data){var newval=thisobj.ce[c].value;if(i>0){hdrs+=",";vals+=",";}
hdrs+="`"+thisobj.cols[i].name+"`"
vals+="'"+newval+"'"
i++;}
qry="("+hdrs+") VALUES ("+vals+")";var rows=this.ins_row(qry);var l=0;if(rows){for(r=0;r<rows.length;r++)
thisobj.rows[l++]=new DbData(rows[r]);}
thisobj.maindiv.removeChild(thisobj.maintbl);thisobj.maintbl=thisobj.generate_row_table();thisobj.maindiv.appendChild(thisobj.maintbl);}
this.update=function()
{var row=thisobj.editrow;var i=0;var nkey=0;var keys=" WHERE ";var nupd=0;var upds=" SET ";for(c in row.data){var col=row.data[c];if(thisobj.cols[i].key!=""){if(nkey>0)keys+=" AND ";keys+=thisobj.cols[i].name+"='"+col+"'";nkey++;}
var newval=thisobj.ce[c].value;if(newval!=col){if(nupd>0)upds+=",";if(newval=="null"||newval=="NULL")
upds+=thisobj.cols[i].name+"=NULL";else
upds+="`"+thisobj.cols[i].name+"`='"+newval+"'";nupd++;}
i++;}
qry=upds+keys;var rows=this.set_row(qry);var l=0;if(rows)
for(r=0;r<rows.length;r++)
thisobj.rows[l++]=new DbData(rows[r]);thisobj.maindiv.removeChild(thisobj.maintbl);thisobj.maintbl=thisobj.generate_row_table();thisobj.maindiv.appendChild(thisobj.maintbl);}
this.what_to_do=function()
{var action="nothing";var row=thisobj.editrow;var i=0;for(c in row.data){var col=row.data[c];var coldata=thisobj.cols[i];var newval=thisobj.ce[c].value;if(newval!=col){action="update";if(col==null&&(newval=="NULL"||newval=="null"))
action="nothing";}
if(coldata.key!=""){if(col==""||col==null||newval=="auto_increment"){return"insert";}}
i++;}
return action;}
function delcb()
{var row=this.data;var yes=confirm("Do you realy want to delete this row ?");if(!yes)return;thisobj.del(row);}
function savecb()
{thisobj.db_write();}
function empty_row(coldata)
{var o=new Object();if(coldata){for(c=0;c<coldata.length;c++){var col=coldata[c];o[col.name]=col.def;}}
return o;}
function inscb()
{var i=0;var r=this.data;thisobj.db_write();thisobj.rows.splice(0,0,new DbData(empty_row(thisobj.cols)));thisobj.maindiv.removeChild(thisobj.maintbl);thisobj.maintbl=thisobj.generate_row_table();thisobj.maindiv.appendChild(thisobj.maintbl);set_editable(0);}
this.set_edit_icon=function(tc,row,r)
{return this.set_icon(tc,"feyenoord/images/stock_edit.png",editcb,row.editable,r);}
this.set_trash_icon=function(tc,row,r)
{return this.set_icon(tc,"feyenoord/images/stock_delete.png",delcb,row.deletable,r);}
this.set_insert_icon=function(tc,active,data)
{return this.set_icon(tc,"feyenoord/images/stock_insert-rows.png",inscb,active,data);}
this.set_save_icon=function(tc,active,data)
{return this.set_icon(tc,"feyenoord/images/stock_save.png",savecb,active,data);}
this.generate_table=function(base)
{var r=0;var tbl=document.createElement("table");if(base){for(b=0;b<base.length;b++){var row=base[b];row.editable=true;row.deletable=true;row.tr=tbl.insertRow(r);var t=0;for(c in row.data){var mem=row.data[c];var tc=row.tr.insertCell(t);if(mem==null)mem="NULL";tc.innerHTML=mem;tc.r=r;tc.className="DbTable";t++;}
tc=row.tr.insertCell(t++);tc.className="DbTable";var ei=this.set_edit_icon(tc,row,r);tc=row.tr.insertCell(t++);var ti=this.set_trash_icon(tc,row,r);r++;}}
var tr=tbl.insertRow(0);t=0;if(this.cols)
for(c=0;c<this.cols.length;c++){var tc=tr.insertCell(t);col=this.cols[c];tc.innerHTML=col.name;tc.className="DbTableHeader";t++;}
tc=tr.insertCell(t++);tc.className="DbTableHeader";var ei=this.set_insert_icon(tc);tc=tr.insertCell(t++);tc.className="DbTableHeader";var ti=this.set_save_icon(tc);return tbl;}
this.generate_col_table=function()
{return this.generate_table(this.cols);}
this.generate_row_table=function()
{return this.generate_table(this.rows);}
this.get_cols=function()
{var jc=new JsonContext("feyenoord/db.php");var jm=new JsonMessage("get_cols");jm.add_object(thisobj.loginkey);jm.add_object(tbname);msg=jc.get_sync(jm);stat=msg.get_status();if(stat!='ok'){alert(msg.get_object(0));return null;}
var cols=msg.get_object(0);return cols;}
this.get_rows=function()
{var jc=new JsonContext("feyenoord/db.php");var jm=new JsonMessage("get_rows");jm.add_object(thisobj.loginkey);jm.add_object(tbname);msg=jc.get_sync(jm);stat=msg.get_status(0);if(stat!='ok')
return null;var rows=msg.get_object(0);return rows;}
this.get_rowcols=function()
{var jc=new JsonContext("feyenoord/db.php");var jm=new JsonMessage("get_rowcols");jm.add_object(thisobj.loginkey);jm.add_object(tbname);jm.add_object(thisobj.query);msg=jc.get_sync(jm);stat=msg.get_status(0);if(stat!='ok')
return null;var rows=msg.get_object(0);var cols=msg.get_object(1);var l=0;if(cols){for(c=0;c<cols.length;c++)
this.cols[l++]=new DbColData(cols[c]);}
l=0;if(rows){for(r=0;r<rows.length;r++)
this.rows[l++]=new DbData(rows[r]);}}
this.ins_row=function(qry)
{var jc=new JsonContext("feyenoord/db.php");var jm=new JsonMessage("ins_row");jm.add_object(thisobj.loginkey);jm.add_object(thisobj.query);jm.add_object(this.tbname);jm.add_object(qry);msg=jc.get_sync(jm);rows=msg.get_object(0);return rows;}
this.set_row=function(qry)
{var jc=new JsonContext("feyenoord/db.php");var jm=new JsonMessage("set_row");jm.add_object(thisobj.loginkey);jm.add_object(thisobj.query);jm.add_object(this.tbname);jm.add_object(qry);msg=jc.get_sync(jm);rows=msg.get_object(0);return rows;}
this.del_row=function(keys)
{var jc=new JsonContext("feyenoord/db.php");var jm=new JsonMessage("del_row");jm.add_object(thisobj.loginkey);jm.add_object(this.query);jm.add_object(this.tbname);jm.add_object(keys);msg=jc.get_sync(jm);rows=msg.get_object(0);return rows;}
this.get_rowcols(this.query);this.maintbl=this.generate_row_table();maindiv.appendChild(this.maintbl);}
function ResizeContext()
{var obs=new Array();function redraw(e)
{var len=obs.length;for(r=0;r<len;r++){var o=obs[r];if(o.redraw)o.redraw(e);}}
onresize=redraw;document.onResize=redraw;this.add=function(obj)
{var l=obs.length;if(!obj.redraw){alert("Your object MUST implement the redraw() method");return;}
obs[l]=obj;}}
global.resizecontext=new ResizeContext();
function Point2D(x,y)
{this.x=x;this.y=y;}
function PointOnCubicBezier(cp,t)
{var ax,bx,cx;var ay,by,cy;var tSquared,tCubed;cx=3.0*(cp[1].x-cp[0].x);bx=3.0*(cp[2].x-cp[1].x)-cx;ax=cp[3].x-cp[0].x-cx-bx;cy=3.0*(cp[1].y-cp[0].y);by=3.0*(cp[2].y-cp[1].y)-cy;ay=cp[3].y-cp[0].y-cy-by;tSquared=t*t;tCubed=tSquared*t;var x=(ax*tCubed)+(bx*tSquared)+(cx*t)+cp[0].x;var y=(ay*tCubed)+(by*tSquared)+(cy*t)+cp[0].y;return new Point2D(x,y);;}
function ComputeBezier(cp,numberOfPoints)
{var dt;var i;var avg=new Point2D(0,0);var curve=new Array();var traject=new Array();dt=1.0/(numberOfPoints-1);for(i=0;i<numberOfPoints;i++){curve[i]=PointOnCubicBezier(cp,i*dt);avg.y+=curve[i].y;}
var acc=0.0;for(i=0;i<numberOfPoints;i++){acc+=curve[i].y/avg.y;traject[i]=acc;}
return traject;}
function test_bezier()
{var p0=new Point2D(2.0,2.0);var p1=new Point2D(12.0,4.0);var p2=new Point2D(5.0,14.0);var p3=new Point2D(9.0,14.0);var cp=new Array(p0,p1,p2,p3);var result=new Array();result=ComputeBezier(cp,10);var x=0;for(var i=0;i<10;i++){x+=result[i];print(result[i]+":"+x);}}
function parabola(c,a,i)
{return(i*i*a)+c;}
function ComputeParabola(c,a)
{var t=0;var avg=0;var curve=new Array();var i=0;val=c;do{curve[t]=val;i++;t++;val=parabola(c,a,i);}while(val>=0)
return curve;}
function ComputeBounce(distance,speed,dissipation)
{var result=new Array();var traject=new Array();if(!dissipation)dissipation=3;if(!speed)speed=16;result=ComputeParabola(16384,-1*speed);var l=result.length;var x=0;var step=1;var distance=567;for(var i=0;i<l;i+=step){traject[x]=1.0-(result[i])/16384/step;x++;}
distance/=dissipation;step*=dissipation;while(distance>1){for(var i=l-1;i>=0;i-=step){traject[x]=1.0-(result[i])/16384/step;x++;}
for(var i=0;i<l;i+=step){traject[x]=1.0-(result[i])/16384/step;x++;}
distance/=dissipation;step*=dissipation;}
return traject;}
function test()
{var traject=ComputeBounce(567);l=traject.length;for(var i=0;i<l;i++){print(traject[i]);}
print(l);}
function day_minutes(t)
{var d=new Date(t);return d.getMinutes();}
function day_hours(t)
{var d=new Date(t);return d.getHours();}
function time_format(t)
{if(t<87000000){var s=t/1000;var h=Math.floor(s/3600);var m=Math.round((s-(h*3600))/60);}else{var d=new Date(t);var h=d.getHours();var m=d.getMinutes();}
if(m<10)m='0'+m;return h+":"+m;}
function addslashes(str){if(!str)return str;str=str.replace(/\\/g,'\\\\');str=str.replace(/\'/g,'\\\'');str=str.replace(/\"/g,'\\"');str=str.replace(/\0/g,'\\0');return str;}
function stripslashes(str){if(!str)return str;str=str.replace(/\\'/g,'\'');str=str.replace(/\\"/g,'"');str=str.replace(/\\0/g,'\0');str=str.replace(/\\\\/g,'\\');return str;}
function dur_format(s)
{var ret;s/=1000;var h=Math.floor(s/3600);var m=Math.round((s-(h*3600))/60);if(m<10)m='0'+m;return h+":"+m;}
function hour_format(s)
{if(s>100000000000)s/=1000;var d=new Date(s*1000);h=d.getHours();return h;}
var wds=new Array("Sun","Mon","Tue","Wed","Thu","Fri","Sat");var mnts=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");var dgn=new Array("zo","ma","di","wo","do","vr","za");var dagen=new Array("Zondag","Maandag","Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag");var maanden=new Array("Januari","Februari","Maart","April","Mei","Juni","Juli","Augustus","September","Oktober","November","December");function nl_date(t)
{var d;if(t==undefined)
d=new Date();else
d=new Date(t*1000);m=d.getMonth();wd=d.getDay();d=d.getDate();return dagen[wd]+" "+d+" "+maanden[m];}
function nl_wd(d)
{return dgn[d];}
function nl_weekday(d)
{return dagen[d];}
function nl_month(t)
{var d;if(t==undefined)
d=new Date();else
d=new Date(t*1000);m=d.getMonth();return maanden[m];}
function date_format(s)
{var d=new Date(s*1000);m=d.getMonth();wd=d.getDay();d=d.getDate();return wds[wd]+" "+d+" "+mnts[m];}
function mysql_date_format(d)
{y=d.getFullYear();m=d.getMonth()+1;if(m<10)m='0'+m;d=d.getDate();if(d<10)d='0'+d;return y+"-"+m+"-"+d;}
function mysql_time_format(d)
{h=d.getHours();if(h<10)h='0'+h;m=d.getMinutes();if(m<10)m='0'+m;s=d.getSeconds();if(s<10)s='0'+s;return h+":"+m+":"+s;}
function mysql_datetime_format(d)
{return mysql_date_format(d)+" "+mysql_time_format(d);}
function mysql_parse_date(dt)
{var split=dt.split("-")
var d=new Date();yr=parseInt(split[0],10);mon=parseInt(split[1],10);day=parseInt(split[2],10);d.setSeconds(0);d.setMinutes(0);d.setHours(0);d.setDate(day);d.setMonth(mon-1);d.setFullYear(yr);return d;}
function mysql_parse_datetime(dt)
{var d=new Date();var split=dt.split(" ")
var splitd=split[0].split("-")
var splitt=split[1].split(":")
yr=parseInt(splitd[0],10);mon=parseInt(splitd[1],10);day=parseInt(splitd[2],10);hr=parseInt(splitt[0],10);min=parseInt(splitt[1],10);sec=parseInt(splitt[2],10);d.setSeconds(sec);d.setMinutes(min);d.setHours(hr);d.setDate(day);d.setMonth(mon-1);d.setFullYear(yr);return d;}
function gues_format(s,gap)
{if(gap>=24*3600000)
return date_format(s);else
return time_format(s);}
function last_midnight(t)
{midnight=t;if(!midnight)
midnight=new Date()
midnight.setHours(0);midnight.setMinutes(0);midnight.setSeconds(0);midnight.setMilliseconds(0);start=midnight.getTime();start=Math.floor(start);return start;}
function last_monday(before)
{wd=before.getDay();before.setSeconds(0);before.setHours(0);before.setMinutes(0);midnight=before.getTime()-(wd-1)*24*3600*1000;before=new Date(midnight);return before;}
function last_sunday(before)
{wd=before.getDay();before.setSeconds(0);before.setHours(0);before.setMinutes(0);midnight=before.getTime()-wd*24*3600*1000;before=new Date(midnight);return before;}
function start_of_month(before)
{wd=before.getDay();before.setSeconds(0);before.setHours(0);before.setMinutes(0);before.setDate(1);midnight=before.getTime()-wd*24*3600*1000;before=new Date(midnight);return before;}
function get_tzo()
{var d=new Date();return d.getTimezoneOffset();}
function next_midnight(t)
{start=last_midnight(t);end=start+60*60*24*1000;return end;}
function printf()
{var s="";for(var i=0;i<arguments.length;i++){s=s+arguments[i]+" ";}
if(typeof(console)!="undefined")
console.log(s);else if(typeof(alert)!="undefined");else
print(s);}
function TimeWindow(start,end)
{this.start=start;this.end=end;}
var NOTIME=-Infinity;;var VERY_EARLY=-999999999999999
var BOT=0;var EOT=Infinity;;var MSEC_IN_DAY=86400000;function smaller_ts(a,b)
{if(a>NOTIME&&b>NOTIME)return a<b;if(a>NOTIME)return 1;return false;}
function bigger_ts(a,b)
{if(a>NOTIME&&b>NOTIME)return a>b;if(a>NOTIME)return 0;return true;}
function regular_prev(ip,before)
{if(before<ip.start)return BOT;return Math.floor((before-ip.start)/ip.period)*ip.period+ip.start;}
function regular_next(ip,after)
{var rval=(Math.floor((after-ip.start)/ip.period)+1)*ip.period+ip.start;return rval;}
function checked_next_start(tp,start,limit)
{var result=0;var s=start;var e=limit;result=tp.next_start(tp,s,e);if(result>start)return result;return EOT;}
function checked_next_end(tp,start,limit)
{var result=0;result=tp.next_end(tp,start,limit);if(result>start)return result;return EOT;}
function checked_prev_end(tp,start,limit)
{var result=0;result=tp.prev_end(tp,start,limit);if(result<=start)return result;return BOT;}
function checked_prev_start(tp,start,limit)
{var result=0;result=tp.prev_start(tp,start,limit);if(result<start)return result;return BOT;}
function IS_SINGLE_TW(ptrn){return ptrn.iv.period==0;}
function leaf_next_start(ptrn,after,limit)
{var p=0;var n=0;var nn=0;var s=0;var e=0;var start=ptrn.tw.start;var end=ptrn.tw.end;if(IS_SINGLE_TW(ptrn)){if(start<after)start=after;if(end>limit)end=limit;if(end<start)return EOT;if(after<start)return start;return limit;}
p=ptrn.iv.prev(ptrn.iv,after);if(p==BOT)p=after;n=ptrn.iv.next(ptrn.iv,p);if(n==EOT)return limit;do{if(start<0)s=n+start;else s=p+start;if(end<0)e=n+end;else e=p+end;if(s>=n)s=EOT;if(s<p)s=p;if(e>n)e=n;if(e<p)e=BOT;p=n;n=ptrn.iv.next(ptrn.iv,p);}while(s<limit&&s<after&&s<e);if(!n||s>e)return limit;if(s<=after){return limit;}
return s;}
function leaf_next_end(ptrn,after,limit)
{var p=0,n=0,nn=0,s=0;var e=0;var start=ptrn.tw.start;var end=ptrn.tw.end;if(IS_SINGLE_TW(ptrn)){if(start<after)start=after;if(end>limit)end=limit;if(end<after||start>limit)return EOT;if(after<=end)return end;return limit;}
p=ptrn.iv.prev(ptrn.iv,after);if(p==BOT)p=after;n=ptrn.iv.next(ptrn.iv,p);if(n==EOT)return limit;do{if(end<0)e=n+end;else e=p+end;if(start<0)s=n+start;else s=p+start;if(s>=n)s=EOT;if(s<p)s=p;if(e>n)e=n;if(e<p)e=BOT;p=n;n=ptrn.iv.next(ptrn.iv,p);}while(e<limit&&e<after&&s<e);if(n==NOTIME)return limit;return e;}
function leaf_prev_start(ptrn,before,limit)
{var p=0;var n=0;var s=0;var e=0;var start=ptrn.tw.start;var end=ptrn.tw.end;if(IS_SINGLE_TW(ptrn)){if(start>end||start<0||end<0)return BOT;if(before>ptrn.tw.start)return ptrn.tw.start;return limit;}
p=ptrn.iv.prev(ptrn.iv,before);if(!p)return limit;n=ptrn.iv.next(ptrn.iv,p);do{if(start<0)s=n+start;else s=p+start;if(end<0)e=n+end;else e=p+end;if(s>=n)s=EOT;if(s<p)s=p;if(e>n)e=n;if(e<=p)e=VERY_EARLY;n=p;p=ptrn.iv.prev(ptrn.iv,n-1);}while(p>limit&&s>before&&s<=e);if(!p||s>e)return limit;return s;}
function leaf_prev_end(ptrn,before,limit)
{var p=0;var n=0;var s=0;var e=0;var start=ptrn.tw.start;var end=ptrn.tw.end;if(IS_SINGLE_TW(ptrn)){if(start>end||end<0||start<0)return BOT;if(before>ptrn.tw.end)return ptrn.tw.end;return limit;}
p=ptrn.iv.prev(ptrn.iv,before);if(!p)return limit;n=ptrn.iv.next(ptrn.iv,p);do{if(end<0)e=n+end;else e=p+end;if(start<0)s=n+start;else s=p+start;if(s>=n)s=EOT;if(s<p)s=p;if(e>n)e=n;if(e<=p)e=VERY_EARLY;n=p;p=ptrn.iv.prev(ptrn.iv,n-1);}while(e>limit&&e>before&&s<=e);if(!p||s>e)return limit;return e;}
function leaf_valid(ptr,at)
{var n=checked_next_start(ptr,at-1,EOT);var s=checked_prev_start(ptr,at,BOT);var e=checked_prev_end(ptr,at,BOT);var t;if(e==BOT)return false;if(n==at&&n!=e)return true;t=checked_next_end(ptr,s,EOT);if(e<=s&&s!=t)return true;else return false;}
function not_next_start(ptrn,after,limit)
{var rval=ptrn.op1.next_end(ptrn.op1,after,limit);if(rval<after)return EOT;if(rval!=EOT)return rval;return rval;}
function not_next_end(ptrn,after,limit)
{var rval=ptrn.op1.next_start(ptrn.op1,after,limit);if(rval<after)return EOT;return rval;}
function not_prev_start(ptrn,before,limit)
{var rval=checked_prev_end(ptrn.op1,before,limit);return rval;}
function not_prev_end(ptrn,before,limit)
{var rval=checked_prev_start(ptrn.op1,before,limit);return rval;}
function not_valid(ptrn,at)
{var rval=ptrn.op1.valid(ptrn.op1,at);return!rval;}
function or_next_start(ptrn,after,limit)
{var ra,rb;ra=checked_next_start(ptrn.op1,after,limit);rb=checked_next_start(ptrn.op2,after,limit);return smaller_ts(ra,rb)?ra:rb;}
function or_next_end(ptrn,after,limit)
{var sa=checked_next_start(ptrn.op1,after,limit);var sb=checked_next_start(ptrn.op2,after,limit);var ea=checked_next_end(ptrn.op1,after,limit);var eb=checked_next_end(ptrn.op2,after,limit);if(sa>ea)sa=after;if(sb>eb)sb=after;while(after<limit){if(ea<eb){after=ea;if(sb>after+1)return after;sa=checked_next_start(ptrn.op1,after,limit);ea=checked_next_end(ptrn.op1,sa,limit);}else{after=eb;if(sa>after+1)return after;sb=checked_next_start(ptrn.op2,after,limit);eb=checked_next_end(ptrn.op2,sb,limit);}}
return limit;}
function or_prev_start(ptrn,before,limit)
{var sa=checked_prev_start(ptrn.op1,before,limit);var sb=checked_prev_start(ptrn.op2,before,limit);var ea=checked_prev_end(ptrn.op1,before,limit);var eb=checked_prev_end(ptrn.op2,before,limit);if(sa>ea)ea=before;if(sb>eb)eb=before;while(before>limit){if(sa>sb){before=sa;if(eb<before-1)return before;ea=checked_prev_end(ptrn.op1,before,limit);sa=checked_prev_start(ptrn.op1,ea,limit);}else{before=sb;if(ea<before-1)return before;eb=checked_prev_end(ptrn.op2,before,limit);sb=checked_prev_start(ptrn.op2,eb,limit);}}
return limit;}
function or_prev_end(ptrn,before,limit)
{var ra,rb;ra=checked_prev_end(ptrn.op1,before,limit);rb=checked_prev_end(ptrn.op2,before,limit);return ra>rb?ra:rb;}
function or_valid(ptrn,at)
{var valid;valid=ptrn.op1.valid(ptrn.op1,at);valid|=ptrn.op2.valid(ptrn.op2,at);return valid;}
function and_next_start(ptrn,after,limit)
{var sa=checked_next_start(ptrn.op1,after,limit);var sb=checked_next_start(ptrn.op2,after,limit);var ea=checked_next_end(ptrn.op1,after,limit);var eb=checked_next_end(ptrn.op2,after,limit);if(sa>ea)sa=after;if(sb>eb)sb=after;while(after<limit){if(sa>sb){after=sa;if(eb>after-1)return after;sb=checked_next_start(ptrn.op2,after,limit);eb=checked_next_end(ptrn.op2,after,limit);if(sb>eb)sb=after;}else{after=sb;if(ea>after-1)return after;sa=checked_next_start(ptrn.op1,after,limit);ea=checked_next_end(ptrn.op1,after,limit);if(sa>ea)sa=after;}}
return limit;}
function and_next_end(ptrn,after,limit)
{var ea=checked_next_end(ptrn.op1,after,limit);var eb=checked_next_end(ptrn.op2,after,limit);if(ea&&eb)return(ea<eb)?ea:eb;if(!ea&&eb)return eb;if(ea&&!eb)return ea;return limit;}
function and_prev_start(ptrn,after,limit)
{var ea=checked_prev_start(ptrn.op1,after,limit);var eb=checked_prev_start(ptrn.op2,after,limit);if(ea&&eb)return(ea>eb)?ea:eb;if(!ea&&eb)return ea;if(ea&&!eb)return eb;return limit;}
function and_prev_end(ptrn,before,limit)
{var sa=checked_prev_start(ptrn.op1,before,limit);var sb=checked_prev_start(ptrn.op2,before,limit);var ea=checked_prev_end(ptrn.op1,before,limit);var eb=checked_prev_end(ptrn.op2,before,limit);if(sa>ea)ea=before;if(sb>eb)eb=before;while(before>limit){if(ea<eb){before=ea;if(sb<before)return before;eb=checked_prev_end(ptrn.op2,before,limit);sb=checked_prev_start(ptrn.op2,eb,limit);}else{before=eb;if(sa<before)return before;ea=checked_prev_end(ptrn.op1,before,limit);sa=checked_prev_start(ptrn.op1,ea,limit);}}
return limit;}
function and_valid(ptrn,at)
{var valid;valid=ptrn.op1.valid(ptrn.op1,at);valid&=ptrn.op2.valid(ptrn.op2,at);return valid;}
function traverse_fwd(start,stop,tp,what,handle)
{var end;var valid;if(start<0)start=0;if(stop<0)stop=0;end=start;valid=tp.valid(tp,start);if(!valid){if((start=checked_next_start(tp,start,stop))>stop)
return;}
if((end=checked_next_end(tp,start,stop))>stop||end>stop)
end=stop;while(start<stop&&start!=NOTIME&&end!=NOTIME){if(end>start)
what(start,end,handle);if((start=tp.next_start(tp,end,stop))>stop)
return;if((end=checked_next_end(tp,start,stop))>stop)
end=stop;}}
function traverse_windows(start,stop,tp,what,handle)
{if(start<stop)
traverse_fwd(start,stop,tp,what,handle);else
traverse_bwd(start,stop,tp,what,handle);}
function YearInterval()
{this.prev=function(ival,before)
{before--;var d=new Date(before);y=d.getFullYear();d.setSeconds(0);d.setMinutes(0);d.setHours(0);d.setDate(1);d.setMonth(0);y--;d.setFullYear(y);return d.getTime();}
this.next=function(ival,after)
{after++;var d=new Date(after);y=d.getFullYear();d.setSeconds(0);d.setMinutes(0);d.setHours(0);d.setDate(1);d.setMonth(0);y++;d.setFullYear(y);return d.getTime();}}
DayInterval.mon=1;DayInterval.tue=2;DayInterval.wed=3;DayInterval.thu=4;DayInterval.fri=5;DayInterval.sat=6;DayInterval.sun=7;function DayInterval(which)
{if(which&&which>=1&&which<=7){this.start=((which+7)-4)*MSEC_IN_DAY;this.period=7*MSEC_IN_DAY;}else{this.start=4*MSEC_IN_DAY;this.period=1*MSEC_IN_DAY;}
this.prev=function(ival,before)
{before--;return Math.floor(((before-this.start)/this.period))*this.period+this.start;}
this.next=function(ival,after)
{after++;return Math.floor(((after-this.start)/this.period)+1)*this.period+this.start;}}
MonthInterval.jan=1;MonthInterval.feb=2;MonthInterval.mar=3;MonthInterval.apr=4;MonthInterval.may=5;MonthInterval.jun=6;MonthInterval.jul=7;MonthInterval.aug=8;MonthInterval.sep=9;MonthInterval.oct=10;MonthInterval.nov=11;MonthInterval.dec=12;function MonthInterval(which)
{if(which)this.which=which;this.prev=function(ival,before)
{before--;var d=new Date(before);m=d.getUTCMonth();y=d.getUTCFullYear();d.setUTCSeconds(0);d.setUTCMinutes(0);d.setUTCHours(0);d.setUTCDate(1);if(this.which){if(m<=this.which-1)y--;m=this.which;}
if(m<0){y--;m=11;}
d.setUTCFullYear(y);d.setUTCMonth(m);return d.getTime();}
this.next=function(ival,after)
{after++;var d=new Date(after);m=d.getUTCMonth();y=d.getUTCFullYear();d.setUTCSeconds(0);d.setUTCMinutes(0);d.setUTCHours(0);d.setUTCDate(1);if(this.which){if(m>=this.which-1)y++;m=this.which-2;}
m++;if(m>11){y++;m=0;}
d.setUTCFullYear(y);d.setUTCMonth(m);return d.getTime();}}
function Interval(anchor,length)
{if(length<0)length=0;if(length>0)
this.start=anchor-(Math.floor(anchor/length)*length)-length;else
this.start=0;this.period=length;this.prev=function(ival,before)
{return regular_prev(this,before);}
this.next=function(ival,after)
{return regular_next(this,after);}}
function TimeEvent(ts,start)
{this.ts=ts;this.start=start;}
function date_print(ts)
{if(ts){var d=new Date(ts);printf(d.toUTCString());}else
printf("not a valid date : ",ts);}
function TimePattern(tw,iv)
{this.tw=tw;this.iv=iv;this.lbl="Pattern";this.next_start=function(tp,after,limit)
{return leaf_next_start(this,after,limit);}
this.next_end=function(tp,after,limit)
{return leaf_next_end(this,after,limit);}
this.prev_start=function(tp,before,limit)
{return leaf_prev_start(this,before,limit);}
this.prev_end=function(tp,before,limit)
{return leaf_prev_end(this,before,limit);}
this.valid=function(tp,at)
{return leaf_valid(this,at);}
this.traverse_fwd=function(start,stop,what,xtra)
{traverse_fwd(s,e,this,what,xtra);}
this.traverse_bwd=function(start,stop,what,xtra)
{}
this.traverse_windows=function(start,stop,what,xtra)
{traverse_windows(start,stop,this,what,xtra);}}
function NotPattern(op1)
{var ptr=new TimePattern(null,null);ptr.op1=op1;ptr.lbl="NotPattern";ptr.next_start=function(tp,after,limit)
{return not_next_start(this,after,limit);}
ptr.next_end=function(tp,after,limit)
{return not_next_end(this,after,limit);}
ptr.prev_start=function(tp,before,limit)
{return not_prev_start(this,before,limit);}
ptr.prev_end=function(tp,before,limit)
{return not_prev_end(this,before,limit);}
ptr.valid=function(tp,at){return not_valid(this,at);}
return ptr;}
function OrPattern(op1,op2)
{this.op1=op1;this.op2=op2;this.lbl="OrPattern";this.next_start=function(tp,after,limit)
{return or_next_start(tp,after,limit);}
this.next_end=function(tp,after,limit)
{return or_next_end(tp,after,limit);}
this.prev_start=function(tp,before,limit)
{return or_prev_start(tp,before,limit);}
this.prev_end=function(tp,before,limit)
{return or_prev_end(tp,before,limit);}
this.valid=function(tp,at){return or_valid(tp,at);}}
function AndPattern(op1,op2)
{this.op1=op1;this.op2=op2;this.lbl="AndPattern";this.next_start=function(tp,after,limit)
{return and_next_start(tp,after,limit);}
this.next_end=function(tp,after,limit)
{return and_next_end(tp,after,limit);}
this.prev_start=function(tp,before,limit)
{return and_prev_start(tp,before,limit);}
this.prev_end=function(tp,before,limit)
{return and_prev_end(tp,before,limit);}
this.valid=function(tp,at){return and_valid(tp,at);}}
function TAndPattern(op1,op2)
{var ptr=new TimePattern(null,null);ptr.op1=op1;ptr.op2=op1;ptr.lbl="AndPattern";ptr.next_start=and_next_start;ptr.next_end=and_next_end;ptr.prev_start=and_prev_start;ptr.prev_end=and_prev_end;ptr.valid=and_valid;return ptr;}
function CreateInterval(iv)
{var unit=iv.unit;switch(unit){case"DAY":return new Interval(parseInt(iv.anchor)*MSEC_IN_DAY-3600000,parseInt(iv.period)*MSEC_IN_DAY);break;case"MONTH":return new MonthInterval();break;case"YEAR":return new YearInterval();break;default:return new Interval(parseInt(iv.anchor),parseInt(iv.period));break;}}
function CreatePattern(jp)
{var operation=jp.operation;var op1,op2,tw,iv;var pat;switch(operation){case"LEAF":tw=new TimeWindow(parseInt(jp.tw.start),parseInt(jp.tw.end));iv=CreateInterval(jp.iv);pat=new TimePattern(tw,iv);break;case"AND":op1=CreatePattern(jp.op1);op2=CreatePattern(jp.op2);pat=new AndPattern(op1,op2);break;case"OR":op1=CreatePattern(jp.op1);op2=CreatePattern(jp.op2);pat=new OrPattern(op1,op2);break;case"NOT":op1=CreatePattern(jp.op1);pat=new NotPattern(op1);break;default:return null;break;}
return pat;}
function fill_trav(start,stop)
{date_print(start);date_print(stop);}
function fill(start,stop,tp)
{var valid=tp.valid(tp,start);if(!valid){start=tp.next_start(tp,start,stop);}
date_print(start);var end=tp.next_end(tp,start,stop);date_print(end);while(start<stop){start=tp.next_start(tp,end,stop);date_print(start);end=tp.next_end(tp,start,stop);date_print(end);}}
function exampl1()
{var start=Date.parse("Jan 1,2007 00:00");var stop=Date.parse("Jan 1,2008 00:00");var month=new MonthInterval();var tenth=new TimeWindow(9*24*60*60*1000,10*24*60*60*1000);var weekend=new TimeWindow(2*24*60*60*1000,4*24*60*60*1000);var weekly=new Interval(0*24*60*60*1000,7*24*60*60*1000);var tp1=new TimePattern(tenth,month);var tp2=new TimePattern(weekend,weekly);var tpo=new OrPattern(tp1,tp2);var tpa=new AndPattern(tp1,tp2);fill(start,stop,tpo);}
function adap()
{var base='{"tw":null,"iv":null,"operation":"OR","op1":{"tw":null,"iv":null,"operation":"AND","op1":{"tw":{"start":"28800000" ,"end":"64800000"},"iv":{"anchor":"0","period":"1","unit":"DAY"},"operation":"LEAF"},"op2":{"tw":{"start" :"0","end":"172800000"},"iv":{"anchor":"4","period":"7","unit":"DAY"},"operation":"LEAF"}},"op2":{"tw" :null,"iv":null,"operation":"AND","op1":{"tw":{"start":"28800000","end":"43200000"},"iv":{"anchor":"4" ,"period":"7","unit":"DAY"},"operation":"LEAF"},"op2":{"tw":{"start":"172800000","end":"604800000"},"iv" :{"anchor":"4","period":"7","unit":"DAY"},"operation":"LEAF"}}}';var start=Date.parse("Jan 19,2009 00:00");var stop=Date.parse("Jan 25,2009 00:00");var JSON=new Json();var pat=JSON.parse(base);var tpo=CreatePattern(pat);fill(start,stop,tpo);}
var counter;function count_trav(a,b)
{counter+=(b-a);print(a,b,counter);}
function count(start,stop,tp)
{counter=0;traverse_windows(start,stop,tp,count_trav,null);return counter;}
function fill(start,stop,tp)
{counter=0;traverse_windows(start,stop,tp,fill_trav,null);return counter;}
function test()
{var start=0;var stop=100;var i1,i2,i3,i4;var t1,t2,t3,t4;var p1,p2,p3,p4;var or,and;i1=new Interval(0,0);t1=new TimeWindow(1,2);p1=new TimePattern(t1,i1);p2=new NotPattern(p1);print("p1\n");count(start,stop,p1);print("p2\n");count(start,stop,p2);}
function exhaust_not(depth)
{var START=0;var END=100;var c=0;var c2=0;var is,id;var ts,td;var i1,i2;var t1,t2;var p1,p2;var nd=depth*-1;for(is=0;is<depth;is++){for(id=0;id<depth;id++){i1=new Interval(START+is,id);for(ts=nd;ts<depth;ts++){for(td=nd;td<depth;td++){t1=new TimeWindow(ts,td);p1=new TimePattern(t1,i1);p2=new NotPattern(p1);c=count(START,END,p1);c2=count(START,END,p2);if(c+c2!=(END-START))
print("nie :",START+is,id,ts,td,c,c2,(END-START));}}}}}
function exhaust(depth)
{exhaust_not(depth);}
function disable()
{return false;}
function enable()
{return true;}
function set_opacity(elm,perc)
{return global.browser.set_opacity(elm,perc);}
function get_cookie(c_name)
{if(document.cookie.length>0)
{c_start=document.cookie.indexOf(c_name+"=")
if(c_start!=-1)
{c_start=c_start+c_name.length+1
c_end=document.cookie.indexOf(";",c_start)
if(c_end==-1)c_end=document.cookie.length
return unescape(document.cookie.substring(c_start,c_end))}}
return null}
function set_flat_cookie(value)
{document.cookie=value;}
function set_cookie(c_name,value,expiredays)
{var exdate=new Date()
exdate.setDate(exdate.getDate()+expiredays)
document.cookie=c_name+"="+escape(value)+
((expiredays==null)?"":";expires="+exdate)}
function del_cookie(c_name)
{set_cookie(c_name,"",-1);}
function sniff_platform(platform)
{pf=platform.toLowerCase();test=pf.indexOf('iphone');if(test>=0)return'iphone';test=pf.indexOf('mac');if(test>=0)return'mac';test=pf.indexOf('linux');if(test>=0)return'linux';test=pf.indexOf('win32');if(test>=0)return'win32';return'win32';}
function sniff_agent(ua)
{agent=ua.toLowerCase();test=agent.indexOf('netscape');if(test>=0)return'netscape';test=agent.indexOf('firefox');if(test>=0)return'firefox';test=agent.indexOf('opera');if(test>=0)return'opera';test=agent.indexOf('msie');if(test>=0)return'msie';test=agent.indexOf('safari');if(test>=0)return'safari';if(test>=0)return'safari';return'msie';}
function Browser()
{this.app_name=navigator.appName;this.is_major=parseInt(navigator.appVersion);this.user_agent=sniff_agent(navigator.userAgent);this.platform=sniff_platform(navigator.platform);this.is_minor=parseFloat(navigator.appVersion);this.is_ie=false;this.is_safari=false;this.is_ie7=(document.all&&!window.opera&&window.XMLHttpRequest)?true:false;var self=this;self.captured=false;this.text_treshold=20;this.text_letterheight=2.5;this.x=0;this.y=0;this.ie_flame=function(which)
{if(!this.is_ie)return false;switch(which){case"appendChild in other frame":alert("Internet Explorer cannot handle dom element being copied to other frames\nI discovered this too late to revert everything here\nAnyway this is a developer tutorial and if you are a developer using IE you deserve this\n\nDon't Use IE... firefox is free AND BETTER");break;default:alert("Don't Use IE... firefox is free AND BETTER");break;}
return true;}
this.cancel_bubble=function(e)
{if(this.is_ie){window.event.cancelBubble=true;}else{e.stopPropagation();}}
if(this.app_name=="Microsoft Internet Explorer"){this.is_ie=true;}
if(this.user_agent=="safari"){this.is_safari=true;}
this.set_opacity=function(elm,percentage)
{if(this.is_ie){str="alpha(opacity:"+percentage*100+")";elm.style.filter=str;}else{elm.style.opacity=percentage;}}
this.disable_selection=function()
{if(this.is_ie){document.onselectstart=new Function("return false")}else{document.onmousedown=disable;document.onclick=enable;}}
this.iframe_set=function(ifr,what)
{if(this.is_ie)
ifr.location.href=what;else
ifr.src=what;}
this.drag=function(o,msg){o.onmousedown=function(a){var d=document;if(!a)a=window.event;if(o.setCapture)
o.setCapture();else if(window.captureEvents)
window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);d.onmousemove=function(a){if(!a)a=window.event;if(!a.pageX)a.pageX=a.clientX;if(!a.pageY)a.pageY=a.clientY;};d.onmouseup=function(){if(o.releaseCapture)
o.releaseCapture();else if(window.captureEvents)
window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);d.onmousemove=null;d.onmouseup=null;alert(msg)};};}
this.icon_name=function(name)
{if(!this.is_ie){if(name=='hand')return'pointer';}
return name;}
this.mouse_capture=function(o)
{if(self.captured==false){self.store_mousedown=document.onmousedown;self.store_mouseup=document.onmouseup;self.store_mousemove=document.onmousemove;self.captured=true;}
document.onmousedown=function(e){if(o.onmousedown)o.onmousedown(e);}
document.onmousemove=function(e){if(o.onmousemove)o.onmousemove(e);}
document.onmouseup=function(e){if(o.onmouseup)o.onmouseup(e);}}
this.mouse_release=function(o)
{if(self.captured==false)return;document.onmousedown=self.store_mousedown;document.onmouseup=self.store_mouseup;document.onmousemove=self.store_mousemove;}
this.event_set_wh=function(e)
{if(this.is_ie)
{this.w=document.body.clientWidth;this.h=document.body.clientHeight;}
else if(e)
{this.w=e.innerWidth;this.h=e.innerHeight;}}
this.event_set_xy=function(e)
{if(this.is_ie)
{this.x=window.event.clientX;this.y=window.event.clientY;this.ox=window.event.offsetX;this.oy=window.event.offsetY;this.target=window.event.srcElement;if(window.event.button){if(window.event.button==1)
this.button="left";else
if(window.event.button==2)
this.button="right";else
this.button="middle";}}
else if(e)
{this.x=e.clientX;this.y=e.clientY;if(e.offsetY){this.ox=e.offsetX;this.oy=e.offsetY;}else{this.ox=e.layerX;this.oy=e.layerY;}
this.target=e.target;if(e.button){if(e.button==2)
this.button="right";else
this.button="middle";}else
this.button="left";}
if(this.is_safari&&this.platform=='mac'){this.x-=document.body.scrollLeft;}}
this.event_get=function(e)
{if(this.is_ie)
return window.event
else
return e}
this.event_get_key=function(e)
{var keynum
if(this.is_ie)
{keynum=window.event.keyCode}
else if(e.which)
{keynum=e.which}
return keynum;}
this.get_scrolled_left=function(p)
{var left=global.browser.getAbsoluteLeft(p);left-=document.body.scrollLeft;return left;}
this.getAbsoluteLeft=function(o){oLeft=o.offsetLeft
while(o.offsetParent!=null){oParent=o.offsetParent
oLeft+=oParent.offsetLeft
o=oParent}
if(this.is_ie)oLeft++;return oLeft;}
this.getAbsoluteTop=function(o){oTop=o.offsetTop
while(o.offsetParent!=null){oParent=o.offsetParent
oTop+=oParent.offsetTop
o=oParent}
return oTop}
this.set_cookie=function set_cookie(c_name,value,expiredays)
{set_cookie(c_name,value,expiredays);}
this.get_cookie=function get_cookie(c_name)
{return get_cookie(c_name);}
this.del_cookie=function del_cookie(c_name)
{del_cookie(c_name);}}
global.browser=new Browser();
function DropZone(type)
{this.type=type;this.drop=function(o)
{alert("implement drop(Object) for "+this.name);}
this.attach=function(o,x,y)
{alert("implement attach(Object,x-coord,y-coord) for + "+this.name);}}
function DragZone(type)
{this.type=type;this.drag=function(o)
{alert("implement drag(Object) for "+this.name);}
this.detach=function(o)
{alert("implement detach(Object) for "+this.name);}}
function Draggable(type)
{this.type=type;this.drag=function(p)
{alert("implement drag(Parent) for "+this.name);}
this.drop=function(p)
{alert("implement drop(Parent) for "+this.name);}
this.attached=function(o)
{alert("implement attached(Object) for "+this.name);}
this.detached=function(o)
{alert("implement detached(Object) for "+this.name);}}
function DragDropContext()
{this.members=new Array;this.mlen=0;this.o=null;this.p=null;this.sel_obj=null;this.add_elm=function(elm)
{var l=this.members.length;this.members[l]=elm;}
this.del_elm=function(pos)
{if(this.members[pos])
delete(this.members[pos]);}
this.elm_traverse=function(handler)
{for(var m in this.members){mem=this.members[m];handler(mem);}}
this.deselect=function()
{if(this.sel_obj){this.sel_obj.deselect();}
this.sel_obj=null;}
this.select=function(app)
{if(this.sel_obj)this.sel_obj.deselect();if(app){app.select();}
this.sel_obj=app;}
this.leave=function(o)
{from=o.parent;if(!from)return;from.detach(o);o.detached(from);}
this.drag=function(p,o)
{p.drag(o);o.drag(p);this.o=o;this.p=p;}
this.enter=function(to)
{if(!to||!this.o)return;to.attach(this.o);this.o.attached(to);}
this.drop=function(p,o)
{p.drop(o);if(o)o.drop(p);this.o=null;this.p=null;}}
global.ddc=new DragDropContext();
function Class(name)
{this.name=name;this.inheritz=function(o)
{for(m in o){if(!this[m])
this[m]=o[m];}
this.zuper=o;}
this.implementz=function(o)
{for(m in o){if(!this[m]){msg="class "+this.name+" implements "+o.name+" so it should implement:\n";msg+=o[m]();msg+="\nbe sure you put this function BEFORE your implements() call";alert(msg);}}}}
function Interface(name)
{this.name=name;}
function Da()
{this.data=new Array()
this.length=0
this.ins=function(obj,pos)
{var t
if(pos<0||pos>this.length)return-1
for(t=this.length;t>=pos;t--){this.data[t]=this.data[t-1]}
this.data[pos]=obj
return this.length++}
this.add=function(obj)
{this.ins(obj,this.length)}
this.get=function(pos)
{if(pos<0||pos>this.length)return null;return this.data[pos];}
this.del=function(pos)
{var t
if(pos<0||pos>=this.length)return-1
for(t=pos;t<this.length;t++){this.data[t]=this.data[t+1]}
return this.length--}
this.toString=function()
{var t
var str="";for(t=0;t<this.length;t++){if(t!=0)
str+=","
str+=this.data[t].toString()}
return str}}
function da_test(n)
{var x,y
var to=new da()
for(x=0;x<n;x++){to.ins(x,0)
str=to.toString()
alert(str)}
for(x=0;x<n;x++){to.del(2);str=to.toString()
alert(str)}}
function ui_xywh(elm,x,y,w,h)
{if(x!=null){elm.style.left=x;}
if(y!=null){elm.style.top=y;}
if(w!=null)elm.style.width=w;if(h!=null)elm.style.height=h;}
function ui_xywh_px(elm,x,y,w,h)
{if(x!=null){elm.style.left=x+"px";}
if(y!=null){elm.style.top=y+"px";}
if(w!=null)elm.style.width=w+"px";if(h!=null)elm.style.height=h+"px";}
function UIDiv(p,x,y,w,h,caption)
{var d=document.createElement("div");d.style.position="absolute";if(p)p.appendChild(d);ui_xywh_px(d,x,y,w,h);if(caption)d.innerHTML=caption;return d;}
function UIButton(p,x,y,w,h,caption,action,xtra)
{var d=document.createElement("input");d.type="submit";d.style.position="absolute";if(p)p.appendChild(d);ui_xywh_px(d,x,y,w,h);if(caption)d.value=caption;if(action)d.onclick=action;if(xtra)d.udata=xtra;return d;}
function dom_get_w(elm){return elm.clientWidth;}
function fok_us()
{this.focus();}
function dom_get_h(elm){return elm.offsetHeight;}
function dom_set_w(elm,x,sfx)
{l=dom_append_sfx(x,sfx);elm.style.width=l;}
function dom_set_h(elm,x,sfx)
{l=dom_append_sfx(x,sfx);elm.style.height=l;}
function dom_set_left(elm,x,sfx)
{l=dom_append_sfx(x,sfx);elm.style.left=l;}
function dom_set_color(elm,bg,fg)
{if(fg)elm.style.color=fg;elm.style.background=bg;}
function dom_set_opacity(elm,percentage)
{global.browser.set_opacity(elm,percentage)}
function dom_set_top(elm,x,sfx)
{l=dom_append_sfx(x,sfx);elm.style.top=l;}
function remove_children(parent)
{while(parent.childNodes.length>0){parent.removeChild(parent.firstChild);}}
function remove_tree(parent)
{while(parent.childNodes.length>0){remove_tree(parent.firstChild);c=parent.removeChild(parent.firstChild);delete(c);}}
function dom_xywh(elm,x,y,w,h)
{if(x!=null){elm.style.left=x;}
if(y!=null){elm.style.top=y;}
if(w!=null){elm.style.width=w;}
if(h!=null){elm.style.height=h;}}
function dom_xywh_sfx(elm,x,y,w,h,sfx)
{if(x!=null){var u=dom_append_sfx(x,sfx);elm.style.left=u;}
if(y!=null){var u=dom_append_sfx(y,sfx);elm.style.top=u;}
if(w!=null){var u=dom_append_sfx(w,sfx);elm.style.width=u;}
if(h!=null){var u=dom_append_sfx(h,sfx);elm.style.height=u;}}
function dom_xywh_px(elm,x,y,w,h)
{dom_xywh_sfx(elm,x,y,w,h,"px");}
function dom_xywh_perc(elm,x,y,w,h)
{dom_xywh_sfx(elm,x,y,w,h,"%");}
function dom_centertext(elm,str)
{if(!elm.center){elm.center=document.createElement("div");}
elm.center.className=elm.className;dom_disable_borders(elm.center);elm.center.id=this.id;elm.center.style.display="inline";elm.center.style.position="absolute";elm.appendChild(elm.center);elm.center.innerHTML=str;var wp=dom_get_w(elm);var hp=dom_get_h(elm);var w=dom_get_w(elm.center);var h=dom_get_h(elm.center);dom_set_left(elm.center,(wp-w)/2,'px');dom_set_top(elm.center,(hp-h)/2,'px');}
function replace_child(parent,newchild)
{remove_children(parent);parent.appendChild(newchild);}
function append_child(parent,newchild)
{parent.appendChild(newchild);}
function remove_child(parent,child)
{parent.removeChild(child);}
function collapsed_table()
{var tbl=document.createElement('table');tbl.style.borderCollapse="collapse";tbl.border=0;return tbl;}
function get_scrolled_x(x)
{return x+document.body.scrollLeft;}
function get_scrolled_y(y)
{return y+document.body.scrollTop;}
function get_relative_x(x,p)
{x-=global.browser.getAbsoluteLeft(p.domelm);x+=document.body.scrollLeft;return x;}
function get_relative_y(y,p)
{y-=global.browser.getAbsoluteTop(p.domelm);var topper;if(!document.body.scrollTop){topper=document.documentElement.scrollTop;}
else{topper=document.body.scrollTop;}
y+=topper;return y;}
function dom_disable_borders(elm)
{elm.style.border=0;}
function set_img_single(domelm,imgname){url="url("+imgname+")";domelm.style.backgroundRepeat="no-repeat";if(imgname!=null)domelm.style.backgroundImage=url;else domelm.style.backgroundImage="";domelm.display="block";}
function set_img(p,imgname)
{url="url("+imgname+")";if(imgname!=null)p.style.backgroundImage=url;}
function center_img(p,imgname)
{url="url("+imgname+")";if(imgname!=null)p.style.backgroundImage=url;p.style.left="50%";}
function delete_child(parent,oldchild)
{for(c=0;c<parent.childNodes.length;c++){if(parent.childNodes[c]==oldchild){parent.removeChild(oldchild);return;}}}
function dom_append_sfx(x,sfx)
{if(!sfx)sfx="px";if(sfx=="px")x=Math.round(x);return x+sfx;}
function dom_appendpx(x)
{if(typeof x=='string'){var l=x.length;if(x.slice(l-2)=='px')
return x;}
return x+'px';}
function dom_stripw(elm)
{var w=elm.style.width;if(typeof w!='string')return w;var l=w.length;if(w.slice(l-2)=='px')
return parseInt(w.slice(0,l-2))
if(w.slice(l-1)=='%'){base=parseFloat(w.slice(0,l-1))
w=base*elm.clientWidth;}
return w;}
function dom_striph(elm)
{var h=elm.style.height;if(typeof h!='string')return h;var l=h.length;if(h.slice(l-2)=='px')
return parseInt(h.slice(0,l-2))
if(h.slice(l-1)=='%'){base=parseFloat(h.slice(0,l-1))
h=base*elm.clientHeight;}
return h;}
function dom_strippx(s)
{if(!s)return null
if(typeof s!='string')return s;var l=s.length;if(s.slice(l-2)=='px'){return parseInt(s.slice(0,l-2))}
if(s.slice(l-1)=='%'){return parseFloat(s.slice(0,l-1))}
return s;}
function dom_set_text(elm,str)
{var bg=elm.style.backgroundColor;if(bg)
{var txtclr=letter_color(bg);if(txtclr)elm.style.color=txtclr;}
elm.innerHTML=str;}
function Dom()
{}
Dom.prototype=new Class();Dom.replace_child=replace_child;Dom.remove_children=remove_children;Dom.delete_child=delete_child;Dom.strip_px=dom_strippx;function DomElement(elm)
{this.domelm=elm;this.domelm.DE=this;function delete_child(oldchild)
{if(!oldchild)return;this.removeChild(oldchild);}
this.set_text=function(str)
{var bg=this.domelm.style.backgroundColor;if(bg)
{var txtclr=letter_color(bg);if(txtclr)this.domelm.style.color=txtclr;}
this.domelm.innerHTML=str;}
this.set_font=function(size)
{this.domelm.style.fontSize=size;}
this.set_bg=function(clr,opq)
{if(clr)this.domelm.style.background=clr;if(opq)this.set_opacity(opq);}
this.set_img=function(imgname)
{url="url("+imgname+")";if(imgname!=null)this.domelm.style.backgroundImage=url;}
this.set_img_single=function(imgname){url="url("+imgname+")";if(imgname!=null)this.domelm.style.backgroundImage=url;this.domelm.style.backgroundRepeat="no-repeat";}
this.set_opacity=function(percentage)
{global.browser.set_opacity(this.domelm,percentage)}
this.set_cursor=function(img_name)
{if(img_name!=null)this.domelm.style.cursor=img_name;}
this.replace_child=function(what)
{return Dom.replace_child(this.domelm,what);}
this.set_position=function(postype)
{this.domelm.style.position=postype;}
this.set_overflow=function(type)
{this.domelm.style.overflow=type;}
this.set_z=function(level)
{this.domelm.style.zIndex=level;}
this.get_left=function()
{var l=0;if(this.domelm.style.left){l=Dom.strip_px(this.domelm.style.left);}
return l;}
this.get_top=function()
{var l=0;if(this.domelm.style.top){l=Dom.strip_px(this.domelm.style.top);}
return l;}
this.set_left=function(x,sfx)
{l=dom_append_sfx(x,sfx);this.domelm.style.left=l;}
this.set_top=function(x,sfx)
{l=dom_append_sfx(x,sfx);this.domelm.style.top=l;}
this.get_w=function()
{return Dom.strip_px(this.domelm.style.width);}
this.get_h=function()
{return Dom.strip_px(this.domelm.style.height);}
this.set_w=function(w,sfx)
{if(w<0)w=0;var l=dom_append_sfx(w,sfx);this.domelm.style.width=dom_append_sfx(w,sfx);}
this.set_h=function(h,sfx)
{if(h<0)h=0;this.domelm.style.height=dom_append_sfx(h,sfx);}
this.get_right=function()
{var l=this.get_left();return l+Dom.strip_px(this.domelm.style.width);}
this.get_bottom=function()
{var l=this.get_top();return l+Dom.strip_px(this.domelm.style.height);}
this.xywh=function(x,y,w,h)
{dom_xywh(this.domelm,x,y,w,h);}
this.xywh_px=function(x,y,w,h)
{dom_xywh_px(this.domelm,x,y,w,h);}
this.xyxy=function(x,y,x2,y2)
{if(x2==null)x2=dom_strippx(this.domelm.style.left)+dom_strippx(this.domelm.style.width)
if(y2==null)y2=dom_strippx(this.domelm.style.top)+dom_strippx(this.domelm.style.height)
if(x)this.domelm.style.left=dom_appendpx(x);if(y)this.domelm.style.top=y;this.domelm.style.width=x2-dom_strippx(this.domelm.style.left)
this.domelm.style.height=y2-dom_strippx(this.domelm.style.top)}}
DomElement.prototype=new Class();var id=0;function DomDiv(parent,x,y,w,h,clr,opt_before)
{var div=document.createElement("div");this.inheritz(new DomElement(div));this.domelm.name=id++;if(clr)div.style.background=clr;if(opt_before)
parent.insertBefore(div,opt_before);else
parent.appendChild(div);this.noselection=function()
{this.domelm.onselectstart=function(){return false;}
this.domelm.onmousedown=function(){return false;}}
this.selection=function()
{this.domelm.onselectstart=null;this.domelm.onmousedown=null;}
this.noselection();this.set_border=function(x,clr,stl)
{if(!stl)stl="solid";str=x+"px "+stl+" "+clr;this.domelm.style.border=str;}
this.set_border_top=function(x,clr,stl)
{if(!stl)stl="solid";str=x+"px "+stl+" "+clr;this.domelm.style.borderTop=str;}
this.set_border_bottom=function(x,clr,stl)
{if(!stl)stl="solid";str=x+"px "+stl+" "+clr;this.domelm.style.borderBottom=str;}
this.set_border_left=function(x,clr,stl)
{if(!stl)stl="solid";str=x+"px "+stl+" "+clr;this.domelm.style.borderLeft=str;}
this.set_border_right=function(x,clr,stl)
{if(!stl)stl="solid";str=x+"px "+stl+" "+clr;this.domelm.style.borderRight=str;}
this.set_text=function(str)
{var bg=this.domelm.style.backgroundColor;if(bg)
{var txtclr=letter_color(bg);if(txtclr)this.domelm.style.color=txtclr;}
this.domelm.innerHTML=str;}
this.set_centerobject=function(obj)
{var bg=this.domelm.style.backgroundColor;if(!this.center){this.center=document.createElement("div");this.domelm.appendChild(this.center);}
dom_disable_borders(this.center);this.center.id=this.domelm.id;this.center.style.display="inline";this.center.style.position="absolute";if(bg)
{var txtclr=letter_color(bg);if(txtclr)this.domelm.style.color=txtclr;}
if(typeof(obj)=='string'){this.center.innerHTML=obj;}else{remove_children(this.center)
this.center.appendChild(obj);}
var wp=dom_get_w(this.domelm);var hp=dom_get_h(this.domelm);var w=dom_get_w(this.center);var h=dom_get_h(this.center);dom_set_left(this.center,(wp-w)/2,'px');dom_set_top(this.center,(hp-h)/2,'px');}
this.set_centertext=function(str){this.set_centerobject(str);}
this.set_centeredit=function(str,fnc)
{var inp=document.createElement("input");inp.value=str;inp.onchange=fnc;this.set_centerobject(inp);return inp;}
this.xywh_px(x,y,w,h);}
DomDiv.prototype=new Class();function DomTd(parent,width)
{this.inheritz(new DomElement(parent));this.xywh(0,0,11,null);}
DomTd.prototype=new Class();function DomTr(elm,height)
{this.cols=new Da();this.height=height;this.get_height=function()
{return this.height;}
this.add_col=function(pos,wid)
{if(pos>=this.cols.length)pos=this.cols.length;this.cell=this.domelm.insertCell(pos);var td=new DomTd(this.cell,wid);this.cols.ins(td,pos);return td;}
this.inheritz(new DomElement(elm));}
DomTr.prototype=new Class();function DomTable(parent)
{var tbl=this.tbl=document.createElement("table");this.tbl.border=0;this.rows=new Da();this.set_borders=function(sz,c)
{this.tbl.border=0;this.tbl.cellSpacing=sz;this.tbl.cellPadding=0;if(c)this.tbl.style.background=c;}
this.set_class=function(str)
{if(str)this.tbl.className=str;}
this.get_row=function(row)
{if(row>=this.rows.length)return null;var tr=this.rows.get(row);return tr;}
this.get_cell=function(row,col)
{if(row>=this.rows.length)return null;var tr=this.rows.get(row);return tr.cols.get(col);}
this.add_col=function(row,col)
{var tr=this.rows.get(row);var td=tr.add_col(col);return td;}
this.add_row=function(pos,height)
{if(pos>=this.rows.length)pos=this.rows.length;var row=this.tbl.insertRow(pos);tr=new DomTr(row,height);this.rows.ins(tr,pos);return tr;}
this.inheritz(new DomElement(tbl));parent.appendChild(this.tbl);}
DomTable.prototype=new Class();function DomButton(parent,val,fnc,id)
{var inp=document.createElement("input");inp.type="submit";inp.value=val;inp.id=id;inp.style.border=0;inp.onclick=fnc;this.inheritz(new DomElement(inp));parent.appendChild(inp);return this;}
DomButton.prototype=new Class();function DomEdit(parent,val,fnc,id)
{var inp=document.createElement("input");inp.value=val;inp.oldvalue=val;inp.id=id;inp.style.border=0;inp.onchange=fnc;this.inheritz(new DomElement(inp));parent.appendChild(inp);return this;}
DomEdit.prototype=new Class();function DomOption(parent,val)
{var inp=document.createElement("option");inp.innerHTML=val;inp.value=false;parent.appendChild(inp);this.set=function()
{inp.selected="selected";}
this.unset=function()
{inp.selected="unselect";inp.value=false;}
this.selected=function()
{return inp.selected;}
return this;}
DomOption.prototype=new Class();function DomSelect(parent,val,fnc,id,mul,sz)
{this.sel=document.createElement("select");if(mul){this.sel.multiple="multiple";this.size=5;}
this.opts=Array();var t=0;for(a in val){var opt=this.opts[t++]=new DomOption(this.sel,val[a]);}
this.clear=function()
{this.sel.selectedIndex=-1;}
this.sel.style.border=0;this.sel.onchange=fnc;this.clear();this.inheritz(new DomElement(sel));parent.appendChild(this.sel);this.set=function(i){this.opts[i].set();}
this.selected=function(i){return this.opts[i].selected();}
return this;}
function DomSelectMultiple(parent,val,fnc,id,sz)
{var d=DomSelect(parent,val,fnc,id,true,sz);return d;}
function printf()
{var s="";for(var i=0;i<arguments.length;i++){s=s+arguments[i]+" ";}
if(typeof(console)!="undefined")
console.log(s);else if(typeof(alert)!="undefined")
alert(s);else
print(s);}
function dp(x)
{if(global&&global.debug)
global.debug.print(x);}
function da(x)
{if(global&&global.debug)
global.debug.append(x);}
function pa(x)
{global.debug.print_attributes(x);}
function ps(x)
{global.debug.print_styles(x);}
function pt(x)
{global.debug.print_table(x);}
function Debug(out)
{this.out=out;this.set_elm=function(out){this.out=out;}
this.print=function(txt)
{if(this.out){this.out.innerHTML=txt;}else{alert(txt);}}
this.append=function(txt)
{if(this.out){this.out.innerHTML+=txt;}else{alert(txt);}}
this.print_styles=function(what,where)
{var tbl=this.styles(what);if(!where)where=this.out;replace_child(where,tbl);}
this.print_attributes=function(what,where)
{var tbl=this.attributes(what);if(!where)where=this.out;replace_child(where,tbl);}
this.attributes=function(obj)
{tbl=document.createElement("table");tbl.cellSpacing=1;tbl.border=0;tbl.bgColor="000000";if(!obj){tr=tbl.insertRow(tbl.rows.length);td=tr.insertCell(0);td.nowrap=true;td.innerHTML=obj;return tbl;}
for(var a in obj)
{tr=tbl.insertRow(tbl.rows.length);tr.bgColor="eeeeee";td=tr.insertCell(0);td.nowrap=true;td.innerHTML=a;td=tr.insertCell(1);if(obj[a]){td.innerHTML=obj[a];}else{td.innerHTML="-";}}
tr=tbl.insertRow(0);td=tr.insertCell(0);td.style.background="#888888";if(obj.nodeName)
td.innerHTML=obj.nodeName;else
td.innerHTML="member";td=tr.insertCell(1);td.style.background="#888888";if(obj.id)
td.innerHTML=obj.id;else
td.innerHTML="value";return tbl;}
this.print_table=function(what,where)
{var tbl=this.table(what);if(!where)where=this.out;replace_child(where,tbl);}
this.table=function(obj)
{tbl=document.createElement("table");tbl.cellSpacing=1;tbl.border=0;tbl.bgColor="000000";if(!obj){tr=tbl.insertRow(tbl.rows.length);td=tr.insertCell(0);td.nowrap=true;td.innerHTML=obj;return tbl;}
tr=tbl.insertRow(0);idx0=obj[0];c=0;for(var a in idx0)
{td=tr.insertCell(c);td.style.background="#888888";td.innerHTML=a;c++;}
for(i=0;i<obj.length;i++){tr=tbl.insertRow(tbl.rows.length);c=0;for(var a in obj[i])
{td=tr.insertCell(c);td.nowrap=true;if(obj[i][a]){if(a=='color'||a=='colour'||a=='Color'||a=='Colour'||a=='kleur'||a=='Kleur'){td.style.background=obj[i][a];td.style.color=letter_color(obj[i][a]);}
dom_set_text(td,obj[i][a]);}else{td.innerHTML="-";}
c++;}}
return tbl;}
function getStyles(x)
{if(x.currentStyle)
return x.currentStyle;else if(window.getComputedStyle)
return document.defaultView.getComputedStyle(x,null);return null;}
function getStyle(x,styleProp)
{if(x.currentStyle)
var y=x.currentStyle[styleProp];else if(window.getComputedStyle)
var y=document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);return y;}
this.styles=function(o)
{tbl=document.createElement("table");tbl.cellSpacing=1;tbl.border=0;tbl.bgColor="000000";obj=getStyles(o);if(!obj){tr=tbl.insertRow(tbl.rows.length);td=tr.insertCell(0);td.nowrap=true;td.innerHTML=obj;return tbl;}
for(var a in obj)
{tr=tbl.insertRow(tbl.rows.length);tr.bgColor="eeeeee";td=tr.insertCell(0);td.nowrap=true;td.innerHTML=a;td=tr.insertCell(1);if(obj[a]){td.innerHTML=obj[a];}else{td.innerHTML="-";}}
tr=tbl.insertRow(0);td=tr.insertCell(0);td.style.background="#888888";if(obj.nodeName)
td.innerHTML=obj.nodeName;else
td.innerHTML="member";td=tr.insertCell(1);td.style.background="#888888";if(obj.id)
td.innerHTML=obj.id;else
td.innerHTML="value";return tbl;}}
var depth=0;var flatlevel=3;function indent()
{var str="";for(d=0;d<depth;d++)str+='    ';return str;}
function Json(){var m={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},s={'boolean':function(x){return String(x);},number:function(x){return isFinite(x)?String(x):'null';},string:function(x){if(/["\\\x00-\x1f]/.test(x)){x=x.replace(/([\x00-\x1f\\"])/g,function(a,b){var c=m[b];if(c){return c;}
c=b.charCodeAt();return'\\u00'+
Math.floor(c/16).toString(16)+
(c%16).toString(16);});}
return'"'+x+'"';},object:function(x){if(x){var a=[],b,f,i,l,v;if(x instanceof Array){a[0]='[';l=x.length;for(i=0;i<l;i+=1){v=x[i];f=s[typeof v];if(f){v=f(v);if(typeof v=='string'){if(b){a[a.length]=',';}
a[a.length]=v;b=true;}}}
a[a.length]=']';}else if(x instanceof Object){a[0]='{';for(i in x){v=x[i];f=s[typeof v];if(f){v=f(v);if(typeof v=='string'){if(b){a[a.length]=',';}
a[a.length]=s.string(i);a[a.length]=':';a[a.length]=v;b=true;}}}
a[a.length]='}';}else{return;}
return a.join('');}
return'null';}},p={'boolean':function(x){return String(x);},number:function(x){return isFinite(x)?String(x):'null';},string:function(x){if(/["\\\x00-\x1f]/.test(x)){x=x.replace(/([\x00-\x1f\\"])/g,function(a,b){var c=m[b];if(c){return c;}
c=b.charCodeAt();return'\\u00'+
Math.floor(c/16).toString(16)+
(c%16).toString(16);});}
return'"'+x+'"';},object:function(x){if(x){var a=[],b,f,i,l,v;if(x instanceof Array){a[0]='[';l=x.length;for(i=0;i<l;i+=1){v=x[i];f=p[typeof v];if(f){v=f(v);if(typeof v=='string'){if(b){a[a.length]=',';}
a[a.length]=v;b=true;}}}
a[a.length]=']';}else if(x instanceof Object){a[a.length]='{';a[a.length]='\n';depth++;a[a.length]=indent();for(i in x){v=x[i];f=p[typeof v];if(f){v=f(v);if(typeof v=='string'){if(b){a[a.length]=',';if(depth<flatlevel){a[a.length]='\n';a[a.length]=indent();}}
a[a.length]=p.string(i);a[a.length]=':';a[a.length]=v;b=true;}}}
depth--;a[a.length]='}';}else{return;}
return a.join('');}
return'null';}};return{copyright:'(c)2005 JSON.org',license:'http://www.JSON.org/license.html',stringify:function(v){var f=s[typeof v];if(f){v=f(v);if(typeof v=='string'){return v;}}
return null;},beautify:function(v,l){if(l)flatlevel=l;var f=p[typeof v];if(f){v=f(v);if(typeof v=='string'){return v;}}
return null;},parse:function(text){try{return!(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(text.replace(/"(\\.|[^"\\])*"/g,'')))&&eval('('+text+')');}catch(e){return false;}}};};var JSON=new Json();
function Tab(l,c,d)
{this.label=l;this.content=c;this.udata=d;}
function Tabs(p,hlcolor)
{var thisobj=this;thisobj.tabs=Array();this.hlcolor="#ffffff";if(hlcolor)
this.hlcolor=hlcolor;this.init=function(p)
{thisobj.topelm=document.createElement("div");dom_xywh(thisobj.topelm,'0px','0px','100%','100%');thisobj.topelm.style.position="absolute";thisobj.topelm.style.display="inline";thisobj.tabulator=document.createElement("div");thisobj.tabulator.style.position="absolute";thisobj.tabulator.style.display="inline";thisobj.topelm.appendChild(thisobj.tabulator);dom_xywh(thisobj.topelm,'0px','10px','100%','15px');dom_xywh(thisobj.tabulator,'0px','0px','100%','15px');thisobj.dataarea=document.createElement("div");thisobj.dataarea.style.position="absolute";thisobj.topelm.appendChild(thisobj.dataarea);dom_xywh(thisobj.dataarea,'0px','25px','100%','150px');for(var t=0;t<thisobj.tabs.length;t++){var tab=thisobj.tabs[t];thisobj.draw_label(tab);}
p.appendChild(thisobj.topelm);}
this.xy=function(x,y){dom_xywh(thisobj.topelm,x+'px',y+'px');}
function refill(e)
{var tab=this.tab;remove_children(thisobj.dataarea);var domtree=tab.content(thisobj.dataarea,tab.udata);if(!domtree)return;thisobj.dataarea.appendChild(domtree);}
function hl(){this.className="UiTabHighlighted";}
function ll(){this.className="UiTab";}
this.draw_label=function(tab){var l=document.createElement("span");l.className="UiTab";l.innerHTML=tab.label;l.onclick=refill;l.onmouseover=hl;l.onmouseout=ll;l.style.cursor=global.browser.icon_name("hand");l.tab=tab;dom_xywh(l,0,0,null,'15px');thisobj.tabulator.appendChild(l);}
this.add=function(label,content,data)
{var t=thisobj.tabs.length;thisobj.tabs[t]=new Tab(label,content,data);if(thisobj.tabulator)
thisobj.draw_label(thisobj.tabs[t]);}
if(p)this.init(p);}
function Popup()
{var self=this;self.div=document.createElement("div");self.show=function(p,x,y)
{p.appendChild(self.div);self.div.style.position='absolute';self.div.style.left=x+'px';self.div.style.top=y+'px';self.div.style.width='100px';self.div.style.height='100px';self.div.style.background="yellow";}
self.hide=function(p)
{p.removeChild(self.div);}
self.set_content=function(content)
{content.style.position='absolute';replace_child(self.div,content);}}
function PopupMenu(items)
{var self=this;var i;self.div=document.createElement("div");self.div.style.position='absolute';self.div.style.zIndex=30;if(!items)items=new Array();self.items=items;function nope(o)
{alert("nakkes");}
self.del_menuitem=function(pos)
{if(!self.items)return;var l=self.items.length;if(l<pos)return;mi=self.items[pos];self.div.removeChild(mi.div);this.apps.splice(pos,1);}
self.add_menuitem=function(mi)
{var l=0;if(self.items)
l=self.items.length;self.items[l]=mi;self.div.appendChild(mi.div);mi.div.menu=this;}
if(self.items)
for(i=0;i<self.items.length;i++){mi=self.items[i];self.div.appendChild(mi.div);mi.div.menu=this;}
self.set_data=function(d)
{self.data=d;}
self.hide_popup=function()
{document.body.removeChild(self.div);document.onmouseup=null;return false;}
function clear_popup(e)
{self.hide_popup();}
self.show_popup=function(x,y)
{document.body.appendChild(self.div);self.div.style.left=x;self.div.style.top=y;document.onmouseup=clear_popup;}
self.trigger_popup=function(e)
{if(!e)e=window.event;global.browser.event_set_xy(e);self.target=e.target;self.show_popup(get_scrolled_x(global.browser.x),get_scrolled_y(global.browser.y));return false;}
self.popup=new Popup();self.popup.set_content(self.div);document.oncontextmenu=disable;return false;}
function action_and_popdown(e)
{if(this.action)this.action(this.menu.target,this.data);if(this.menu)this.menu.hide_popup();global.browser.cancel_bubble(e);return false;}
function set_in(e)
{this.style.borderStyle="inset";}
function set_out(e)
{this.style.borderStyle="outset";}
function MenuItem(txt,action,classname)
{var self=this;self.div=document.createElement("div");self.div.style.border='1px';self.div.style.borderWidth=1;self.div.style.borderStyle="outset";self.div.style.cursor=global.browser.icon_name(global.mouseicon[0]);self.div.innerHTML=txt;self.div.className="menuitem"
if(classname)self.div.className+=" "+classname;self.div.action=action;self.div.onmouseover=set_in;self.div.onmouseout=set_out;self.div.onmouseup=action_and_popdown;self.set_bg=function(bg)
{self.bg=bg;self.div.style.background=bg;}
self.set_data=function(d)
{self.div.data=d;}}
function ObjectStore()
{this.objs=new Object();this.counter=0;this.add_object=function(o)
{this.objs[this.counter++]=o;return this.counter-1;}
this.del_object=function(n)
{delete(this.objs[n]);}
this.get_object=function(n)
{return this.objs[n];}}
var store=new ObjectStore();function act(n)
{var obj=store.get_object(n);val=obj.curve[obj.n++];val=Math.round(val*1000)/1000;dp(obj.n+":"+val+":"+obj.effect.steps);obj.tfunc(obj.obj,val);if(obj.n>=obj.effect.steps){window.clearInterval(obj.id);if(obj.efunc)obj.efunc(obj.obj);}}
function AnimationEffect()
{}
function LinearEffect()
{this.traject=new Array();this.calc=function(ms)
{start=0.0;this.steps=ms/Animation.smooth_ms;for(s=0;s<=this.steps;s++)
{this.traject[s]=start;start+=1.0/this.steps;}
return this.traject;}}
function BounceEffect(start,stop,speed,dissipation)
{var self=this;distance=(stop-start);this.calc=function(ms)
{self.traject=ComputeBounce(distance,speed,dissipation);self.n=0;self.steps=self.traject.length;return self.traject;}}
function BezierEffect(start,stop)
{var self=this;var p0=new Point2D(0.0,0.0);var p1=new Point2D(0.0,10000.0);var p2=new Point2D(10.0,10000.0);var p3=new Point2D(10.0,0.0);var cp=new Array(p0,p1,p2,p3);self.start=start;self.stop=stop;this.calc=function(ms)
{distance=(self.stop-self.start);self.current=self.start;self.steps=ms/Animation.smooth_ms;self.steps=Math.ceil(self.steps);self.n=0;self.traject=ComputeBezier(cp,self.steps+1);return self.traject;}}
Animation.linear=1;Animation.bezier=2;Animation.bounce=3;function Animation(trans,obj,start,stop,dur,effect,wrapup)
{var self=this;self.start=start;self.stop=stop;self.dur=dur;self.obj=obj;self.tfunc=trans;self.efunc=wrapup;self.effect=effect;if(!self.effect)self.effect=new BezierEffect(start,stop);if(self.style==Animation.bezier){var p0=new Point2D(0.0,0.0);var p1=new Point2D(0.0,10000.0);var p2=new Point2D(10.0,10000.0);var p3=new Point2D(10.0,0.0);var cp=new Array(p0,p1,p2,p3);}
this.go=function()
{total=0;self.n=0;self.curve=self.effect.calc(self.dur);var distance=self.stop-self.start;for(t=0;t<=self.effect.steps;t++){total=self.curve[t]*distance;self.curve[t]=self.start+total;}
var n=store.add_object(self);self.id=window.setInterval("act("+n+")",Animation.smooth_ms);}}
Animation.smooth_ms=40;function Panner(container,oldtree,newtree,xoffset,yoffset)
{var w=oldparent.clientWidth;var h=oldparent.clientHeight;var viewport=document.createElement("div");dom_xywh(0,0,w,h);var slider=document.createElement("div");dom_xywh(0,0,w*2,h*2);}
function JsonMessage(cmd,data)
{var ob=new Object();ob.cmd=cmd;ob.payload=new Array();if(data){ob.payload[0]=data;}
this.stringified=function()
{return JSON.stringify(ob);}
this.clr_objects=function()
{ob.payload=new Array();}
this.add_object=function(o)
{nitems=ob.payload.length;ob.payload[nitems]=o;}
this.set_object=function(n,o)
{ob.payload[n]=o;}}
function JsonResult(msg)
{var ob=JSON.parse(msg);this.get_status=function()
{return ob.stat;}
this.get_object=function(n)
{return ob.payload[n];}}
function AjaxContext(sc,domelm)
{var thisobj=this;var xmlhttp=false;this.sc=sc;var triggerfunction;var udata="hoi";this.domelm=domelm;try{xmlhttp=new ActiveXObject("Msxml2.XMLHTTP");}catch(e){try{xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");}catch(E){xmlhttp=false;}}
if(!xmlhttp){xmlhttp=new XMLHttpRequest();}
this.set_udata=function(data){udata=data;}
this.state=function()
{return xmlhttp.readyState;}
function text()
{return xmlhttp.responseText;}
function raw_get()
{if(xmlhttp.readyState==4){if(udata)
triggerfunction(xmlhttp.responseText,udata);else
triggerfunction(xmlhttp.responseText);}}
this.abort=function()
{try{xmlhttp.abort(null);}catch(e){alert(e);}}
this.get_raw=function(cb,data,udata)
{var ret;url=this.sc;url+='?'+data;this.set_udata(udata);try{xmlhttp.open("GET",url,true);xmlhttp.setRequestHeader("If-Modified-Since","Sat, 1 Jan 2000 00:00:00 GMT");ret=xmlhttp.onreadystatechange=cb;xmlhttp.send(null);}catch(e){alert(e+" for url "+url);}}
this.get_async=function(ufunc,content,udata)
{triggerfunction=ufunc;this.get_raw(raw_get,content,udata);}
this.get_sync=function(content,verbose)
{url=this.sc;url+='?'+content;if(verbose)
alert(url);xmlhttp.open("GET",url,false);xmlhttp.setRequestHeader("If-Modified-Since","Sat, 1 Jan 2000 00:00:00 GMT");xmlhttp.send(null);if(verbose)
alert(xmlhttp.responseText);return xmlhttp.responseText;}
this.exists=function(url)
{xmlhttp.open("GET",url,false);xmlhttp.send(null);if(xmlhttp.status==200)return true;else return false;}}
function JsonContext(sc,domelm)
{var thisobj=this;var xmlhttp=false;this.sc=sc;var ac=new AjaxContext(sc,domelm);this.cb=function(res,udata)
{var msg=new JsonResult(res);thisobj.triggerfunction(msg,udata);}
this.get_async=function(ufunc,jm,udata)
{getstring="json="+jm.stringified();thisobj.triggerfunction=ufunc;ac.get_async(this.cb,getstring,udata);}
this.get_sync=function(jm,verbose)
{getstring="json="+jm.stringified();res=ac.get_sync(getstring,verbose);return new JsonResult(res);}}
function AjaxQueue(handler)
{var self=this;self.handler=handler;self.jc=new JsonContext("../sss.php");function loop(e,dta)
{var jr=new JsonResult(e);var stat=jr.get_status();var o=jr.get_object(0);if(stat=="error"){alert("socket broken, aborting!");self.jc.abort();return false;}
self.handler(e,dta);self.install_handler(o,dta);}
this.subscribe=function(topic,sid)
{var jm=new JsonMessage("subscribe",topic);if(!sid)sid=0;jm.add_object(sid);var msg=self.jc.get_sync(jm);return msg;}
this.unsubscribe=function()
{var jm=new JsonMessage("unsubscribe","");var msg=self.jc.get_sync(jm);return msg;}
this.install_handler=function(sid,udata)
{var jm=new JsonMessage("listen",null);jm.add_object(sid);self.jc.get_async(loop,jm,udata);}
this.start_listening=function(fnc,sid,udata)
{self.install_handler(sid,udata);}
this.put_message=function(sm)
{self.jc.abort();var msg=self.jc.get_sync();self.start_listening(self.handler,sm);return msg;}}
function SssMessage(l,sid,count,ts,data)
{this.length=l;this.session=sid;this.counter=count;this.timestamp=ts;this.data=data;}
function SssQueue(handler)
{var self=this;self.handler=handler;self.jc=new JsonContext("../sss.php");function loop(e,dta)
{var jr=new JsonResult(e);var stat=jr.get_status();var sm=jr.get_object(0);if(stat=="error"){alert("socket broken, aborting!");self.jc.abort();return false;}
self.handler(e,dta);self.install_handler(sm,dta);}
this.subscribe=function(topic,sid,count)
{if(!sid)sid=0;if(!count)count=0;var sm=new SssMessage(topic.length,sid,count,0,topic);var jm=new JsonMessage("subscribe",sm);var msg=self.jc.get_sync(jm);return msg;}
this.unsubscribe=function(sm)
{var jm=new JsonMessage("unsubscribe",sm);var msg=self.jc.get_sync(jm);return msg;}
this.install_handler=function(sm,udata)
{var jm=new JsonMessage("listen",sm);self.jc.get_async(loop,jm,udata);}
this.start_listening=function(fnc,sm,udata)
{self.install_handler(sm,udata);}
this.put_message=function(sm)
{self.jc.abort();var msg=self.jc.get_sync(sm);self.start_listening(sm,self.handler);return msg;}}
var darks=['Navy','blue','DarkGreen','MediumBlue','Black'];function letter_color(color)
{for(c in darks){if(color.toLowerCase()==darks[c].toLowerCase())return'white';}
return letter_rgb(color);}
function letter_rgb(color)
{if(color[0]!='#'){return'black';}
r=color.substring(1,3);g=color.substring(3,5);b=color.substring(5,7);rather_crued=parseInt(r,16)+parseInt(g,16)+parseInt(b,16);if(rather_crued<200)return'white';return'black';}
function Scale(wl,wr,ml,mr)
{this.recalc=function()
{this.ww=this.wr-this.wl;this.mw=this.mr-this.ml;this.scale=this.mw/this.ww;}
this.set_world_snap=function(offset,step)
{this.wo=offset;this.ws=step;}
this.snap_world=function(wx)
{absl=wx-this.wo;nsnaps=Math.round(absl/this.ws);var left=nsnaps*this.ws;left+=this.wo;return left;}
this.get_world=function(m)
{var wr=((m-this.ml)/this.scale)+this.wl;return wr;}
this.snap_model=function(mr)
{wrld=this.get_world(mr);var val=this.snap_world(wrld);return this.get_model(val);}
this.get_model=function(w)
{var mr=((w-this.wl)*this.scale)+this.ml;return mr;}
this.set_world=function(start,end)
{this.wl=start;this.wr=end;this.recalc();}
this.set_model=function(start,end)
{this.ml=start
this.mr=end;this.recalc();}
this.ml=dom_strippx(ml);this.mr=dom_strippx(mr);this.wl=dom_strippx(wl);this.wr=dom_strippx(wr);this.recalc()}
Scale.prototype=new Class();
var event_idle=0;var event_delete=1;var event_insert=2;var event_move=3;var event_resize=4;var event_apptype=5;var event_over=6;var event_out=7;var event_other=9;function DragState(dragzone)
{this.dragzone=dragzone;}
function DropState(dropzone)
{this.dropzone=dropzone;}
function Event(type,dragzone,draggable,e)
{this.start_event=function(dragzone)
{this.from=new DragState(dragzone);}
this.end_event=function(dropzone)
{this.to=new DropState(dropzone);}
this.rollback=function()
{this.to.dropzone.detach(this.draggable);this.draggable.detached(this.to.dropzone);if(!this.from||!this.from.dragzone||!this.from.tw){return;}
this.from.dragzone.attach(this.draggable);this.draggable.attached(this.from.dragzone);this.draggable.tw.start=this.from.tw.start;this.draggable.tw.end=this.from.tw.end;this.draggable.redraw(this.draggable);}
this.domevent=e;this.type=type;this.draggable=draggable;this.start_event(dragzone);}
function Lunch()
{this.Trash=function()
{alert("should implement Trash() on class :"+this.name);}}
Lunch.prototype=new Class();function JFOver(e)
{if(!this.obj.ddc.o)return;}
function JFUp(e)
{if(!this.obj.ddc.o)return;global.browser.event_set_xy(e);global.browser.mouse_release(this);this.obj.ddc.mousedown=false;this.obj.ddc.o.Trash();this.obj.ddc.o=null;global.browser.cancel_bubble(e);}
function DocUp(e)
{global.browser.event_set_xy(e);global.browser.mouse_release(this);this.obj.ddc.mousedown=false;this.obj.ddc.o.Trash();this.obj.ddc.o=null;global.browser.cancel_bubble(e);}
function Jiskefet(prnt,w,h,ddc)
{if(!ddc)ddc=global.ddc;this.ddc=ddc;this.drop=function(o)
{o.Trash();}
this.inheritz(new DomDiv(prnt,0,0,w,h,'white'));this.inheritz(new DropZone());this.domelm.obj=this;this.domelm.onmouseover=JFOver;this.domelm.onmouseup=JFUp;this.domelm.style.cursor=global.browser.icon_name('hand');}
Jiskefet.prototype=new Class();function DomJiskefet(domelm,ddc)
{if(!ddc)ddc=global.ddc;this.ddc=ddc;this.drop=function(o)
{o.Trash();}
this.inheritz(new DomElement(domelm));this.inheritz(new DropZone());this.domelm.obj=this;this.domelm.onmouseover=JFOver;this.domelm.onmouseup=JFUp;this.domelm.style.cursor=global.browser.icon_name('hand');}
DomJiskefet.prototype=new Class();
Appointment.LEFT=1;Appointment.RIGHT=2;Appointment.BODY=3;Appointment.TOP=4;Appointment.BOTTOM=5;Appointment.WHAT=6;function APKey(e)
{var k=global.browser.event_get_key(e);}
function AppType(id,name,color,cname,opacity,editable)
{this.id=id;this.name=name;this.color=color;this.cname=null;if(cname!=undefined)this.cname=cname;this.editable=true;if(editable!=undefined)this.editable=editable;this.fg="white";this.opacity=1.0;if(opacity!=undefined)this.opacity=opacity;this.railw=0;this.stopw=0;this.lmargin=0;this.rmargin=0;this.set_margins=function(lmargin,rmargin)
{this.lmargin=lmargin;this.rmargin=rmargin;}
this.set_borders=function(railw,stopw,clr)
{this.railw=railw;this.stopw=stopw;this.bcolor=clr;}
this.set_rails=function(railw,railc)
{this.railw=railw;this.bcolor=railc;}
this.set_stops=function(stopw,stopc)
{this.stopw=stopw;this.bcolor=stopc;}}
function APMove(e)
{}
function Appointment(pcanvas,start,end,apptype,id,flags)
{var thisobj=this;this.pcanvas=pcanvas;var n=0;n=this.pcanvas.apps.length;this.pcanvas.apps[n]=this;this.resizing="f";this.id=id;this.tw=new TimeWindow(start,end);this.selected=false;this.name="app";this.apptype=apptype;if(!apptype.editable)flags|=PlanCanvas.FLAG_NORESIZE|PlanCanvas.FLAG_NOMOVE;this.after=false;this.showtimes=true;this.edittimes=false;this.grip=10;this.border=1;this.selborder=2;this.may_move=true;this.may_cross=true;this.may_overlap=true;this.may_resize=true;this.is_moveable=function(){return this.may_move;}
if(flags&PlanCanvas.FLAG_NOMOVE)this.may_move=false;if(flags&PlanCanvas.FLAG_NOCROSS)this.may_cross=false;if(flags&PlanCanvas.FLAG_OVERLAP)this.may_overlap=true;if(flags&PlanCanvas.FLAG_NORESIZE)this.may_resize=false;if(pcanvas.may_select&&pcanvas.ddc.sel_id==id){thisobj.selected=true;}
else
thisobj.selected=false;this.set_text=function(ftxt,showtimes,after)
{this.freetext=ftxt;this.showtimes=showtimes;if(after)this.after=after;this.redraw_times();}
this.set_editable=function(on)
{this.edittimes=on;this.redraw(this);}
this.set_tw=function(tw)
{var ret=true;var evt=new Event(event_move,this.pcanvas,this,null);evt.from.tw=new TimeWindow(this.tw.start,this.tw.end);evt.end_event(this.pcanvas);evt.to.tw=this.tw=tw;if(!this.pcanvas.may_move)ret=false;if(evt.from.dragzone!=evt.to.dropzone){if(!this.pcanvas.may_cross)ret=false;}
if(this.pcanvas.test_overlap(this)&&!this.pcanvas.may_overlap)ret=false;if(ret==true)ret=this.pcanvas.handler(evt);if(ret==false)evt.rollback();this.pcanvas.cur_app=null;this.pcanvas.ddc.mov_obj=null;}
this.set_start=function(s)
{var tw=new TimeWindow(s,this.tw.end);this.set_tw(tw);}
this.set_end=function(e)
{var tw=new TimeWindow(this.tw.start,e);this.set_tw(tw);}
this.set_grip=function(x)
{if(this.pcanvas.is_vertical)
var l=this.get_top();else
var l=this.get_left();this.grip=x-l;}
this.set_apptype=function(type)
{this.apptype=type;if(type.cname){this.domelm.className="appointment";this.inner.domelm.className="appointment";if(type.cname){this.domelm.className+=" "+type.cname;this.inner.domelm.className+=" "+type.cname;}}
if(type.color){dom_set_color(this.inner.domelm,type.color,type.fg);}
if(type.opacity){dom_set_opacity(this.inner.domelm,type.opacity);}
var evt=new Event(event_apptype,this.pcanvas,this,null);evt.apptype=type;this.pcanvas.handler(evt);this.redraw(this);}
this.clear=function()
{var n=this.pcanvas.appointment_get_index(this);if(n<0)return;this.pcanvas.appointment_del(n);}
this.resize_left=function(p,x)
{this.resizing="b";var r=this.pcanvas.scale.get_model(this.tw.end);if(x<0)x=0;var s=this.pcanvas.scale.snap_model(x);var tmp=this.pcanvas.scale.get_world(s);this.tw.start=this.pcanvas.scale.snap_world(tmp);this.sl(s);this.sw(r-s);}
this.resize_up=function(p,y)
{this.resizing="b";var b=this.pcanvas.scale.get_model(this.tw.end);if(y<0)y=0;var s=this.pcanvas.scale.snap_model(y);var tmp=this.pcanvas.scale.get_world(s);this.tw.start=this.pcanvas.scale.snap_world(tmp);this.st(s);this.sh(b-s);}
this.del=function()
{}
this.resize_right=function(p,x)
{this.resizing="f";var pw=new Coord(p.clientWidth);if(x>pw.n)x=pw.n;var x=this.pcanvas.scale.snap_model(x);var l=this.get_left();this.tw.end=this.pcanvas.scale.get_world(x);this.tw.end=this.pcanvas.scale.snap_world(this.tw.end);this.sw(x-l);}
this.check=function()
{if(this.pcanvas.is_vertical){if(this.domelm.clientHeight<2){this.sh(20);}}else{if(this.domelm.clientWidth<2){}}}
this.resize_down=function(p,y)
{this.resizing="f";var pw=new Coord(p.clientHeight);if(y>pw.n)y=pw.n;var y=this.pcanvas.scale.snap_model(y);var t=this.get_top();this.tw.end=this.pcanvas.scale.get_world(y);this.tw.end=this.pcanvas.scale.snap_world(this.tw.end);this.sh(y-t);}
this.resize_v=function(p,y)
{var curtop=this.get_top();var curbottom=this.get_bottom();if(this.resizing=="f"){if(y>curtop){this.resize_down(p,y);}else{this.st(y);this.sh(curtop-y);var tmp=this.tw.start;this.tw.start=this.tw.end;this.tw.end=tmp;this.resize_up(p,y);}}else
if(this.resizing=="b"){if(y>curbottom){this.st(curbottom);this.sh(y-curbottom);var tmp=this.tw.start;this.tw.start=this.tw.end;this.tw.end=tmp;this.resize_down(p,y);}else{this.resize_up(p,y);}}
this.redraw_times();}
this.resize_h=function(p,x)
{var curleft=dom_strippx(this.get_left());var curright=dom_strippx(this.get_right());if(this.resizing=="f"){if(x>curleft){this.resize_right(p,x);}else{this.sl(x);this.sw(curleft-x);var tmp=this.tw.start;this.tw.start=this.tw.end;this.tw.end=tmp;this.resize_left(p,x);}}else
if(this.resizing=="b"){if(x>curright){this.sl(curright);this.sw(x-curright);var tmp=this.tw.start;this.tw.start=this.tw.end;this.tw.end=tmp;this.resize_right(p,x);}else{this.resize_left(p,x);}}
this.redraw_times();}
this.move_v=function(p,y)
{var outer=dom_strippx(this.domelm.style.height);if(thisobj.selected){outer+=thisobj.selborder;outer+=thisobj.selborder;}
var h=new Coord(outer);y-=this.grip;var s=this.pcanvas.scale.snap_model(y);this.tw.start=this.pcanvas.scale.get_world(s);this.tw.start=this.pcanvas.scale.snap_world(this.tw.start);this.tw.end=this.pcanvas.scale.get_world(s+h.n);this.tw.end=this.pcanvas.scale.snap_world(this.tw.end);this.st(s);this.sl(0);this.redraw_times();}
this.move_h=function(p,x)
{var outer=dom_strippx(this.domelm.style.width);if(thisobj.selected){outer+=thisobj.selborder;outer+=thisobj.selborder;}
var w=new Coord(outer);x-=this.grip;var s=this.pcanvas.scale.snap_model(x);this.tw.start=this.pcanvas.scale.get_world(s);this.tw.start=this.pcanvas.scale.snap_world(this.tw.start);this.tw.end=this.pcanvas.scale.get_world(s+w.n);this.tw.end=this.pcanvas.scale.snap_world(this.tw.end);this.st(0);this.sl(s);this.redraw_times();}
this.resize_app_h=function(p,s)
{this.tw.end=this.tw.start+s;var left=this.pcanvas.scale.get_model(this.tw.start);var right=this.pcanvas.scale.get_model(this.tw.end);var wid=right-left;this.sw(wid);this.redraw_times();}
this.resize_app_v=function(p,s)
{this.tw.end=this.tw.start+s;var left=this.pcanvas.scale.get_model(this.tw.start);var right=this.pcanvas.scale.get_model(this.tw.end);var wid=right-left;this.sh(wid);this.redraw_times();}
this.move_app_h=function(p,s)
{var w=new Coord(this.domelm.style.width);var dur=this.tw.end-this.tw.start;this.tw.start=s;this.tw.end=this.tw.start+dur;s=this.pcanvas.scale.get_model(this.tw.start);this.st(0);this.sl(s);this.redraw_times();}
this.move_app_v=function(p,s)
{this.tw.start=s;this.tw.end=this.pcanvas.scale.get_world(s+w);s=this.pcanvas.scale.get_model(this.tw.start);this.st(0);this.sl(s);this.redraw_times();}
this.move=function(pos)
{if(this.pcanvas.is_vertical)
this.move_app_v(this,pos);else
this.move_app_h(this,pos);}
this.resize=function(amount)
{if(this.pcanvas.is_vertical)
this.resize_app_v(this,amount);else
this.resize_app_h(this,amount);}
this.contains_h=function(pos)
{if(!this.get_left)return;var l=this.get_left();var r=this.get_right();if(pos>=l&&pos<=r){var x=get_relative_x(global.browser.x,this.pcanvas.backdiv);var edge=get_border_h(this,x);if(edge==Appointment.BODY&&(this.pcanvas.may_move==false||this.may_move==false))return;if((edge==Appointment.LEFT||edge==Appointment.RIGHT)&&this.pcanvas.may_resize==false)return;this.pcanvas.glassdiv.domelm.style.cursor=global.browser.icon_name(global.mouseicon[edge]);return true;}else{this.pcanvas.glassdiv.domelm.style.cursor=global.browser.icon_name(global.mouseicon[0]);return false;}}
this.contains_v=function(pos)
{var t=this.get_top();var b=this.get_bottom();if(pos>=t&&pos<=b){var y=get_relative_y(global.browser.y,this.pcanvas.backdiv);var edge=get_border_v(this,y);this.pcanvas.glassdiv.domelm.style.cursor=global.browser.icon_name(global.mouseicon[edge]);return true;}else{this.pcanvas.glassdiv.domelm.style.cursor=global.browser.icon_name(global.mouseicon[0]);return false;}}
this.fits=function(txt,w,h)
{var area=w*h;var len=txt.length;var letterspace=area/len;if(h<global.browser.text_letterheight)return false;if(letterspace>global.browser.text_treshold)return true;return false;}
this.altertimes=function()
{var times=this.value.split("-");if(!times[0]||!times[1])return;if(times[0]==""||times[1]=="")return;var start=times[0].split(":");var end=times[1].split(":");if(!start[0]||!start[1]||!end[0]||!end[1])return;if(start[0]==""||start[1]=="")return;if(end[0]==""||end[1]=="")return;var s=new Date(app.tw.start*1000);s.setHours(start[0]);s.setMinutes(start[1]);app.tw.start=s.getTime()/1000;var e=new Date(app.tw.end*1000);e.setHours(end[0]);e.setMinutes(end[1]);app.tw.end=e.getTime()/1000;this.app.set_editable(false);}
this.redraw_times=function()
{var w=new Coord(this.domelm.style.width);var h=new Coord(this.domelm.style.height);var s=this.tw.start;var w2=this.tw.end;var displaytxt="";if(this.pcanvas.use_dur){if(this.showtimes&&this.pcanvas.showtimes){displaytxt=dur_format(w2-s);}}else{if(this.showtimes&&this.pcanvas.showtimes){displaytxt=time_format(s);displaytxt+="-";displaytxt+=time_format(w2);}}
if(this.freetext){if(!this.after)
displaytxt=this.freetext+" "+displaytxt;else
displaytxt=displaytxt+" "+this.freetext;}
if(!this.pcanvas.layout.printtext)displaytxt="";if(this.edittimes){var elm=this.set_centeredit(displaytxt,this.altertimes);elm.app=this;elm.focus();}else{if(displaytxt==""){this.domelm.innerHTML="";this.domelm.style.fontSize=1;}else{this.domelm.style.fontSize=null;this.domelm.innerHTML=displaytxt;}}}
this.select=function()
{if(!thisobj.pcanvas.may_select)return;thisobj.selected=true;this.domelm.style.border=thisobj.selborder+"px solid black";this.domelm.style.width=thisobj.pcanvas.width-(2*thisobj.selborder)+"px";var old=dom_strippx(this.domelm.style.height);this.domelm.style.height=old-(1*thisobj.selborder)+'px';}
this.deselect=function()
{if(!thisobj.pcanvas.may_select)return;thisobj.selected=false;this.domelm.style.border=thisobj.border+"px solid black";this.domelm.style.width=thisobj.pcanvas.width-(2*thisobj.border)+"px";var old=dom_strippx(this.domelm.style.height);this.domelm.style.height=old+(2*(thisobj.selborder-thisobj.border))+'px';}
this.redraw=function(what)
{var xtra=0;var bcolor='black';var s=what.pcanvas.scale.get_model(what.tw.start);var e=what.pcanvas.scale.get_model(what.tw.end);s=Math.round(s);e=Math.round(e);if(what.apptype.color)
dom_set_color(what.domelm,what.apptype.color,what.apptype.fg);if(what.apptype.opacity)
dom_set_opacity(what.domelm,what.apptype.opacity);what.domelm.style.border=thisobj.border+"px solid #587F7E";var railw=what.apptype.railw;var stopw=what.apptype.stopw;if(what.pcanvas.is_vertical){what.st(s);what.sl(this.apptype.lmargin);what.sw(this.pcanvas.width-(thisobj.border*2));what.sh(e-s-(thisobj.border*2));if(this.selected==true){this.domelm.style.border=thisobj.selborder+"px solid black";this.domelm.style.width=thisobj.pcanvas.width-(2*thisobj.selborder)+"px";var old=dom_strippx(this.domelm.style.height);this.domelm.style.height=old-(1*thisobj.selborder)+'px';}}else{what.sl(s);what.st(this.apptype.lmargin);what.sh(this.pcanvas.height-(thisobj.border*2));what.sw(e-s-(thisobj.border*2));if(this.selected==true){this.domelm.style.border=thisobj.selborder+"px solid black";this.domelm.style.height=thisobj.pcanvas.height-(2*thisobj.selborder)+"px";var old=dom_strippx(this.domelm.style.width);this.domelm.style.width=old-(1*thisobj.selborder)+'px';}}
what.redraw_times();}
this.attached=function(to)
{this.domelm.app=this
this.resizing=null;this.pcanvas=to;this.redraw(this);}
this.detached=function(from)
{}
this.drag=function(p)
{}
this.drop=function(p)
{}
this.Trash=function()
{var evt=this.evt;evt.end_event(this.pcanvas);evt.type=event_delete;ret=this.pcanvas.handler(evt);if(ret<0)evt.rollback();this.pcanvas.cur_app=null;this.pcanvas.ddc.mov_obj=null;}
this.Drop=function()
{var evt=new Event(event_delete,this.pcanvas,this,null);evt.end_event(this.pcanvas);evt.type=event_delete;ret=this.pcanvas.handler(evt);if(ret<0)evt.rollback();this.pcanvas.cur_app=null;this.pcanvas.ddc.mov_obj=null;this.pcanvas.ddc.sel_obj=null;}
var color=this.apptype.color;var bcolor=this.apptype.bcolor;this.inheritz(new Lunch());this.inheritz(new DomDiv(this.pcanvas.backdiv.domelm,null,null,null,null,bcolor));this.set_position('absolute');this.set_overflow('hidden');this.inner=new DomDiv(this.domelm,null,null,null,null,color);this.inner.set_position('absolute');this.sw=function(w){this.set_w(w,this.pcanvas.suffix);}
this.sh=function(h){this.set_h(h,this.pcanvas.suffix);}
this.sl=function(l){this.set_left(l,this.pcanvas.suffix);}
this.st=function(t){this.set_top(t,this.pcanvas.suffix);}
this.inner.domelm.className="appointment";this.domelm.className="appointment";if(apptype.cname){this.inner.domelm.className+=" "+apptype.cname;this.domelm.className+=" "+apptype.cname;}
this.inheritz(new Draggable("Appointment"));this.parent=this.pcanvas;this.domelm.app=this
this.set_z(1);this.redraw(this);this.redraw_times();function yep()
{alert("you should NOT get events");}
this.domelm.onmouseover=null;}
Appointment.prototype=new Class();
var DEFAULT_LEGEND_SIZE=15;PlanCanvas.FLAG_VERTICAL=0x01;PlanCanvas.FLAG_NOMOVE=0x02;PlanCanvas.FLAG_NOCREATE=0x04;PlanCanvas.FLAG_NOCROSS=0x08;PlanCanvas.FLAG_OVERLAP=0x10;PlanCanvas.FLAG_NORESIZE=0x20;PlanCanvas.FLAG_NOAPPCM=0x40;PlanCanvas.FLAG_USEDUR=0x80;PlanCanvas.FLAG_NOSELECT=0x100;function Legend(p,types,w,h,bw,bh,cname)
{this.w=w;this.h=h;if(!bw)bw=DEFAULT_LEGEND_SIZE;if(!bh)bh=DEFAULT_LEGEND_SIZE;this.bw=bw;this.bh=bh;var curvs;var curtype;function sel_current(e)
{curtype=this.apptype;curvs.set_ustate(curtype);}
this.get_apptype=function()
{return curtype;}
function visible_state(td,apptype,handler)
{var tbl=new DomTable(td.domelm);var tr=tbl.add_row(0,0);var left=tr.add_col(0,0);var right=tr.add_col(1,0);right.domelm.style.whiteSpace="nowrap";var square=new DomDiv(left.domelm,0,bh,bw,bh,apptype.color);td.domelm.onmouseup=handler;td.domelm.apptype=apptype;right.domelm.innerHTML=apptype.name;square.domelm.className="appointment";if(apptype.cname);square.domelm.className+=" "+apptype.cname;this.set_ustate=function(apptype)
{square.domelm.apptype=apptype;if(apptype.color)square.set_bg(apptype.color);else{square.domelm.className="appointment";if(apptype.cname);square.domelm.className+=" "+apptype.cname;}
right.set_text('');}}
if(!types[0])return;this.tbl=new DomTable(p);this.tbl.domelm.className="legend";if(cname)
this.tbl.domelm.className="legend "+cname;this.tbl.xywh_px(0,0,this.w,this.h);var tr=this.tbl.add_row(0,40);var td=tr.add_col(0,0);curtype=types[0];var curvs=new visible_state(td,curtype,null);curvs.set_ustate(curtype);var c=0;for(s in types){c++;var td=tr.add_col(c);var vs=new visible_state(td,types[s],sel_current);}
var td=tr.add_col(c+1);}
function TimeLine(anchor,dur,freq,lfreq,cname,start,end)
{this.anchor=anchor;if(freq){var n=Math.floor(anchor/freq);this.anchor-=(n+1)*freq;var x=this.anchor+freq;}
this.dur=dur;this.freq=freq;this.lfreq=lfreq;if(!this.span)this.span=1.0;this.cname=cname;if(start)this.start=start;if(end)this.end=end;}
TimeLine.BOT=0;TimeLine.EOT=2147483648;function CanvasLayout(snap_at,cname,min)
{var thisobj=this;this.snap_at=snap_at;this.min=600000;if(min)this.min=min;this.cname=cname;this.tps=new Object();this.timelines=new Array();this.printtext=true;function tuple(pat,id)
{this.pat=pat;this.id=id;}
this.set_text=function(txt)
{this.caption=txt;}
this.set_notext=function()
{this.printtext=false;}
this.set_timefunc=function(f)
{this.tf=f;}
this.clear_timelines=function()
{this.timelines=new Array();}
this.add_timelines=function(anchor,dur,freq,lfreq,id,start,end)
{var tl=new TimeLine(anchor,dur,freq,lfreq,id,start,end);thisobj.timelines[thisobj.timelines.length]=tl;}
this.add_activetime=function(start,end,inverse)
{this.active=new TimeWindow(start,end);this.invert_active=inverse;}}
global.mouseicon=['default','w-resize','e-resize','hand','n-resize','s-resize'];global.border_sense=4;global.min_app=3;function get_border_h(o,x)
{var l=o.get_left();var r=o.get_right();var pos=x;if(o.pcanvas.may_resize==false)return Appointment.BODY;var border_sense=global.border_sense;if(r-l<border_sense*3)border_sense=Math.ceil((r-l)/3);if(pos-l<border_sense)return Appointment.LEFT;if(r-pos<border_sense)return Appointment.RIGHT;if(r-l<3)return Appointment.RIGHT;return Appointment.BODY;}
function get_border_v(o,y)
{var t=o.get_top();var b=o.get_bottom();var pos=y;if(o.pcanvas.may_resize==false)return Appointment.BODY;var border_sense=global.border_sense;if(b-t<border_sense*3)border_sense=Math.ceil((b-t)/3);if(pos-t<border_sense)return Appointment.TOP;if(b-pos<border_sense)return Appointment.BOTTOM;return Appointment.BODY;}
var ctr=0;function GPDown(e)
{global.browser.event_set_xy(e);global.mousedown=true;var coord;var app=null;if(!this.pcanvas)return;global.browser.mouse_capture(this.pcanvas.glassdiv.domelm);if(this.pcanvas.is_vertical){coord=get_relative_y(global.browser.y,this.pcanvas);app=this.pcanvas.appointment_under_v(coord);}else{coord=get_relative_x(global.browser.x,this.pcanvas);app=this.pcanvas.appointment_under_h(coord);}
if(global.browser.button=='right')
{if(app&&this.pcanvas.appmenu){this.pcanvas.appmenu.set_data(app);y=get_scrolled_y(global.browser.y);x=get_scrolled_x(global.browser.x);this.pcanvas.appmenu.show_popup(x,y);}else if(this.pcanvas.menu){this.pcanvas.menu.set_data(this.pcanvas);y=get_scrolled_y(global.browser.y);x=get_scrolled_x(global.browser.x);this.pcanvas.menu.show_popup(x,y);}
return false;}
if(!this.pcanvas.may_move)return;if(!app&&!this.pcanvas.cur_app){if(!this.pcanvas.may_create)return;var l;if(this.pcanvas.is_vertical)
l=this.DE.get_left();else
l=this.DE.get_top();if(!l)l=0;var start=this.pcanvas.scale.get_world(coord);start=this.pcanvas.scale.snap_world(start);var seltype=this.pcanvas.get_apptype();var app=new Appointment(this.pcanvas,start,start,seltype,-1);this.pcanvas.cur_app=app;this.pcanvas.cur_app.evt=new Event(event_insert,this.pcanvas,this.pcanvas.cur_app,e);global.browser.mouse_capture(this.pcanvas.glassdiv.domelm);}else{var coord,edge;if(this.pcanvas.is_vertical){coord=get_relative_y(global.browser.y,this.pcanvas);edge=get_border_v(app,coord);}else{coord=get_relative_x(global.browser.x,this.pcanvas);edge=get_border_h(app,coord);}
if(edge==Appointment.BODY){var evt=new Event(event_move,this.pcanvas,app,e);evt.from.tw=new TimeWindow(app.tw.start,app.tw.end);this.pcanvas.ddc.mov_obj=app;app.evt=evt;this.pcanvas.cur_app=null;app.set_grip(coord);this.pcanvas.ddc.drag(this.pcanvas,app);}else{this.pcanvas.ddc.mov_obj=null;var evt=new Event(event_resize,this.pcanvas,app,e);app.evt=evt;evt.from.tw=new TimeWindow(app.tw.start,app.tw.end);this.pcanvas.cur_app=app;if(edge==Appointment.LEFT||edge==Appointment.TOP)
app.resizing="b";else
app.resizing="f";}
return false;}
global.browser.cancel_bubble(e);return false;}
function GPOver(e)
{global.browser.event_set_xy(e);this.pcanvas.ddc.enter(this.pcanvas);global.browser.cancel_bubble(e);}
function GPMove(e)
{global.browser.event_set_xy(e);var x=get_relative_x(global.browser.x,this.pcanvas);var y=get_relative_y(global.browser.y,this.pcanvas);if(this.pcanvas.is_vertical){this.pcanvas.appointment_under_v(y);}else{this.pcanvas.appointment_under_h(x);}
if(!this.pcanvas.may_move)return;if(this.pcanvas.cur_app!=null){if(!this.pcanvas.cur_app.may_move)return;if(this.pcanvas.may_resize==false)return;if(this.pcanvas.is_vertical)
this.pcanvas.cur_app.resize_v(this,y);else
this.pcanvas.cur_app.resize_h(this,x);}else
if(this.pcanvas.ddc.mov_obj!=null)
{if(!this.pcanvas.ddc.mov_obj.may_move)return;if(this.pcanvas.is_vertical)
this.pcanvas.ddc.mov_obj.move_v(this,y);else
this.pcanvas.ddc.mov_obj.move_h(this,x);}}
function GPUp(e,o)
{var ret=true;global.browser.event_set_xy(e);global.browser.mouse_release(this);global.mousedown=false;if(!this.pcanvas)return;if(!this.pcanvas.cur_app){ob=this.pcanvas.ddc.mov_obj;if(ob){evt=ob.evt;evt.end_event(this.pcanvas);evt.to.tw=new TimeWindow(ob.tw.start,ob.tw.end);this.pcanvas.ddc.drop(this.pcanvas,this.pcanvas.ddc.mov_obj);if(!this.pcanvas.may_move)ret=false;if(evt.from.dragzone!=evt.to.dropzone){if(!this.pcanvas.may_cross)ret=false;}
if(this.pcanvas.test_overlap(ob)&&!this.pcanvas.may_overlap)ret=false;if(ret==true)ret=this.pcanvas.handler(evt);if(ret==false)evt.rollback();}}else{ob=this.pcanvas.cur_app;if(ob){evt=ob.evt;evt.end_event(this.pcanvas);evt.to.tw=new TimeWindow(ob.tw.start,ob.tw.end);if(!this.pcanvas.may_move)ret=false;if(this.pcanvas.test_overlap(ob)&&!this.pcanvas.may_overlap)ret=false;if(ret==true)ret=this.pcanvas.handler(evt);if(ret==false)evt.rollback();}}
if(this.pcanvas.cur_app){this.pcanvas.cur_app.check();}
this.pcanvas.cur_app=null;this.pcanvas.ddc.mov_obj=null;}
function GPOut(e)
{global.browser.event_set_xy(e);if(this.pcanvas.may_cross)return;global.browser.cancel_bubble(e);if(this.pcanvas.ddc.mov_obj){detach(this.pcanvas.ddc.mov_obj,e);}}
function detach(o,e)
{if(!o)return;var pcanvas=o.parent;global.browser.event_set_xy(e);if(pcanvas.ddc.mov_obj){pcanvas.ddc.leave(pcanvas.ddc.mov_obj,pcanvas);}}
function PlanCanvas(div,start,stop,layout,handler,types,ddc,flags,x,y)
{if(!x)x=0;if(!y)y=0;this.is_vertical=false;this.may_create=true;this.may_move=true;this.may_cross=true;this.may_select=true;this.tw=new TimeWindow(start,stop);this.may_overlap=false;this.may_resize=true;this.use_appcm=true;this.suffix='px';this.showtimes=true;this.use_dur=false;this.width="100%";this.height="100%";var thisobj=this;this.disable_text=function()
{this.showtimes=false;}
this.set_over_func=function(fnc)
{this.overfnc=fnc;}
this.set_suffix=function(sfx)
{if(sfx!='px'&&sfx!='%')sfx='%';this.suffix=sfx;if(sfx=='px'){this.width=div.clientWidth;this.height=div.clientHeight;}}
this.set_suffix('px');if(!ddc)ddc=global.ddc;this.set_flags=function(flags)
{if(flags&PlanCanvas.FLAG_VERTICAL)this.is_vertical=true;if(flags&PlanCanvas.FLAG_NOCREATE)this.may_create=false;if(flags&PlanCanvas.FLAG_NOMOVE)this.may_move=false;if(flags&PlanCanvas.FLAG_NOCROSS)this.may_cross=false;if(flags&PlanCanvas.FLAG_OVERLAP)this.may_overlap=true;if(flags&PlanCanvas.FLAG_NORESIZE)this.may_resize=false;if(flags&PlanCanvas.FLAG_NOSELECT)this.may_select=false;if(flags&PlanCanvas.FLAG_NOAPPCM)this.use_appcm=false;if(flags&PlanCanvas.FLAG_USEDUR)this.use_dur=true;}
this.freeze=function()
{this.may_create=false;this.may_move=false;this.may_cross=false;this.may_resize=false;}
this.thaw=function()
{this.may_create=true;this.may_move=true;this.may_cross=true;this.may_resize=true;}
this.set_flags(flags);this.ddc=ddc;this.handler=handler;this.layout=layout;this.types=types;this.seltype=types[0];this.apps=new Array();this.set_world=function(start,stop){var oldstart=this.start;this.tw=new TimeWindow(start,stop);this.redraw();}
this.set_tw=function(tw){var oldstart=this.start;this.tw=tw;this.redraw();}
this.set_text=function(txt)
{this.backdiv.set_centertext(txt);}
function move_domelm_h(obj,val)
{dom_set_left(obj.slider,val,this.suffix);}
function move_domelm_v(obj,val)
{dom_set_top(obj.slider,val,this.suffix);}
this.wrapup=function(obj)
{obj.slider.removeChild(obj.backdiv.domelm);obj.domelm.removeChild(obj.slider);obj.domelm.appendChild(obj.backdiv.domelm);dom_xywh_px(obj.backdiv.domelm,0,0);}
this.slide=function(amount,time,effect)
{var t1;var newstart=thisobj.tw.start+amount;var newstop=thisobj.tw.end+amount;this.domelm.removeChild(this.backdiv.domelm);var olddiv=this.backdiv;if(this.is_vertical){set_f=dom_set_top;}else{set_f=dom_set_left;}
this.backdiv=new DomDiv(this.domelm,0,0,0,0);dom_xywh_perc(this.backdiv.domelm,0,0,100,100);this.domelm.removeChild(this.backdiv.domelm);this.backdiv.set_position('absolute');this.backdiv.set_z(0);this.backdiv.domelm.pcanvas=this
this.slider=document.createElement("div");this.slider.style.position='absolute';this.domelm.appendChild(this.slider);this.slider.appendChild(olddiv.domelm);this.slider.appendChild(this.backdiv.domelm);this.slider.style.background="red";var cw=this.domelm.clientWidth;if(amount<0){dom_xywh_perc(this.slider,-1*cw,0,100,100);set_f(olddiv.domelm,100,'%');set_f(this.backdiv.domelm,0,'%');}else{dom_xywh_perc(this.slider,0,0,100,100);set_f(olddiv.domelm,0,'%');set_f(this.backdiv.domelm,100,'%');}
thisobj.tw=new TimeWindow(newstart,newstop);this.rescale();drawtimelines(this);var dist;if(this.is_vertical){move_f=move_domelm_v;dist=this.height*-1;}else{move_f=move_domelm_h;dist=this.width*-1;}
if(amount>0){t1=new Animation(move_f,this,0,dist,time,effect,this.wrapup);}else{t1=new Animation(move_f,this,dist,time,effect,this.wrapup);}
t1.go();}
this.find_apptype_byname=function(name)
{for(t=0;t<types.length;t++){if(types[t].name==name)
return types[t];}
return null;}
this.find_apptype=function(id)
{for(t=0;t<types.length;t++){if(types[t].id==id)
return types[t];}
return types[0];}
this.appointment_under_h=function(x)
{for(t=0;t<this.appointment_count();t++){app=this.appointment_get(t);if(app.contains_h(x)){if(this.overfnc)this.overfnc(app);return app;}}
if(this.overfnc)this.overfnc(null);return null;}
this.appointment_under_v=function(y)
{for(t=0;t<this.appointment_count();t++){app=this.appointment_get(t);if(app.contains_v(y)){if(this.overfnc)this.overfnc(app);return app;}}
if(this.overfnc)this.overfnc(null);return null;}
this.drop=function(o)
{}
this.drag=function(o)
{}
this.get_apptype=function()
{return this.seltype;}
this.set_apptype=function(apptp)
{this.seltype=apptp;}
this.set_legend=function(l)
{this.legend=l;this.get_apptype=function(){if(this.legend)
return this.legend.get_apptype();return this.seltype;}}
this.set_opacity=function(opacity)
{this.opacity=opacity;}
this.clear=function()
{this.del_appointments();}
this.set_img=function(url)
{this.backdiv.set_img(url);}
this.timestamp=function(l)
{var left=global.browser.getAbsoluteLeft(this.domelm);var s=this.scale.get_world(l);return s;}
function tw_sort(a,b)
{if(a.tw.start<b.tw.start)return-1;if(a.tw.start>b.tw.start)return 1;if(a.tw.end<b.tw.end)return-1;if(a.tw.end>b.tw.end)return 1;return 0;}
this.appointment_sort=function()
{return this.apps.sort(tw_sort);}
this.appointment_count=function()
{return this.apps.length;}
this.appointment_get=function(n)
{return this.apps[n];}
this.check=function()
{for(n=this.apps.length-1;n>=0;n--)
this.apps[n].check();}
this.appointment_get_index=function(handle)
{for(n=0;n<this.apps.length;n++)
if(this.apps[n]==handle)
return n;return-1;}
this.appointment_get_byid=function(id)
{for(n=0;n<this.apps.length;n++)
if(this.apps[n].id==id)
return this.apps[n];return null;}
this.appointment_get_byname=function(name)
{for(n=0;n<this.apps.length;n++)
if(this.apps[n].name==name)
return this.apps[n];return null;}
this.appointment_glue=function(a,n)
{b=this.apps[n];if(a.tw.end==b.tw.start)
a.tw.end=b.tw.end;else
if(a.tw.start==b.tw.end)
a.tw.start=b.tw.start;else
return;this.appointment_del(n);this.redraw();}
this.del_appointment=function(app)
{for(n in this.apps){o=this.apps[n];if(app==o){delete_child(this.backdiv.domelm,o.domelm);this.apps.splice(n,1);}}}
this.appointment_del=function(n)
{if(n>this.apps.length)return;o=this.apps[n];delete_child(this.backdiv.domelm,o.domelm);this.apps.splice(n,1);}
this.del_appointments=function()
{while(this.appointment_count()>0)
this.appointment_del(0);}
this.set_world_snap=function(offset,step)
{this.scale.set_world_snap(offset,step);}
this.detach=function(o)
{delete_child(this.backdiv.domelm,o.domelm);o.parent=null;this.ddc.mov_obj=null;for(n=0;n<this.apps.length;n++){if(this.apps[n]==o){this.apps.splice(n,1);break;}}}
this.test_overlap=function(o)
{for(n=0;n<this.apps.length;n++){var testob=this.apps[n];if(o!=testob){if(((o.tw.end<=testob.tw.start)||(o.tw.start>=testob.tw.end))==false)
return true;}}
return false;}
this.attach=function(o)
{if(!o)return;o.parent=this;this.cur_app=null;this.ddc.mov_obj=o;append_child(this.backdiv.domelm,o.domelm);global.browser.mouse_release(this);var n=this.apps.length;this.apps.splice(n,0,o);}
this.domelm=document.createElement("div");this.domelm.style.position='relative';this.domelm.className="plancanvas";if(layout.cname)
this.domelm.className+=" "+layout.cname;this.tw=new TimeWindow(start,stop);this.rescale=function()
{var w=this.width;var h=this.height;if(this.is_vertical){this.pxscale=new Scale(0,100,0,h);this.min=100/h;this.scale=new Scale(this.tw.start,this.tw.end,0,h);}else{this.pxscale=new Scale(0,100,0,w);this.min=100/w;this.scale=new Scale(this.tw.start,this.tw.end,0,w);}
this.set_world_snap(0,this.layout.snap_at);}
this.redraw=function()
{this.rescale();cleartimelines(this);drawtimelines(this);drawappointments(this);}
this.resize=function(w,h)
{if(w)this.width=w;if(h)this.height=h;dom_xywh_px(this.domelm,0,0,this.width,this.height);dom_xywh_px(this.backdiv.domelm,0,0,this.width,this.height);dom_xywh_px(this.glassdiv.domelm,0,0,this.width,this.height);this.redraw();}
this.xywh=function(x,y,w,h)
{if(w)this.width=w;if(h)this.height=h;dom_xywh_px(this.domelm,x,y,w,h);dom_xywh_px(this.backdiv.domelm,0,0,w,h);dom_xywh_px(this.glassdiv.domelm,0,0,w,h);this.redraw();}
thisobj.set_appointmentmenu=function()
{this.appmenu=new PopupMenu();this.add_menuitem=function(mi)
{var data=new Object();data.app=thisobj.app;mi.set_data(data);this.appmenu.target=this.appmenu;this.appmenu.add_menuitem(mi);}
this.add_delete_item=function(caption,color)
{if(!caption)caption='delete';var data=new Object();data.app=thisobj.app;var mi=new MenuItem(caption,delete_app,color);mi.set_data(data);this.appmenu.target=this.appmenu;this.appmenu.add_menuitem(mi);}
this.add_glue_item=function(caption,color)
{if(!caption)caption='glue';var data=new Object();data.app=thisobj.app;var mi=new MenuItem(caption,glue_app,color);mi.set_data(data);this.appmenu.target=this.appmenu;this.appmenu.add_menuitem(mi);}
this.add_apptype_items=function()
{var types=thisobj.types;for(t=0;t<types.length;t++){var data=new Object();data.app=thisobj.app;data.name=types[t].name;var mi=new MenuItem(types[t].name,change_type,types[t].cname);if(types[t].color)
mi.set_bg(types[t].color);mi.set_data(data);this.appmenu.target=this.appmenu;this.appmenu.add_menuitem(mi);}}
this.add_edittimes=function(caption,color)
{if(!caption)caption='set times';var data=new Object();data.app=thisobj.app;var mi=new MenuItem(caption,popup_edittime,color);mi.set_data(data);this.appmenu.target=this.appmenu;this.appmenu.add_menuitem(mi);}
return this;}
thisobj.set_menu=function()
{this.menu=new PopupMenu();this.add_menuitem=function(mi)
{var data=new Object();data.app=thisobj.app;mi.set_data(data);this.menu.target=this.menu;this.menu.add_menuitem(mi);}
return this;}
function change_type(popupmenu,data)
{if(!data)return;var at=thisobj.find_apptype_byname(data.name);if(!at)return;popupmenu.data.set_apptype(at);}
function delete_app(popupmenu,data)
{var a;if(!data)return;app=popupmenu.data;for(a=0;a<thisobj.apps.length;a++)
if(app==thisobj.apps[a]){thisobj.appointment_del(a);app.Trash();return;}}
function glue_neighbour(data)
{var a;if(!data)return;for(a=0;a<thisobj.apps.length;a++)
if(app.apptype==thisobj.apps[a].apptype&&(app.tw.start==thisobj.apps[a].tw.end||app.tw.end==thisobj.apps[a].tw.start)){thisobj.appointment_glue(app,a);}}
function glue_app(popupmenu,data)
{if(!data)return;app=popupmenu.data;glue_neighbour(app);glue_neighbour(app);}
function popup_edittime(popupmenu,data)
{if(!data)return;app=popupmenu.data;app.set_editable(true);}
this.backdiv=new DomDiv(this.domelm,0,0,0,0);dom_xywh_sfx(this.backdiv.domelm,0,0,this.width,this.height,this.suffix);this.backdiv.set_position('absolute');this.backdiv.set_z(0);this.glassdiv=new DomDiv(this.domelm,0,0,0,0);dom_xywh_sfx(this.glassdiv.domelm,0,0,this.width,this.height,this.suffix);this.glassdiv.set_position('absolute');this.glassdiv.set_opacity(0.0);this.glassdiv.domelm.style.background="white";this.glassdiv.set_z(2);function make_timetbl(elm,w,ts,te)
{var d;d=new DomTable(elm);if(thisobj.is_vertical){d.sh(700);d.sw(50);}else{d.sw(700);d.sh(50);}
d.sl(ts);d.set_position("absolute");d.domelm.className="timelines";r=d.add_row(0,null);for(ct=0;ct<w;ct++){c=d.add_col(0,ct);}
if(tpi.cname)
d.domelm.className+=" "+tpi.cname;return d.domelm;if(ps%tpi.lfreq==0){if(thisobj.layout.tf)
displaytxt=thisobj.layout.tf(ts);else
displaytxt=gues_format(ts,tpi.freq);d.set_centertext(displaytxt);}
return d.domelm;}
function make_activediv(elm,start,w)
{if(thisobj.is_vertical){d=document.createElement('div');elm.appendChild(d);dom_xywh_sfx(d,0,start,thisobj.width,w,thisobj.suffix);}else{d=document.createElement('div');elm.appendChild(d);dom_xywh_sfx(d,start,0,w,thisobj.height,thisobj.suffix);}
d.style.position="absolute";d.style.background="black";global.browser.set_opacity(d,0.05);d.innerHTML="";d.style.fontSize=1;return d;}
function make_timediv(elm,laststart,w,ps,ts)
{var d;if(thisobj.is_vertical){d=document.createElement('div');elm.appendChild(d);dom_xywh_sfx(d,0,laststart,null,w,thisobj.suffix);}else{d=document.createElement('div');elm.appendChild(d);dom_xywh_sfx(d,laststart,0,w,null,thisobj.suffix);}
d.style.position="absolute";d.className="timelines";if(tpi.cname)
d.className+=" "+tpi.cname;if(ps%tpi.lfreq==0){if(thisobj.layout.tf)
displaytxt=thisobj.layout.tf(ts);else
displaytxt=gues_format(ts,tpi.freq);d.innerHTML=displaytxt;}
return d;}
function cleartimelines(pc)
{if(!pc.decorations)return;for(var t=0;t<pc.decorations.length;t++){var c=pc.decorations[t];pc.backdiv.domelm.removeChild(c);}}
function drawappointments(pc)
{for(n=0;n<pc.apps.length;n++){var app=pc.apps[n];app.redraw(app);}}
function drawtimelines(pc)
{var nt=pc.layout.timelines.length;pc.decorations=new Array();var total=0;for(t=0;t<nt;t++){tpi=pc.layout.timelines[t];ts=0;if(tpi.freq!=0){ts=Math.floor((pc.tw.start-tpi.anchor)/tpi.freq);}
ts*=tpi.freq;ts+=tpi.anchor;var ps=0;if(tpi.start){while(ts<tpi.start)
ts+=tpi.freq;}
for(;ts<pc.tw.end+tpi.freq;ts+=tpi.freq)
{var start=pc.scale.get_model(ts);var end=pc.scale.get_model(ts+tpi.dur);var w=end-start;pc.decorations[pc.decorations.length]=make_timediv(pc.backdiv.domelm,start,w,ps,ts);if(tpi.freq==0)break;if(tpi.end){if(ts>tpi.end)break;}
ps++;}}
if(pc.layout.active){start=pc.layout.active.start;end=pc.layout.active.end;var start=pc.scale.get_model(start);var end=pc.scale.get_model(end);var w=end-start;if(w<0)
w=0;if(pc.layout.invert_active){if(start>0)
pc.decorations[pc.decorations.length]=make_activediv(pc.backdiv.domelm,0,start);if(end<100)
pc.decorations[pc.decorations.length]=make_activediv(pc.backdiv.domelm,end,100);}else{pc.decorations[pc.decorations.length]=make_activediv(pc.backdiv.domelm,start,w);}}}
this.inheritz(new DragZone("PlanCanvas"));this.inheritz(new DropZone("PlanCanvas"));this.glassdiv.domelm.pcanvas=this
this.backdiv.domelm.pcanvas=this
this.domelm.style.overflow="hidden";this.glassdiv.domelm.onmouseup=GPUp;this.glassdiv.domelm.onmousedown=GPDown;this.glassdiv.domelm.onmousemove=GPMove;this.glassdiv.domelm.onmouseout=GPOut;this.glassdiv.domelm.onmouseover=GPOver;ddc.add_elm(this);append_child(div,this.domelm);this.resize(div.clientWidth,div.clientHeight);this.redraw();if(global.resizecontext)
global.resizecontext.add(thisobj);}
PlanCanvas.prototype=new Class();