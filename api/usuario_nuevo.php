<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
?>

<?php
include('conexion.php');

@$nombre=$_REQUEST['nombre'];
@$apellido=$_REQUEST['apellido'];
@$dni=$_REQUEST['dni'];
@$telefono=$_REQUEST['telefono'];
@$codigo_area=$_REQUEST['codigo_area'];

if (!$mysqli -> query("INSERT INTO usuarios(`nombre`, `apellido`, `dni`, `telefono`, `codigo_area`) VALUES ('$nombre','$apellido','$dni','$telefono','$codigo_area')")) {
    
    echo '{"error": true, "message": "Error: '.$mysqli -> error.'"}'; 
    exit();
}
else{

    echo '{"error": false, "message": "El usuario ha sido creado"}'; 
}

$mysqli->close();
?>
