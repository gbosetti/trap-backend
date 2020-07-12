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
$res = $mysqli->query("SELECT usuarios.*, usuarios_guardias.habilitado
FROM `usuarios` 
INNER JOIN usuarios_guardias ON usuarios.dni = usuarios_guardias.dni_usuario
ORDER BY apellido");
$json_res = array();

while($f = $res->fetch_object()){
    array_push($json_res, $f);
}

echo json_encode(array('error' => false, 'auth' => true, 'token' => $guard_token, 'data' => $json_res));
?>