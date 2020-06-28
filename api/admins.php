<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
?>
<?php
include('conexion.php');

$res = $mysqli->query("SELECT usuarios.*, usuarios_admins.habilitado
FROM `usuarios` 
INNER JOIN usuarios_admins ON usuarios.dni = usuarios_admins.dni_usuario
ORDER BY apellido");
$json_res = array();

while($f = $res->fetch_object()){
    array_push($json_res, $f);
}

echo json_encode($json_res, JSON_UNESCAPED_UNICODE);
?>