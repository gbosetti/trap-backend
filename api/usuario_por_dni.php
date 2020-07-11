<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
?>
<?php
include('conexion.php');
@$dni=$_REQUEST['dni'];

$res = $mysqli->query("SELECT * FROM `usuarios` WHERE dni = '$dni'");
$user = $res->fetch_object();

echo '{"error":false, "data":' . json_encode($user, JSON_UNESCAPED_UNICODE) . '}';
?>