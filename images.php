<?

class layout
{
    var $daycolors = Array(7); //0 (mon) to 6 (sun)
    var $line_at = 0;
    var $text_at = 0;
    var $dates=false;

    function layout()
    {
        $pos = $_GET["dates"];
        if ($pos) $this->dates = true;

        $pos = $_GET["line_at"];
        if ($pos) $this->line_at = $pos * 60;

        $pos = $_GET["text_at"];
        if ($pos) $this->text_at = $pos * 60;

        $day = $_GET["sun"];
        if (!$day) { 
            $day="#229999"; // default to something horrible
        }
        $this->daycolors[1] = new temp_color($day);

        $day = $_GET["mon"];
        if ($day) $this->daycolors[2] = new temp_color($day);
        else $this->daycolors[2] = $this->daycolors[1]; // default to sunday

        $day = $_GET["tue"];
        if ($day) $this->daycolors[3] = new temp_color($day);
        else $this->daycolors[3] = $this->daycolors[2]; // default to monday

        $day = $_GET["wed"];
        if ($day) $this->daycolors[4] = new temp_color($day);
        else $this->daycolors[4] = $this->daycolors[2]; // default to monday

        $day = $_GET["thu"];
        if ($day) $this->daycolors[5] = new temp_color($day);
        else $this->daycolors[5] = $this->daycolors[3]; // default to tuesday

        $day = $_GET["fri"];
        if ($day) $this->daycolors[6] = new temp_color($day);
        else $this->daycolors[6] = $this->daycolors[2]; // default to monday

        $day = $_GET["sat"];
        if ($day) $this->daycolors[0] = new temp_color($day);
        else $this->daycolors[0] = $this->daycolors[1]; // default to sunday
    }

    function get_color($wd,$im)
    {    
        $color = $this->daycolors[$wd];
        return $color->get($im);
    }
}

class scale
{
    // modelleft, .. worldright
    // just tilt your head if you need vertical scaling ;)
    var $ml,$mr;
    var $wl,$wr;

    // image and world width
    var $mw;
    var $ww;

    var $scale;

    function scale($wl,$wr,$ml,$mr)
    {

        $this->ml = $ml;
        $this->mr = $mr;
        $this->wl = $wl;
        $this->wr = $wr;
        
        $this->ww = $this->wr-$this->wl;
        if ($this->ww==0) $this->ww = 1;
        $this->mw = $this->mr-$this->ml;

        $this->scale = $this->mw/$this->ww;
    }

    function get_world($ix)
    {
        return (($ix - $this->wl) / $this->scale) + $this->wl;
    }

    function get_model($mx)
    {
        $mr = (($mx - $this->wl) * $this->scale) + $this->ml;
        return $mr;
    }
}

// just a local class 
class temp_color
{
    var $r,$g,$b;
    var $a;
    
    var $imgcolor;

    function alpa($a)
    {
        $this->a = $a;
    }

    function temp_color($hex)
    {
        $t = 0;
        if ($hex[$t] == "#") $t++;
        $cl = substr($hex,$t,2);
        $this->r = hexdec($cl);
        $t+=2;
        $cl = substr($hex,$t,2);
        $this->g = hexdec($cl);
        $t+=2;
        $cl = substr($hex,$t,2);
        $this->b = hexdec($cl);

        $this->a = 0;
    }

    function get($im) // ONE image only for now
    {
        $alpha=$this->a;
        if (!$this->imgcolor) 
        $this->imgcolor =  imagecolorallocatealpha($im, $this->r, $this->g, $this->b, $alpha);
        return $this->imgcolor;
    }
}

class pb_image
{
    var $x,$y,$left,$right;
    var $base;
    var $fg, $bg, $dlines, $llines;
    var $xscale;
    var $hours=0;
    var $line=0;
    var $dates=false;

    var $day_font = 3; // looks best when you got the space
    var $hour_font = 1; // here you have not!

    var $layout;

    function get_name()
    {
        if ($this->base) $this->name = $this->base . "/";

        $this->name .= $this->x . "_" . $this->y . "_";
        $this->name .= $this->left . "_" . $this->right;

        return $this->name;
    }

    function pb_image($x,$y,$start,$stop,$layout)
    {
        $this->layout = $layout;
        $this->make_pb_image($x,$y,$start,$stop,$layout->text_at,$layout->dates,$layout->line_at);
    }

    function make_pb_image($x,$y,$start,$stop,$hours,$dates,$line)
   {
        $this->x = $x;
        $this->y = $y;
        $this->left = $start; // millis to seconds
        $this->right = $stop;
        $this->hours = $hours;
        $this->dates = $dates;
        $this->line = $line;
        $this->bg = new temp_color("#140000");
        $this->fg = new temp_color("#282828");
        $this->dayclr = new temp_color("#909090");
        $this->llines = new temp_color("#aaaaaa");
        $this->dlines = new temp_color("#cccccc");

        $this->xscale = new scale($start,$stop,0,$x);
    }

