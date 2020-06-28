<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
?>
<?php
include('conexion.php');

$res = $mysqli->query("SELECT usuarios.*, usuarios_guardias.habilitado
FROM `usuarios` 
INNER JOIN usuarios_guardias ON usuarios.dni = usuarios_guardias.dni_usuario
ORDER BY apellido");
$json_res = array();

while($f = $res->fetch_object()){
    array_push($json_res, $f);
}

echo json_encode($json_res, JSON_UNESCAPED_UNICODE);
?>