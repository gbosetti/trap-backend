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
@$fromDate=$_REQUEST['fromDate'];
@$toDate=$_REQUEST['toDate'];

$starting_fever_point=($mysqli->query("SELECT valor FROM `settings` WHERE nombre='starting_fever_point'"))->fetch_assoc()['valor'];

$res = $mysqli->query("SELECT *, IF(tmp_supero_preguntas IS NULL,0,tmp_supero_preguntas) AS supero_preguntas FROM (
    
        SELECT * FROM ( 
            SELECT *, IF(movimientos.temperatura<$starting_fever_point,1,0) as supero_temperatura 
            FROM movimientos LEFT JOIN usuarios AS visitantes ON visitantes.dni = movimientos.dni_usuario
        ) AS visitantes
        INNER JOIN (
            SELECT movimientos.id as id_ingreso, CONCAT(usuarios.apellido, ', ', usuarios.nombre) as guardia_ingreso FROM movimientos LEFT JOIN usuarios ON usuarios.dni = movimientos.dni_guardia_ingreso
        ) AS guardias_ingreso ON visitantes.id = guardias_ingreso.id_ingreso
        INNER JOIN (
            SELECT movimientos.id as id_egreso, CONCAT(usuarios.apellido, ', ', usuarios.nombre) as guardia_egreso FROM movimientos LEFT JOIN usuarios ON usuarios.dni = movimientos.dni_guardia_egreso
        ) AS guardias_egreso ON visitantes.id = guardias_egreso.id_egreso
    
) AS movs LEFT JOIN (
    
        SELECT id_movimiento, IF((preguntas_totales-preguntas_superadas)=0, 1, 0) AS tmp_supero_preguntas, preguntas
        FROM(
            SELECT id_movimiento, SUM(movimientos_respuestas.superada) as preguntas_superadas, COUNT(movimientos_respuestas.superada) as preguntas_totales, CONCAT('[', GROUP_CONCAT('{\"id\":', movimientos_respuestas.id_pregunta,', \"value\":\"',preguntas.cuerpo,'\", \"passed\":', movimientos_respuestas.superada, '}'),']') as preguntas

                FROM movimientos_respuestas
                LEFT JOIN preguntas ON preguntas.id = movimientos_respuestas.id_pregunta
                GROUP BY id_movimiento
        ) as preg_superadas
    
) AS pregs ON pregs.id_movimiento = movs.id

LEFT JOIN (
    SELECT movimientos.id, CONCAT('[', GROUP_CONCAT('\"', instalaciones.nombre, '\"'), ']') as instalaciones
    FROM movimientos 
    LEFT JOIN movimientos_instalaciones ON movimientos_instalaciones.id_movimiento = movimientos.id
    LEFT JOIN instalaciones ON movimientos_instalaciones.id_instalaciones = instalaciones.id
    GROUP BY movimientos.id
) AS inst ON inst.id = movs.id

WHERE (movs.autorizado=1) AND (movs.entrada IS NULL OR movs.salida IS NULL) AND (entrada BETWEEN '$fromDate' AND '$toDate' OR salida BETWEEN '$fromDate' AND '$toDate')");
$json_res = array();

while($f = $res->fetch_object()){
    array_push($json_res, $f);
}
echo '{"auth":true, "token":"'.$guard_token.'", "error":false, "data":' . json_encode($json_res, JSON_UNESCAPED_UNICODE) . '}';
?>