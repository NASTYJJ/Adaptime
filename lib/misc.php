<?php
function day_of_month($on)
{
	if ($on) $now=$on;
	else $now=time();

	$now=localtime($now,true);


	return $now['tm_mday'];
}

function start_of_month($on)
{
	if ($on) $now=$on;
	else $now=time();

	$now=localtime($now,true);

	return mktime(0,0,0,$now['tm_mon']+1,1,$now['tm_year']+1900);
}

function end_of_month($on)
{
	if ($on) $now=$on;
	else 
		$now=time();

	$now=localtime($now,true);


	$mon=$now['tm_mon'] + 2;
	$year=$now['tm_year'] + 1900;

	if ($mon>12) { 
		$mon=1;
		$year++;
	}

	return mktime(0,0,0,$mon,1,$year)-1;  // minus a second
}

function last_midnight($on)
{
	if ($on) $now=$on;
	else  
		$now=time();

	$now=localtime($now,true);

	return mktime(0,0,0,$now['tm_mon']+1,$now['tm_mday'],$now['tm_year']+1900);
}

function next_midnight($on)
{
	return last_midnight($on) + 24*3600;
}

//print(next_midnight(0));
//print(start_of_month(0));
//print(end_of_month(0));

?>
