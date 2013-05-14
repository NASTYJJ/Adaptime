<?

function encode_assoc(&$res)
{
	for ($r=0; $r< count($res); $r++) {
		foreach($res[$r] as &$value) {
			$value=rawurlencode($value);
		}
	}
}

class LoginEntry {
	function LoginEntry($host,$db,$name,$pass)
	{
		$this->host=$host;
		$this->db=$db;
		$this->name=$name;
		$this->pass=$pass;
	}
}

class Auth
{
	var $uname="testuser";
	var $pwd="testpwd";

	function Auth($uname,$pwd)
	{
		$this->uname=$uname;
		$this->pwd=$pwd;
	}
}

class MySql
{
	var $server;
	var $db;
	var $auth;
	var $con;
	var $err;

	function MySql($server,$db,$auth)
	{
		$this->err=null;
		$this->server = $server;
		$this->db = $db;
		$this->auth = $auth;
		$this->connect();
		if (!$this->con) { 
			if (!$this->err) {
				$this->err=mysql_error();
			}
			return;
		}
		$this->sel_db($this->db);
	}

	function connect()
	{
		if (!function_exists(mysql_pconnect)) { 
			$this->err="server php installation has no mysql support !!  (install php5-mysql)";
			return null;
		}
		$this->con = @mysql_pconnect($this->server, $this->auth->uname, $this->auth->pwd);
	}

	function error()
	{
		return mysql_error();
	}

	function sel_db($dbname)
	{
		if (!$dbname) $dbname = $this->db;
		if (!$dbname) return; // db could also come from the query itself

		if (@mysql_select_db($dbname, $this->con) === false) {
           //echo('Could not select database: ' . mysql_error());
       }
	}

	function close()
	{
		mysql_close($this->con);
	}

	function insert_id()
	{
		return mysql_insert_id($this->con);
	}

	function qry($qry)
	{
		return mysql_query($qry);
	}

	function get_assoc($res)
	{
		$rval = Array();
		if (!$res) return null;
		while ($row = mysql_fetch_assoc($res))
		{
			array_push($rval,$row);
		}
		return $rval;
	}
	
	// return whole query in an array of rows that are associative
	function qry_assoc($qry)
	{
		$res = mysql_query($qry);
		return $this->get_assoc($res);
	}

	function get_cols($res)
	{
		$rval = Array();
		while ($i < mysql_num_fields($res)) {
    		$col = mysql_fetch_field($res, $i);
			array_push($rval,$col);
			$i++;
		}
		return $rval;
	}

	// return whole query in an array of rows which are arrays 
	function get_array($res)
	{
		$rval = Array();
		if (!$res) return null;
		while ($row = mysql_fetch_array($res))
		{
			array_push($rval,$row);
		}
		return $rval;
	}

	// return whole query in an array of rows which are arrays 
	function qry_array($qry)
	{
		$res = mysql_query($qry);
		return $this->get_array($res);
	}

	// return just true or false
	function get_boolean($res)
	{
		if (!$res) return false;
		return true;
	}

	// return just true or false
	function qry_boolean($qry)
	{
		$res = mysql_query($qry);
		return $this->get_boolean($res);
	}

	function instruct()
	{
		echo "these settings suggest that you should first :<br>";
		echo "create database $this->db;<br>";
		$privcmd = "grant all privileges on " . $this->db . 
			".* to " . $this->auth->uname . "@" . $this->server . 
			" identified by [refusing to reveal the password here];<br>";
		echo $privcmd;
		echo "OR alter your settings in database.php<br>";
	}
}
?>