    function set_bg($rgb) {
        $this->bg = new temp_color($rgb);
    }

    function set_fg($rgb) {
        $this->fg = new temp_color($rgb);
    }

    function generate($base,$output)
    {
        $this->base = $base;

        header ("Content-type: image/png");
        $im = @imagecreatetruecolor($this->x, $this->y)
         or die("Cannot Initialize new GD image stream");
        $bg_color = $this->bg->get($im);
        imagefilledrectangle($im, 0, 0, $this->x, $this->y, $bg_color);


        $this->draw_days($im,$this->line,$color);

        $color = $this->llines->get($im);
        if ($this->line != 0) $this->draw_lines($im,$this->line,$color);
        $color = $this->dlines->get($im);
        if ($this->line != 0) $this->draw_lines($im,$this->line*2,$color);
        $color = $this->fg->get($im);
        if ($this->hours != 0) $this->draw_hours($im,$this->hours,$color);
        $color = $this->dayclr->get($im);
        if ($this->dates) $this->draw_dates($im,$color);

        $text_color = $this->fg->get($im);
        $the_name = $this->get_name();
        if ($output) imagepng($im);
        imagedestroy($im);
    }

    function draw_lines($im,$space,$color)
    {
        //$ts = $this->left - ($this->left % $space);
        $ts = $this->left ;
        //$ts += $space;

        for ($t=$ts; $t< $this->right; $t += $space)
        {
            $xoff = $this->xscale->get_model($t);
            // draw the pixel 'around' the line or 
            // to the right if its on a border
            $xoff = floor($xoff);
            imageline($im, $xoff, 0, $xoff, $this->y, $color);
        }
    }

    function draw_hours($im,$space,$txt_color)
    {
        //$ts = $this->left - ($this->left % $space);
        $ts = $this->left;
        //$ts += $space;

        for ($t=$ts; $t< $this->right; $t += $space)
        {
            $xoff = $this->xscale->get_model($t);
            $xoff = floor($xoff);
            $the_name = date('H:i', $t); 
            imagestring($im, $this->hour_font, $xoff-14, $this->y-7,  $the_name, $txt_color);
        }
    }

    function draw_days($im,$color)
    {
        $space = 24 * 60 * 60;
        $ts = $this->left ;
        $stop = false;

        $left = 0;
        for ($t=$ts; $stop==false ;$t += $space)
        {
            if ($t > $this->right) {
                $stop=true;
                $t = $his->right;
            }
            $xoff = $this->xscale->get_model($t);
            // draw the pixel 'around' the line or 
            // to the right if its on a border
            $xoff = floor($xoff);
            $lt = localtime($t);
            $wday = $lt[6];
            $color = $this->layout->get_color($wday,$im);
            imagefilledrectangle($im, $left, 0, $xoff,$this->y, $color);
            $left = $xoff;
        }
    }

    function get_date($t,&$ref)
    {
        $wid = imagefontwidth($this->day_font);
        $the_name = date('D j F', $t); 
        if (($wid * strlen($the_name)) > $ref ) 
            $the_name = date('D j', $t); 
        if (($wid * strlen($the_name)) > $ref ) 
            $the_name = date('j', $t); 
        if (($wid * strlen($the_name)) > $ref ) 
            $the_name = "";

        $wid *= strlen($the_name);
        $ref = ($ref-$wid) /2;

        return $the_name;
    }

    function draw_dates($im,$color)
    {
        $space = 24 * 60 * 60;
        $ts = $this->left;
        $h = $this->y;
        $daylength = $this->xscale->get_model(24*60*60) - 
                    $this->xscale->get_model(0);
        $yoff = $h /2 ;

        for ($t=$ts; $t< $this->right; $t += $space)
        {
            $xoff = $this->xscale->get_model($t);
            $ref = $daylength;
            $the_name = $this->get_date($t,$ref); 
            $xoff += $ref;
            imagestring($im, $this->day_font, $xoff-4, $yoff-($this->day_font*2),  $the_name, $color);
        }
    }
}

class image_cache
{

    function image_cache($url)
    {
        
    }

    function construct_name()
    {
        
    }
}

// only dynamic stuff
$start = $_GET['start'];
$stop = $_GET['stop'];
$x = $_GET['x'];
$y = $_GET['y'];

$layout = new layout();
$output = true;

if (!function_exists(imagecreatetruecolor)) {
	echo "install php5-gd on the server to generate images !!";
	exit();
}

// test mode
if (! $x) { //dump some standard image
$x = 600;
$y = 100;
$line = 1000;
$now = gettimeofday();
$start = $now['sec'];
$stop = $start + (60*60*24);
$dates = 1000;
}

#$output = false;

$bi = new pb_image($x,$y,$start,$stop,$layout);
$bi->set_bg("#eeeeee");
$bi->generate(".",$output);
