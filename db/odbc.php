<?

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

class Odbc
{
	var $dsn;
	var $db;
	var $auth;
	var $con;
	var $err;

	function Odbc($dsn,$db,$auth)
	{
		$this->err=null;
		$this->dsn = $dsn;
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
		if (!function_exists(odbc_connect)) { 
			$this->err="server php installation has no odbc support !!  (install php5-mysql)";
			return null;
		}
		$this->con = odbc_connect($this->dsn, $this->auth->uname, $this->auth->pwd);
	}

	function error()
	{
		return mysql_error();
	}

	function sel_db($dbname)
	{
		if (!$dbname) $dbname = $this->db;
		if (!$dbname) return; // db could also come from the query itself

		if (mysql_select_db($dbname, $this->con) === false) {
           echo('Could not select database: ' . mysql_error());
           continue;
       }
	}

	function close()
	{
		// ?
	}

	function insert_id()
	{
		return mysql_insert_id($this->con);
	}

	// return whole query in an array of rows that are associative
	function qry_assoc($qry)
	{
		$rval = Array();
		$res = mysql_query($qry);
		if (!$res) return null;
		while ($row = mysql_fetch_assoc($res))
		{
			array_push($rval,$row);
		}
		return $rval;
	}
	
	// return whole query in an array of rows which are arrays 
	function qry_array($qry)
	{
		$rval = Array();
		$res = mysql_query($qry);
		if (!$res) return null;

		while ($row = mysql_fetch_array($res))
		{
			array_push($rval,$row);
		}
		return $rval;
	}

	// return just true or false
	function qry_boolean($qry)
	{
		$res = mysql_query($qry);
		if (!$res) return false;

		return true;
	}

	function instruct()
	{
		echo "these settings suggest that you should first :<br>";
		echo "create database $this->db;<br>";
		$privcmd = "grant all privileges on " . $this->db . 
			".* to " . $this->auth->uname . "@" . $this->dsn . 
			" identified by [refusing to reveal the password here];<br>";
		echo $privcmd;
		echo "OR alter your settings in database.php<br>";
	}
}
?>
