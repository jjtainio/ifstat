<?php
/**
 * Created by PhpStorm.
 * User: jukka
 * Date: 07/09/2017
 * Time: 10.49
 */
if(empty($_GET["timespan"]))
{
    $unixtimepast=time()-(5*60);
}
else
{
    switch($_GET["timespan"])
    {
        case 24:
            $unixtimepast=time()-(24*60*60);
            break;

        default:
            $unixtimepast=time()-(60*60);


    }
}
if ($handle = opendir('/tmp/ifstat')) {

    while (false !== ($entry = readdir($handle))) {

        if ($entry != "." && $entry != "..") {

            $fp=fopen("/tmp/ifstat/".$entry, "r");
            $ifnametmp=explode(".",$entry);
            $ifname=$ifnametmp[0];
            $e=0;
            while($line=fgets($fp,1024))
            {
                $tmp=explode("|",$line);
                if($tmp[0]>$unixtimepast)
                    $post_data["ifnames"][$ifname][]=array("timestamp" => $tmp[0],"tx" => trim($tmp[2]), "rx" => trim($tmp[3]));
                $e++;
            }
        }
    }

    closedir($handle);
}

//echo "<pre>";
//print_r($post_data);

$result=json_encode(array('item' => $post_data), JSON_FORCE_OBJECT);

echo $result;