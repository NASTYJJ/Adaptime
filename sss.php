<?
	
ini_set("include_path", ".:ask");

session_start();

include "mysql.php";
include "ajax.php";

$cmd=$_GET['cmd'];
$json=$_GET['json'];
if (!$json) {
// askbar uses POST
// feyenoord should also ?
$cmd=$_POST['cmd'];
$json=$_POST['json'];
}

// match sss.h exactly
$SSS_SUBSCRIBE = 1000;
$SSS_SUBSCRIBE_OK = 1001;
$SSS_SUBSCRIBE_FAILED = 1002;
$SSS_UNSUBSCRIBE = 1003;
$SSS_UNSUBSCRIBE_OK = 1004;
$SSS_UNSUBSCRIBE_FAILED = 1005;
$SSS_SEND = 1006;
$SSS_SET_ACTIVE_TOPIC = 1007;
$SSS_SET_ACTIVE_TOPIC_OK = 1008;
$SSS_SET_ACTIVE_TOPIC_FAILED = 1009;

$SSS_SESSION = 1010;
$SSS_SYNC = 1011;
$SSS_ACK = 1012;

$LAST_SSS_MESSAGE_TYPE= 1013;

class SssMessage
{
	function SssMessage($type,$len,$ses,$cnt,$ts,$dta) {
		$this->type     = $type;
		$this->len      = $len;
		$this->session  = $ses;
		$this->counter  = $cnt;
		$this->tstamp   = $ts;
		$this->data     = $dta;
	}

	function unpack($bindata) {
		$fmt = "Nt/Nl/Ns/Nc/Nt";
			
		$header = unpack($fmt, $bindata);
		$this->type     = $header['t'];
		$this->len      = $header['l'];
		$this->len -=12; 	// substract the header size again
		$this->session  = $header['s'];
		$this->counter  = $header['c'];
		$this->tstamp   = $header['t'];
	}

	function recv($sock)
	{
		// header
		$msg= socket_read($sock, 20, PHP_BINARY_READ);
		if (!$msg) return false;
		$this->unpack($msg);
		if ($this->len > 0) {
			$this->data = socket_read($sock, $this->len, PHP_NORMAL_READ);
		}
		return true;
	}

	function pack()
	{
		$fmt = "N5A" . $this->len;
		$this->len += 12;
		$msg = pack($fmt, $this->type, $this->len, $this->session, 
			$this->counter, $this->tstamp, $this->data);
		return $msg;
	}
}

// multiple socket connections are handled in the syncserver
class SyncClient
{

	var $sss_addr = "127.0.0.1";
	var $sss_port = 1742;

	function socket_ist($host)
	{
		$this->sock = socket_create(AF_INET, SOCK_STREAM,SOL_TCP);
		if (!$this->sock) return false;
		$ret = @socket_connect($this->sock, $this->sss_addr, $this->sss_port);
		if (!$ret) return false;
		$ret = socket_select($r = array($this->sock), $w = array($this->sock), $f = array($this->sock), 5);

		if ($ret == 2) return false;
		return true;
	}
	
	// listen is for event messages
	function listen()
	{
		$sm = new SssMessage(0, 0, 0, 0, 0, null);
		if ( ! $sm->recv($this->sock)) 
			return null;
		return $sm;
	}

	// recv is for message you know are coming
	function recv()
	{
		$sm = new SssMessage(0, 0, 0, 0, 0, null);
		if ( ! $sm->recv($this->sock)) 
			return null;
		return $sm;
	}

	function send($sm)
	{
		// combine header and body to ensure contigues send
		$buf = $sm->pack();
		socket_write($this->sock, $buf, $sm->len+8);
	}

	function ack($sm)
	{
		global $SSS_ACK;
		$sm = new SssMessage($SSS_ACK, 0, $sm->session, $sm->counter, 0, null);
		$this->send($sm);
	}
}

// this is always a one-shot connection, so that means always subscribe
// only this one is used when you need a real new session, returns session
function subscribe($inmsg)
{
	global $SSS_SESSION;

    $gm = new JsonResult("ok", $inmsg->cmd,null);
	$sc = new SyncClient();

	if ( !$sc->socket_ist("colatic")){
		$gm = new JsonResult("error", "socket", "socket problem");
		return $gm;
	}
	
	$sm = $inmsg->get_object(0);
	$topic = $sm->data;
	$sid = $sm->sid;
	$count= $sm->counter;
	$sm = new SssMessage($SSS_SESSION, strlen($topic), $sid, $counter, 0, $topic);
	$sc->send($sm);
	$res = $sc->recv();
	$gm->add_object($res);
    return $gm;
}

function unsubscribe($inmsg)
{
	global $SSS_SESSION;
	global $SSS_UNSUBSCRIBE;

    $gm = new JsonResult("ok", $inmsg->cmd,null);
	$sc = new SyncClient();

	if ( !$sc->socket_ist("colatic")){
		$gm = new JsonResult("error", "socket", "socket problem");
		return $gm;
	}
	
	$sid = $inmsg->get_object(0);
	$sm = new SssMessage($SSS_UNSUBSCRIBE, strlen($topic), 
			$sid, 0, 0, $topic);
	$sc->send($sm);
	$res = $sc->recv();
	$gm->add_object($res);
    return $gm;
}

function listen($inmsg)
{
	global $SSS_ACK;

    $gm = new JsonResult("ok", $inmsg->cmd,null);
	$sc = new SyncClient();

	if ( !$sc->socket_ist("colatic")){
		$gm = new JsonResult("error", "socket", "socket problem");
		return $gm;
	}
	
	$ms = $inmsg->get_object(0);
	// just ack the sid, server will drain the message queue
	$sm = new SssMessage($SSS_ACK, 0, $ms->session, $ms->counter, $ms->timestamp, null);
	$sc->send($sm);
	$res = $sc->recv();
	//$res = $sc->listen();
	$sc->ack($res);

	$gm->add_object($res);
    return $gm;
}

if ($json) {
    $jm = new JsonMessage($json);

    // dispatch on cmd
    switch($jm->cmd) {
        case "subscribe":
            $e=subscribe($jm);
        break;
        case "unsubscribe":
            $e=unsubscribe($jm);
        break;
        case "listen":
            $e=listen($jm);
        break;
        case "subscribe":
            $e=subscribe($jm);
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
