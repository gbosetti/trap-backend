<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
?>

<?php
include('conexion.php');

@$nombre=$_REQUEST['nombre'];

if (!$mysqli -> query("INSERT INTO `instalaciones`(`nombre`) VALUES ('$nombre')")) {
    
    if ($mysqli->errno == 1062) {
      echo '{"error": true, "message": "Error: el DNI que intenta registrar ya se encuentra registrado."}'; 
    }
    else {
    	echo '{"error": true, "message": "Error: '.$mysqli -> error.'"}'; 
    }
    exit();
}

echo '{"error": false, "message": "Se ha registrado correctamente."}'; 

$mysqli->close();
?>
