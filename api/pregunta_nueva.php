<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
?>

<?php
include('conexion.php');

@$cuerpo=$_REQUEST['cuerpo'];
@$respuesta_esperada=$_REQUEST['respuesta_esperada'];

if (!$mysqli -> query("INSERT INTO `preguntas`(`cuerpo`,`respuesta_esperada`) VALUES ('$cuerpo', '$respuesta_esperada')")) {
    
    echo '{"error": true, "message": "Error: '.$mysqli -> error.'"}'; 
    exit();
}

echo '{"error": false, "message": "Se ha registrado correctamente."}'; 

$mysqli->close();
?>
