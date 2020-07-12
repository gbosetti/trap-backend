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

@$dni_visitante=$_REQUEST['dni'];

$sql = "SELECT id, salida FROM `movimientos` as all_mov RIGHT JOIN (SELECT MAX(id) as max_id FROM `movimientos` WHERE `dni_usuario`='$dni_visitante' AND `autorizado`=1) as max_mov ON all_mov.id = max_mov.max_id";
$res=$mysqli -> query($sql);
if (!$res) {

    echo '{"token":"'.$guard_token.'", "auth": true, "error": true, "message": "Error: '.$mysqli -> error.'"}'; 
    exit();
}
$obj=$res->fetch_object();
$id=$obj->{'id'};
$salida=$obj->{'salida'};

if(!empty($salida)){

    echo '{"token":"'.$guard_token.'", "auth": true, "error": true, "message": "Error: la ultima entrada del usuario ya tiene registrada una salida. Por favor, registre una nueva entrada antes de registrar esta salida."}'; 
}
else{
    echo '{"token":"'.$guard_token.'", "auth": true, "error": false, "message": "La ultima entrada del usuario aun no tiene registrada una salida"}'; 
}

$mysqli->close();
?>
