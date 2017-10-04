<?php
/**
 * Created by PhpStorm.
 * User: jukka
 * Date: 07/09/2017
 * Time: 15.08
 */

exec ("/sbin/ifconfig |grep flags |cut -d: -f1|grep -v eth0 |grep -v tun0|grep -v lo", $interfaces);

foreach ($interfaces as &$interface) {

    $ip=[];
    exec ("/sbin/ifconfig ".$interface."|grep inet |grep -v inet6|cut -d\" \" -f10", $ip);

    $ipOctets=explode(".",$ip[0]);
    echo "interface ".$interface." IP = ".$ip[0]."<br>\n";
    echo "<a href=\"http://".$ipOctets[0].".".$ipOctets[1].".".$ipOctets[2].".1\">".$interface." moggula hallinta</a><br>\n";

}