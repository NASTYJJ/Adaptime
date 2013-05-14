<?
// inifile is not  standard, so here is a simple inifile reader
// but it is a READ ONLY version of dbrw.php
// OBSOLETE !!, but maybe handy for other uses so i won't delete!

class section {
	var $name;
	var $entries = Array();
	
	function section($name) {
		$this->name = $name;
	}

	function add_entry($k,$v) {
		$this->entries[$k] = $v;
	}

	function get_entry($name) {
		return $this->entries[$name];
	}

	function dump()
	{
		print "[ $this->name ]<br>\n";
		foreach ($this->entries as $key => $val) {
			print "$key = $val<br>\n";
		}
	}
}

class ini_db {
	var $file;
	var $db=null;
	var $offline = Array();

	function ini_db($name)
	{
		$this->file = $name;
	}

	function change_entry($section,$key,$val)
	{
		echo "READ ONLY VERSION";
	}

	function parse_line($buffer,$key,$val)
	{
		$trimmed = ltrim($buffer);
		$key=null;
		$val=null;
		if ($trimmed == "") {
			 return;
		}

		$char = $trimmed{0};
		if ($char == "[") {
			$key=null;
			$buffer=substr($buffer,1,strlen($buffer)-1);
			$val=strtok($buffer,"]");
		} else if ($char != "#" && $char != '/') { // comment
			$key=strtok($buffer,"=");
			$val=strtok("\n\t");
		}
	}

	function read_all()
	{
		$this->fp = @fopen($this->file, "r");
		if (!$this->fp) {
			return null;
		}

		while (!feof($this->fp)) {
		    $buffer = fgets($this->fp, 4096);
		    $this->parse_line($buffer,&$key,&$val);
			if ($key == null && $val != null) {
				$section = new section($val);
				$this->offline[$val] = $section;
			} else 
			if ($key != null && $val != null) {
				$section->add_entry($key,$val);
			}
		}
		fclose($this->fp);
		return $this->offline;
	}

	function dump()
	{
		foreach ($this->offline as $section) {
			$section->dump();
		}
	}
	
}
?>
