<?
class Color
{
	var $r,$g,$b;
	var $a;

	var $imgcolor;

	function set_alpha($a)
	{
	    $this->a = $a;
	}

	function set_rgb($r,$g,$b)
	{
	    $this->r = $r;
	    $this->g = $g;
	    $this->b = $b;
	}

	function set_hex($hex)
	{
        $t = 0;
        if ($hex[$t] == "#") $t++;
        if ($hex[$t] == "h") $t++;
        $cl = substr($hex,$t,2);
        $this->r = hexdec($cl);
        $t+=2;
        $cl = substr($hex,$t,2);
        $this->g = hexdec($cl);
        $t+=2;
        $cl = substr($hex,$t,2);
        $this->b = hexdec($cl);

        $this->a = 0; // initial
	}

	function set_named($nm)
	{
		// TODO: array of named colors
	}

	function Color($r,$g,$b,$a)
	{
		$this->set_rgb($r,$g,$b);
		$this->set_alpha($a);
	}

    function get($im) // ONE image only for now
    {
        $alpha=$this->a;
        if (!$this->imgcolor)
        $this->imgcolor =  imagecolorallocatealpha($im, $this->r, $this->g, $this->b, $alpha);
        return $this->imgcolor;
    }

}
?>
