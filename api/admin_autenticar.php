<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
?>

<?php

include('conexion.php');
include('autenticacion.php');

@$dni=$_REQUEST['dni'];
@$pass=utf8_decode($_REQUEST['password']);
$auth_failed_msg = "Los datos proporcionados no son válidos o el usuario no se encuentra habilitado para operar";
$token=$auth->generate_token($dni);

$sql="SELECT usuarios.*, usuarios_admins.habilitado
FROM usuarios
INNER JOIN usuarios_admins
ON usuarios_admins.dni_usuario = usuarios.dni
WHERE usuarios_admins.dni_usuario = '$dni' and usuarios_admins.password='$pass'";

$matching_user=($mysqli->query($sql))->fetch_object();
if ( $matching_user === NULL ){
    echo '{"error": true, "message": "' . $auth_failed_msg . '" }'; 
	exit();
}

if ($matching_user->{'habilitado'} != 1) {
	echo '{"error": true, "message": "' . $auth_failed_msg . '" }'; 
	exit();
}

if ($matching_user->{'dni'} == $dni) {
    echo '{"error": false, "data": {"token": "'.$token.'", "dni": ' . $matching_user->{'dni'} . ', "apellido": "' . $matching_user->{'apellido'} . '", "nombre": "' . $matching_user->{'nombre'} . '"}}';
}
else{
	echo '{"error": true, "message": "' . $auth_failed_msg . '"}'; 
}
?>
