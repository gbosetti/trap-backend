<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
Content-Type: application/json

?>
<?php
include('conexion.php');
@$dni=$_REQUEST['dni'];

$res = $mysqli->query("SELECT * FROM `usuarios` WHERE dni = '$dni'");
$user = $res->fetch_object();

echo json_encode($user, JSON_UNESCAPED_UNICODE);
?>