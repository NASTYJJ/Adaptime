<?
ini_set("include_path", ".:feyenoord:..");

session_start();

require_once "passwords.php";
require_once "mysql.php";
require_once "ajax.php";

$cmd=$_GET['cmd'];
$json=$_GET['json'];
if (!$json) {
$cmd=$_POST['cmd'];
$json=$_POST['json'];
}

function db_error($inmsg,$err)
{
    $gm = new JsonResult("error", $inmsg->cmd, $err);
    return $gm;
}

function open_db($login)
{
	global $passkeys;
	$l = $passkeys[$login];

    //global $DB_USER, $DB_NAME, $DB_HOST, $DB_PASS;
    $auth = new Auth($l->name,$l->pass);
    $mysql = new MySql($l->host,$l->db,$auth);

    if (!$mysql->con) {
        if (!$mysql->err) echo $mysql->error();
    }

    return $mysql;
}

// get the data of a particular budget
function get_cols($inmsg)
{
    $gm = new JsonResult("ok", $inmsg->cmd,null);
    $login = $inmsg->get_object(0);
    if (!$mysql) $mysql = open_db($login);
    if ($mysql->err) 
    return db_error($inmsg,$mysql->err);

    $tbname = $inmsg->get_object(1);

    $query = $inmsg->get_object(2);
    $qry = "SHOW COLUMNS from $tbname";
    $res = $mysql->qry_assoc($qry);
    $gm->add_object($res);

    return $gm;
}

function get_rows($inmsg)
{
    $gm = new JsonResult("ok", $inmsg->cmd,null);
    $login = $inmsg->get_object(0);
    if (!$mysql) $mysql = open_db($login);
    if ($mysql->err) 
    return db_error($inmsg,$mysql->err);

    $tbname = $inmsg->get_object(1);

    $qry = "SELECT * from $tbname";

    $res = $mysql->qry_assoc($qry);
    $gm->add_object($res);

    return $gm;
}

function get_rowcols($inmsg)
{
    $gm = new JsonResult("ok", $inmsg->cmd,null);
    $login = $inmsg->get_object(0);
    if (!$mysql) $mysql = open_db($login);
    if ($mysql->err) 
    return db_error($inmsg,$mysql->err);

    $table = $inmsg->get_object(1);
    $qry = $inmsg->get_object(2);

	if (!$qry) $qry="SELECT * FROM " . $table;
    $res = $mysql->qry($qry);

	if (!$res) return db_error($inmsg,$mysql->err);
	
	$rows=$mysql->get_assoc($res);
    $gm->add_object($rows);
	$cols=$mysql->get_cols($res);
    $gm->add_object($cols);

    return $gm;
}

function get_query($inmsg)
{
    $gm = new JsonResult("ok", $inmsg->cmd,null);
    $login = $inmsg->get_object(0);
    if (!$mysql) $mysql = open_db($login);
    if ($mysql->err) 
    return db_error($inmsg,$mysql->err);

    $qry = $inmsg->get_object(1);

    $res = $mysql->qry_assoc($qry);
    $gm->add_object($res);

    return $gm;
}

function get_selection($inmsg)
{
    $gm = new JsonResult("ok", $inmsg->cmd,null);
    $login = $inmsg->get_object(0);
    if (!$mysql) $mysql = open_db($login);
    if ($mysql->err) 
    return db_error($inmsg,$mysql->err);

    $qry = $inmsg->get_object(1);

    $res = $mysql->qry_array($qry);
    $gm->add_object($res);

    return $gm;
}

function set_row($inmsg)
{
    $gm = new JsonResult("ok", $inmsg->cmd,null);
    $login = $inmsg->get_object(0);
    if (!$mysql) $mysql = open_db($login);
    if ($mysql->err) 
    return db_error($inmsg,$mysql->err);

    $tbname = $inmsg->get_object(2);
    $updates = $inmsg->get_object(3);

    $qry = "UPDATE $tbname $updates";
    $res = $mysql->qry_boolean($qry);

    return get_query($inmsg);
}

function ins_row($inmsg)
{
    $gm = new JsonResult("ok", $inmsg->cmd,null);
    $login = $inmsg->get_object(0);
    if (!$mysql) $mysql = open_db($login);
    if ($mysql->err) 
    return db_error($inmsg,$mysql->err);

    $tbname = $inmsg->get_object(2);
    $insertions = $inmsg->get_object(3);

    $qry = "INSERT INTO $tbname $insertions";
    $res = $mysql->qry_boolean($qry);

    return get_query($inmsg);
}

function del_row($inmsg)
{
    $gm = new JsonResult("ok", $inmsg->cmd,null);
    $login = $inmsg->get_object(0);
    if (!$mysql) $mysql = open_db($login);
    if ($mysql->err) 
    return db_error($inmsg,$mysql->err);

    $tbname = $inmsg->get_object(2);
    $keys = $inmsg->get_object(3);

    $qry = "DELETE FROM $tbname $keys";
    $res = $mysql->qry_boolean($qry);

    return get_query($inmsg);
}

if ($json) {
    $jm = new JsonMessage($json);

    // dispatch on cmd
    switch($jm->cmd) {
        case "login":
            $e=login_user($jm,null);
        break;
        case "logout":
            logout();
            $e = new JsonResult("ok", $inmsg->cmd,null);
        break;
        case "check_connection":
            $e=check_connection($jm);
        break;
        case "get_cols":
            $e=get_cols($jm);
        break;
        case "get_rows":
            $e=get_rows($jm);
        break;
        case "get_rowcols":
            $e=get_rowcols($jm);
        break;
        case "get_query":
            $e=get_query($jm);
        break;
        case "get_selection":
            $e=get_selection($jm);
        break;
        case "set_row":
            $e=set_row($jm);
        break;
        case "ins_row":
            $e=ins_row($jm);
        break;
        case "del_row":
            $e=del_row($jm);
        break;
        default:
            echo "unknown json command:".$jm->cmd;
        break;
    }
    $e->put();
} else {
    // AjaxContext examples
    switch ($cmd) {
        default:
            //echo "ask only uses Json messages";
       print_r($_POST);
        break;
    }
}

?>
