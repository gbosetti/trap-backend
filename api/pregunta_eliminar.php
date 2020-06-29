<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
?>

<?php
include('conexion.php');

@$id=$_REQUEST['id'];

$registros=($mysqli->query("SELECT count(*) as count FROM `movimientos_respuestas` WHERE `id_pregunta`=$id"))->fetch_assoc();
if ($registros['count'] > 0) {
	echo json_encode(array('error' => true, 'message' => 'La pregunta indicada no puede ser eliminada ya que existen movimientos registrados en relación a ella.'));
	exit();
}

if (!$mysqli -> query("DELETE FROM `preguntas` WHERE `id`=$id")) {
    
    echo '{"error": true, "message": "Error: '.$mysqli -> error.'"}'; 
    exit();
}

echo '{"error": false, "message": "Se ha eliminado correctamente."}'; 

$mysqli->close();
?>
