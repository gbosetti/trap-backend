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
@$dni=$_REQUEST['dni'];
@$habilitado=$_REQUEST['habilitado'];

$sql="UPDATE `usuarios_guardias` SET `habilitado`=$habilitado WHERE dni_usuario='$dni'";

if ($mysqli->query($sql) === true) {
    
	echo json_encode(array('auth' => true, 'token' => $guard_token, 'error' => $guard_token, 'message' => 'El estado del usuario ha sido modificado.'));
}
else{
	echo json_encode(array('auth' => true, 'token' => $guard_token, 'error' => $guard_token, 'message' => 'Error: ' . $mysqli->error));
}

$mysqli->close();
?>