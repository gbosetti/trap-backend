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
@$nombre=$_REQUEST['nombre'];
@$apellido=$_REQUEST['apellido'];
@$dni=$_REQUEST['dni'];
@$telefono=$_REQUEST['telefono'];
@$codigo_area=$_REQUEST['codigo_area'];

if (!$mysqli -> query("INSERT INTO usuarios(`nombre`, `apellido`, `dni`, `telefono`, `codigo_area`) VALUES ('$nombre','$apellido','$dni','$telefono','$codigo_area')")) {
    
    echo '{"auth": true, "token":"'.$guard_token.'", "error": true, "message": "Error: '.$mysqli -> error.'"}'; 
    exit();
}
else{

    echo '{"auth": true, "token":"'.$guard_token.'", "error": false, "message": "El usuario ha sido creado"}'; 
}

$mysqli->close();
?>
