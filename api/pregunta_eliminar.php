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

$registros=($mysqli->query("SELECT count(*) as count FROM `movimientos_respuestas` WHERE `id_pregunta`=$id"))->fetch_assoc();
if ($registros['count'] > 0) {
	echo json_encode(array('auth' => true, 'token' => $guard_token, 'error' => true, 'message' => 'La pregunta indicada no puede ser eliminada ya que existen movimientos registrados en relación a ella.'));
	exit();
}

if (!$mysqli -> query("DELETE FROM `preguntas` WHERE `id`=$id")) {
    
    echo '{"auth":true, "token":"'.$guard_token.'", "error": true, "message": "Error: '.$mysqli -> error.'"}'; 
    exit();
}

echo '{"auth":true, "token":"'.$guard_token.'", "error": false, "message": "Se ha eliminado correctamente."}'; 

$mysqli->close();
?>
