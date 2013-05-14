<?

include "ajax.php";

$cmd=$_GET['cmd'];
$json=$_GET['json'];

class returnobj
{
    function returnobj($x,$y) 
    {
        $this->x =$x;
        $this->y =$y;
    }
}

$a = new returnobj("a", 11);
$b = new returnobj( 22, "b");

if ($json) {
    $jm = new JsonMessage($json);

    switch($jm->cmd) {
        case "echo":
            $e = new JsonResult("ok","rval",$a);
            $c = $jm->get_object(1);
            $b->x *= $c->num;
            $e->add_object($b);
        break;
        case "multiply":
            $fac1=$_GET['fac1'];
            $fac2=$_GET['fac2'];
            echo $fac1 * $fac2;
        break;
        default:
            echo "unknown command";
        break;
    }
    $e->put();
	
} else {
    // AjaxContext examples
    switch ($cmd) {
        case "multiply":
            $fac1=$_GET['fac1'];
            $fac2=$_GET['fac2'];
            echo $fac1 * $fac2;
        break;
        default:
            echo "unknown command";
        break;
    }
}

?>
