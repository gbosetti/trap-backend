<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
?>

<?php
include('conexion.php');

@$nombre=$_REQUEST['nombre'];
@$apellido=$_REQUEST['apellido'];
@$dni=$_REQUEST['dni'];

if (!$mysqli -> query("INSERT INTO usuarios(`nombre`, `apellido`, `dni`) VALUES ('$nombre','$apellido','$dni')")) {
    
    echo '{"error": true, "message": "Error: '.$mysqli -> error.'"}'; 
    exit();
}
else{

    echo '{"error": false, "message": "El usuario ha sido creado"}'; 
}

$mysqli->close();
?>
