<?php
/**
 * Created by PhpStorm.
 * User: jukka
 * Date: 07/09/2017
 * Time: 18.23
 *
 *
You may want to try setting the CURLOPT_INTERFACE option:

curl_setopt($curlh, CURLOPT_INTERFACE, "xxx.xxx.xxx.xxx");
CURLOPT_INTERFACE: The name of the outgoing network interface to use. This can be an interface name, an IP address or a host name.
From: php Manual: curl_setopt
 *
 */


$url="http://192.168.225.1/goform/getWanInfo?rand=".rand(100,109843234);
$url2="http://192.168.225.1/goform/getImgInfo?rand=".rand(100,109843234);

function get_web_page( $url )
{
    $user_agent='Mozilla/5.0 (Windows NT 6.1; rv:8.0) Gecko/20100101 Firefox/8.0';

    $options = array(

        CURLOPT_CUSTOMREQUEST  =>"GET",        //set request type post or get
        CURLOPT_POST           =>false,        //set to GET
        CURLOPT_USERAGENT      => $user_agent, //set user agent
        CURLOPT_COOKIEFILE     =>"cookie.txt", //set cookie file
        CURLOPT_COOKIEJAR      =>"cookie.txt", //set cookie jar
        CURLOPT_RETURNTRANSFER => true,     // return web page
        CURLOPT_HEADER         => false,    // don't return headers
        CURLOPT_FOLLOWLOCATION => true,     // follow redirects
        CURLOPT_ENCODING       => "",       // handle all encodings
        CURLOPT_AUTOREFERER    => true,     // set referer on redirect
        CURLOPT_CONNECTTIMEOUT => 120,      // timeout on connect
        CURLOPT_TIMEOUT        => 120,      // timeout on response
        CURLOPT_MAXREDIRS      => 10,       // stop after 10 redirects
    );

    $ch      = curl_init( $url );
    curl_setopt_array( $ch, $options );
    $content = curl_exec( $ch );
    $err     = curl_errno( $ch );
    $errmsg  = curl_error( $ch );
    $header  = curl_getinfo( $ch );
    curl_close( $ch );

    $header['errno']   = $err;
    $header['errmsg']  = $errmsg;
    $header['content'] = $content;
    return $header;
}
if(empty($_GET["type"])) {
    $result = get_web_page($url);

}
else {
    $result = get_web_page($url2);
}

echo $result["content"];