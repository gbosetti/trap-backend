<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
?>
<?php

include('conexion.php');

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

ORDER BY entrada");
$json_res = array();

while($f = $res->fetch_object()){
    array_push($json_res, $f);
}
echo '{"error":false, "data":' . json_encode($json_res, JSON_UNESCAPED_UNICODE) . '}';
?>