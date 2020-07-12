<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
?>
<?php
include('conexion.php');

#Authentication
include('autenticacion.php');
$guard_token=$_REQUEST['guard_token'];
$guard_dni=$_REQUEST['guard_dni'];
if(!$auth->validate($guard_token, $guard_dni)){
    echo '{"error": true, "auth": false}'; 
    exit();
}
$guard_token=$auth->generate_token($guard_dni);

#Params
@$dni=$_REQUEST['dni'];

$res = $mysqli->query("SELECT * FROM `usuarios` WHERE dni = '$dni'");
$user = $res->fetch_object();

echo '{"auth":true, "token":"'.$guard_token.'", "error":false, "data":' . json_encode($user, JSON_UNESCAPED_UNICODE) . '}';
?>