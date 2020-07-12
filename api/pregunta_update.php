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
@$id=$_REQUEST['id'];
@$cuerpo=utf8_decode($_REQUEST['cuerpo']);
@$respuesta_esperada=utf8_decode($_REQUEST['respuesta_esperada']);

if (!$mysqli -> query("UPDATE `preguntas` SET `cuerpo`='$cuerpo', `respuesta_esperada`='$respuesta_esperada' WHERE `id`=$id")) {
    
    echo '{"auth": true, "token": "'.$guard_token.'", "error": true, "message": "Error: '.$mysqli -> error.'"}'; 
    exit();
}

echo '{"auth": true, "token": "'.$guard_token.'", "error": false, "message": "Se ha actualizado correctamente."}'; 

$mysqli->close();
?>
