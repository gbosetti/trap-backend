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
@$dni_visitante=$_REQUEST['dni_visitante'];
@$dni_guardia_ingreso=$_REQUEST['dni_guardia_ingreso'];
@$temperatura=$_REQUEST['temperatura'];
@$supero_olfativo=$_REQUEST['supero_olfativo'];
@$questions=json_decode($_REQUEST['questions'], true);

if(empty($questions) || $dni_visitante=='undefined' || $dni_guardia_ingreso=='undefined'){
    echo '{"auth": true, "token": "'.$guard_token.'", "error": true, "message": "Error: por favor,complete todos los datos solicitados."}'; 
    exit();
}

$query = "INSERT INTO `movimientos`(`entrada`, `dni_usuario`, `temperatura`, `supero_olfativo`, `dni_guardia_ingreso`, `autorizado`) VALUES (NOW(), '$dni_visitante', $temperatura, $supero_olfativo, '$dni_guardia_ingreso', 0)";
if (!$mysqli -> query($query)) {

    echo '{"auth": true, "token": "'.$guard_token.'", "error": true, "message": "Error: '.$mysqli -> error.'"}'; 
    exit();
}

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
        echo '{"auth": true, "token": "'.$guard_token.'", "error": true, "message": "Error: '.$mysqli -> error.'"}'; 

        $mysqli -> query("DELETE FROM `movimientos` WHERE `id`=$id_movimiento");
        $mysqli -> query("DELETE FROM `movimientos_respuestas` WHERE `id_movimiento`=$id_movimiento");
        exit();
    }
}

echo '{"auth": true, "token": "'.$guard_token.'", "error": false, "message": "Este visitante no ha superado el triage. No debe ingresar a las instalaciones. Se han registrado sus resultados."}'; 
$mysqli->close();
?>
