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

$registros_como_guardia=($mysqli->query("SELECT count(id) as count FROM `movimientos` WHERE dni_guardia_ingreso='$dni' OR dni_guardia_egreso='$dni'"))->fetch_assoc();
$registros_como_visitante=($mysqli->query("SELECT count(id) as count FROM `movimientos` WHERE dni_usuario='$dni'"))->fetch_assoc();

if ($registros_como_guardia['count'] > 0 || $registros_como_visitante['count'] > 0) {
    
    $sql = "DELETE FROM `usuarios_admins` WHERE dni_usuario='$dni'";
	if ($mysqli->query($sql) === true) {
	  echo json_encode(array('auth' => true, 'token' => $guard_token, 'error' => false, 'message' => 'El usuario ha sido dado de baja como administrador, sin embargo algunos de sus datos se mantuvieron para no perder la integridad de los movimientos registrados.'));
	} else {
	  echo json_encode(array('auth' => true, 'token' => $guard_token, 'error' => true, 'message' => 'Error: ' . $mysqli->error));
	}
}
else{

	$sql = "DELETE FROM `usuarios` WHERE dni='$dni'";
	if ($mysqli->query($sql) === false) {
	  echo json_encode(array('auth' => true, 'token' => $guard_token, 'error' => true, 'message' => 'Error: ' . $mysqli->error));
	  exit();
	}
	
	$sql = "DELETE FROM `usuarios_admins` WHERE dni_usuario='$dni'";
	if ($mysqli->query($sql) === true) {
	  echo json_encode(array('auth' => true, 'token' => $guard_token, 'error' => false, 'message' => 'El usuario ha sido borrado.'));
	} else {
	  echo json_encode(array('auth' => true, 'token' => $guard_token, 'error' => true, 'message' => 'Error: ' . $mysqli->error));
	}
}

$mysqli->close();
?>