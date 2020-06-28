<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
?>

<?php
include('conexion.php');
@$dni=$_REQUEST['dni'];
@$habilitado=$_REQUEST['habilitado'];

$sql="UPDATE `usuarios_guardias` SET `habilitado`=$habilitado WHERE dni_usuario='$dni'";

if ($mysqli->query($sql) === true) {
    
	echo json_encode(array('error' => false, 'message' => 'El estado del usuario ha sido modificado.'));
}
else{
	echo json_encode(array('error' => true, 'message' => 'Error: ' . $mysqli->error));
}

$mysqli->close();
?>