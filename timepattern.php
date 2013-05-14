<?
ini_set("include_path", ".:feyenoord:feyenoord/lib:feyenoord/db");

require_once "mysql.php";
require_once "JSON.php";

class TimePattern
{
    function TimePattern($tw,$iv) 
    {
        $this->tw =$tw;
        $this->iv =$iv;
		$this->operation="INVALID";
		if ($operation) $this->operation=$operation;
    }

	// construct the complete pattern from one id
	function read($mysql,$id)
	{
		$qry = "SELECT * FROM tp_pattern WHERE id = '" . $id . "'";
    	$res = $mysql->qry_assoc($qry);

		$this->operation= $res[0]['operation'];
		switch ($this->operation)
		{
			case 'LEAF':
				$this->iv= new Interval(null,null);
				$this->iv->read($mysql,$res[0]['op1_or_interval']);
				$this->tw= new TimeWindow(null,null);
				$this->tw->read($mysql,$res[0]['op2_or_window']);
			break;
			case 'AND':
			case 'OR':
				$this->op1= new TimePattern(null,null);
				$this->op1->read($mysql,$res[0]['op1_or_interval']);
				$this->op2= new TimePattern(null,null);
				$this->op2->read($mysql,$res[0]['op2_or_window']);
			break;
			case 'NOT':
				$this->op1= new TimePattern(null,null);
				$this->op1->read($mysql,$res[0]['op1_or_interval']);
			break;
			default:
				//$this->operation="INVALID";
				$this->operation=$qry;
			break;
		}
	}
}

class TimeWindow
{
	function TimeWindow($start,$end)
	{
		$this->start=$start;
		$this->end=$end;
	}

	// construct the complete pattern from one id
	function read($mysql,$id)
	{
		$qry = "SELECT * FROM tp_window WHERE id = '" . $id . "'";
    	$res = $mysql->qry_assoc($qry);

		$this->start=$res[0]['start'];
		$this->end=$res[0]['end'];
	}
}

class Interval
{
	function Interval($anchor,$period)
	{
		$this->anchor=$anchor;
		$this->period=$period;
	}

	// construct the complete pattern from one id
	function read($mysql,$id)
	{
		$qry = "SELECT * FROM tp_interval WHERE id = '" . $id . "'";
    	$res = $mysql->qry_assoc($qry);

		$this->anchor=$res[0]['anchor'];
		$this->period=$res[0]['period'];
		$this->unit=$res[0]['unit'];
	}
}

$testing=false;
if ($testing) {
	$server="localhost";
	$db="adaptime";
	
	$auth= new Auth("kees","][p][p");
	$m = new MySql($server,$db,$auth);
	
	$tp = new TimePattern("aa","bb");
	$tp->read($m,"0");
	
	$json = new Services_JSON();
	$omsg = $json->encode($tp);
	
	printf($omsg);
}

?>
