<?php

ini_set("include_path", ".:feyenoord:flib:feyenoord/flib");
require_once('JSON.php');

class JsonResult
{
    var $cmd;
    var $stat="ok";
    var $payload = Array();

    function JsonResult($stat,$cmd,$txt)
    {
        $this->stat = $stat;
        $this->cmd = $cmd;
        if ($txt)
            $this->add_object($txt);
    }

    function set_object($pos,$msg) {
        $this->payload[$pos]=$msg;
    }

    function add_object($msg) {
        array_push($this->payload, $msg);
    }

    function put()
    {
		// the native functions don't handle accents very well 
        //if (function_exists('json_encode')) {
            //$omsg = json_encode($this);
        //} else {
		$json = new Services_JSON();
            $omsg = $json->encode($this);
        //}	
        echo $omsg;
    }
}

class JsonMessage
{
    var $cmd;
    var $payload = Array();

    function JsonMessage($qry)
    {
        $qry = stripcslashes($qry);
		// the native functions don't handle accents very well 
		// leave this here as a warning !!
        //if (function_exists('json_decode')) {
    		$qry = str_replace("\r\n", "\n", $qry);
    		$qry = str_replace("\r", "\n", $qry);
	
    		// JSON requires new line characters to be escaped
    		$qry = str_replace("\n", "\\n", $qry);
    		// dzjees, \' cannot be parsed, just make it a '
   			$qry = str_replace("\'", "'", $qry);

            $inmsg = json_decode($qry);
        //} else {
			//$json = new Services_JSON();
            //$inmsg = $json->decode($qry);
        //}
        $this->cmd = $inmsg->cmd;
        $this->payload = $inmsg->payload;
    }

    function get_object($n) {
        return $this->payload[$n];
    }

    function get_object_count() {
        return count($this->payload);
    }
}

function error_message($msg)
{
    $em = new JsonResult("error", "error", $msg);
    return $em;
}

?>
