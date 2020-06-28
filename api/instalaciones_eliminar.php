<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
?>

<?php
include('conexion.php');

@$id=$_REQUEST['id'];

$registros=($mysqli->query("SELECT count(*) as count FROM `movimientos_instalaciones` WHERE `id_instalaciones`='$id'"))->fetch_assoc();
if ($registros['count'] > 0) {
	echo json_encode(array('error' => false, 'message' => 'La unidad indicada no puede ser eliminada ya que existen movimientos registrados en ella.'));
	exit();
}

if (!$mysqli -> query("DELETE FROM `instalaciones` WHERE `id`=$id")) {
    
    echo '{"error": true, "message": "Error: '.$mysqli -> error.'"}'; 
    exit();
}

echo '{"error": false, "message": "Se ha registrado correctamente."}'; 

$mysqli->close();
?>
