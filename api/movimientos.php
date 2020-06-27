<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
?>
<?php

include('conexion.php');

$res = $mysqli->query("SELECT * FROM (
    
        SELECT * FROM movimientos 
        INNER JOIN usuarios ON usuarios.dni = movimientos.id_usuario
    
) AS movs 

LEFT JOIN (
    
        SELECT id_movimiento, CONCAT('[', GROUP_CONCAT('{\"id\":', movimientos_respuestas.id_pregunta,', \"value\":\"',preguntas.cuerpo,'\", \"passed\":', movimientos_respuestas.superada, '}'),']') as preguntas

        FROM movimientos_respuestas
        LEFT JOIN preguntas ON preguntas.id = movimientos_respuestas.id_pregunta
        GROUP BY id_movimiento
    
) AS pregs ON pregs.id_movimiento = movs.id

ORDER BY entrada");
$json_res = array();

while($f = $res->fetch_object()){
    array_push($json_res, $f);
}
echo '{"error":false, "data":' . json_encode($json_res, JSON_UNESCAPED_UNICODE) . '}';
?>