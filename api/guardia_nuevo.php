<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
?>

<?php
include('conexion.php');

@$nombre=utf8_decode($_REQUEST['nombre']);
@$apellido=utf8_decode($_REQUEST['apellido']);
@$dni_usuario=$_REQUEST['dni'];
@$pass=$_REQUEST['password'];

    
if (!$mysqli -> query("INSERT INTO usuarios(`nombre`, `apellido`, `dni`) VALUES ('$nombre','$apellido','$dni_usuario')")) {
    
    if ($mysqli->errno == 1062) {
      echo '{"error": true, "message": "Error: el DNI que intenta registrar ya se encuentra registrado."}'; 
    }
    else {
    	echo '{"error": true, "message": "Error: '.$mysqli -> error.'"}'; 
    }
    exit();
}

if (!$mysqli -> query("INSERT INTO `usuarios_guardias`(`dni_usuario`, `habilitado`, `password`) VALUES ('$dni_usuario',0,'$pass')")) {
    
    echo '{"error": true, "message": "Error: '.$mysqli -> error.'"}'; 
    exit();
}

echo '{"error": false, "message": "Se ha registrado correctamente."}'; 


$mysqli->close();
?>
