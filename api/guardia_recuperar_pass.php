<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
?>

<?php
echo '{"error": true, "auth": true, "message": "No se ha podido recuperar su email. Por favor, contacte a un administrador."}'; 
/*include('conexion.php');
require 'MailBasedPassRecovery.php';

$dni=$_REQUEST['dni'];

$sql="SELECT email FROM `usuarios_guardias` WHERE dni_usuario='$dni'";
$res=($mysqli->query($sql))->fetch_object();

if ($res->{'email'}) {

	$passRecovery = new MailBasedPassRecovery();
	@$pass=$passRecovery->generateNewPass();
	$res = $passRecovery->sendPassViaMail($dni, $pass, $res->{'email'}, 'usuario');

	$result = mysql_query("UPDATE `m_usuarios` SET `password`='$pass' WHERE dni_usuario=$dni");
	if (!$result) {
	    echo '{"error": true, "auth": true, "message": "'.mysql_error().'"}';
	}
	else{
		echo '{"error": false, "auth": true, "message": "Se ha generado y enviado una nueva clave al email asociado a su cuenta."}';
	}    
}
else{
	echo '{"error": true, "auth": true, "message": "No se ha podido recuperar su email. Por favor, contacte a un administrador."}'; 
}*/
?>
