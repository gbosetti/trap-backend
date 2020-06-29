<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
?>

<?php
include('conexion.php');

@$id=$_REQUEST['id'];
@$cuerpo=utf8_decode($_REQUEST['cuerpo']);
@$respuesta_esperada=utf8_decode($_REQUEST['respuesta_esperada']);

if (!$mysqli -> query("UPDATE `preguntas` SET `cuerpo`='$cuerpo', `respuesta_esperada`='$respuesta_esperada' WHERE `id`=$id")) {
    
    echo '{"error": true, "message": "Error: '.$mysqli -> error.'"}'; 
    exit();
}

echo '{"error": false, "message": "Se ha actualizado correctamente."}'; 

$mysqli->close();
?>
