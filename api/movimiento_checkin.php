<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
?>

<?php
include('conexion.php');
include('autenticacion.php');

#Authentication
$guard_token=$_REQUEST['guard_token'];
$guard_dni=$_REQUEST['guard_dni'];
if(!$auth->validate($guard_token, $guard_dni)){
    echo '{"error": true, "auth": false}'; 
    exit();
}
$guard_token=$auth->generate_token($guard_dni);

#Params
@$dni_visitante=$_REQUEST['dni_visitante'];
@$dni_guardia_ingreso=$_REQUEST['dni_guardia_ingreso'];
@$temperatura=$_REQUEST['temperatura'];
@$supero_olfativo=$_REQUEST['supero_olfativo'];
@$questions=json_decode($_REQUEST['questions'], true);

#PARA EVITAR OTRO GET
$starting_fever_point=($mysqli->query("SELECT valor FROM `settings` WHERE nombre='starting_fever_point'"))->fetch_assoc()['valor'];

if($temperatura<$starting_fever_point){
    $autorizado=1;
}
else{
    $autorizado=0;
}

#CHECK INPUT
if(empty($questions) || $dni_visitante=='undefined' || $dni_guardia_ingreso=='undefined'){
    echo '{"error": true, "auth": true, "token": "'.$guard_token.'", "message": "Error: por favor,complete todos los datos solicitados."}'; 
    exit();
}

#INSERTAR MOVIMIENTO
$query = "INSERT INTO `movimientos`(`entrada`, `dni_usuario`, `temperatura`, `supero_olfativo`, `dni_guardia_ingreso`, `autorizado`) VALUES (NOW(), '$dni_visitante', $temperatura, $supero_olfativo, '$dni_guardia_ingreso', $autorizado)";
if (!$mysqli -> query($query)) {

    echo '{"error": true, "auth": true, "token": "'.$guard_token.'", "message": "Error: '.$mysqli -> error.'"}'; 
    exit();
}

#INSERTAR RESPUESTAS
$id_movimiento = $mysqli->insert_id;
foreach ($questions as $key=>$question) {
    $id_pregunta=$question['id'];
    if($question['isItemChecked']==$question['target']){
        $superada=1;
    }else {
        $superada=0;
    }
	$sql = "INSERT IGNORE INTO `movimientos_respuestas`(`id_movimiento`, `id_pregunta`, `superada`) VALUES ($id_movimiento,$id_pregunta,$superada)";
	if (!$mysqli -> query($sql)) {
	    echo '{"error": true, "auth": true, "token": "'.$guard_token.'", "message": "Error: '.$mysqli -> error.'"}'; 

        $mysqli -> query("DELETE FROM `movimientos` WHERE `id`=$id_movimiento");
        $mysqli -> query("DELETE FROM `movimientos_respuestas` WHERE `id_movimiento`=$id_movimiento");
	    exit();
	}
}

if($autorizado){
    echo '{"error": false, "auth": true, "token": "'.$guard_token.'", "message": "Check-in exitoso."}'; 
}
else{
    echo '{"error": false, "auth": true, "token": "'.$guard_token.'", "message": "Este visitante no ha superado el triage. No debe ingresar a las instalaciones. Se han registrado sus resultados."}'; 
}

$mysqli->close();
?>
