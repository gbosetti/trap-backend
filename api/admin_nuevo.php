<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
?>

<?php
include('conexion.php');

@$nombre=$_REQUEST['nombre'];
@$apellido=$_REQUEST['apellido'];
@$dni_usuario=$_REQUEST['dni'];
@$pass=$_REQUEST['password'];
@$telefono=$_REQUEST['telefono'];
@$codigo_area=$_REQUEST['codigo_area'];
    
$registros=($mysqli->query("SELECT count(*) as count FROM `usuarios` WHERE `dni`=$dni_usuario"))->fetch_assoc();

if ($registros['count'] <= 0 && !$mysqli -> query("INSERT INTO usuarios(`nombre`, `apellido`, `dni`, `telefono`,`codigo_area`) VALUES ('$nombre','$apellido','$dni_usuario', '$telefono', '$codigo_area')")) {
    
    echo '{"error": true, "message": "Error: '.$mysqli -> error.'"}'; 
    exit();
}

if (!$mysqli -> query("INSERT INTO `usuarios_admins`(`dni_usuario`, `habilitado`, `password`) VALUES ('$dni_usuario',0,'$pass')")) {
    
    echo '{"error": true, "message": "Error: '.$mysqli -> error.'"}'; 
    exit();
}

echo '{"error": false, "message": "Se ha registrado correctamente."}'; 


$mysqli->close();
?>
