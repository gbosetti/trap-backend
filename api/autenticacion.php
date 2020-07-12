<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
?>
<?php 

include('JwtAuthenticator.php');
$auth = new JwtAuthenticator('enterAkeyHERE', 3600);

?>