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
@$cuerpo=$_REQUEST['cuerpo'];
@$respuesta_esperada=$_REQUEST['respuesta_esperada'];

if (!$mysqli -> query("INSERT INTO `preguntas`(`cuerpo`,`respuesta_esperada`) VALUES ('$cuerpo', '$respuesta_esperada')")) {
    
    echo '{"auth":true, "token": "'.$guard_token.'","error": true, "message": "Error: '.$mysqli -> error.'"}'; 
    exit();
}

echo '{"auth":true, "token": "'.$guard_token.'","error": false, "message": "Se ha registrado correctamente."}'; 

$mysqli->close();
?>
