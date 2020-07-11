<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
?>

<?php
include('conexion.php');

@$dni_visitante=$_REQUEST['dni_visitante'];
@$dni_guardia_egreso=$_REQUEST['dni_guardia_egreso'];
@$facilities=json_decode($_REQUEST['facilities'], true);

if(empty($facilities) || $dni_visitante=='undefined' || $dni_guardia_egreso=='undefined'){
    echo '{"error": true, "message": "Error: por favor,complete todos los datos solicitados."}'; 
    exit();
}

$sql = "SELECT id, salida FROM `movimientos` as all_mov RIGHT JOIN (SELECT MAX(id) as max_id FROM `movimientos` WHERE `dni_usuario`='$dni_visitante') as max_mov ON all_mov.id = max_mov.max_id";
$res=$mysqli -> query($sql);
if (!$res) {

    echo '{"error": true, "message": "Error: '.$mysqli -> error.'"}'; 
    exit();
}
$obj=$res->fetch_object();
$id=$obj->{'id'};
$salida=$obj->{'salida'};

if(!empty($salida)){

    echo '{"error": true, "message": "Error: la ultima entrada del usuario ya tiene registrada una salida. Por favor, registre una nueva entrada antes de registrar esta salida."}'; 
    exit();
}

if (!$mysqli -> query("UPDATE `movimientos` SET `salida`=NOW(),`dni_guardia_egreso`='$dni_guardia_egreso' WHERE id=$id")) {

    echo '{"error": true, "message": "Error: '.$mysqli -> error.'"}'; 
    exit();
}
foreach ($facilities as $id_instalaciones) {
	$sql = "INSERT IGNORE INTO `movimientos_instalaciones`(`id_movimiento`, `id_instalaciones`) VALUES ($id,$id_instalaciones)";
	if (!$mysqli -> query($sql)) {

	    echo '{"error": true, "message": "Error: '.$mysqli -> error.'"}'; 
	    exit();
	}
}

echo '{"error": false, "message": "Checkout exitoso."}'; 

$mysqli->close();
?>
