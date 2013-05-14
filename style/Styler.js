function Styler(id)
{
    if (!id) 
        id = "feyenoord_ss";

    var styles=new Object;
    var documents=new Array;
    var dir="style";

    this.add_style = function(name,dir)
    {
        styles[name]=dir;
    }

    // in case you have mutiple docs !!
    this.add_document = function(doc)
    {
        n = documents.length;
        documents[n] = doc;
    }

    this.set_style = function(name)
    {
        dir = styles[name];
        if (!dir) dir = "style";
        sfile = dir + "/style.css";
        for (doc in documents) {
            documents[doc].getElementById(id).href = sfile;
        }
        set_cookie("feyenoord_css",name,100);
    }

    this.set_by_cookie= function(alternate)
    {
        name=get_cookie("feyenoord_css");
        if (!name || name=="null") name=alternate;
        this.set_style(name);
    }

    // attributes css cannot provide : later !!
    this.get_object= function(file,id)
    {
        var jc = new JsonContext("style/style.php");
    }

    this.set_by_popup = function(p,e)
    {
        //var pp = New Popup(e);

        //p.appendChild(pp);
//
        //for (s in styles) {
            //o = document.createElement("option");
        //}
    }

    // default doc (manual ?)
    //this.add_document(document);

}
