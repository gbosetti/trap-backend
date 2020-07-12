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
@$id=$_REQUEST['id'];

$registros=($mysqli->query("SELECT count(*) as count FROM `movimientos_instalaciones` WHERE `id_instalaciones`=$id"))->fetch_assoc();
if ($registros['count'] > 0) {
	echo json_encode(array('auth' => true, 'token' => $guard_token, 'error' => true, 'message' => 'La unidad indicada no puede ser eliminada ya que existen movimientos registrados en ella.'));
	exit();
}

if (!$mysqli -> query("DELETE FROM `instalaciones` WHERE `id`=$id")) {
    
    echo '{"auth":true, "token": "'.$guard_token.'", "error": true, "message": "Error: '.$mysqli -> error.'"}'; 
    exit();
}

echo '{"auth":true, "token": "'.$guard_token.'", "error": false, "message": "Se ha registrado correctamente."}'; 

$mysqli->close();
?>
