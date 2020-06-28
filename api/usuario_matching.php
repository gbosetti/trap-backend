<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
?>
<?php
include('conexion.php');
@$keywords=strtolower($_REQUEST['keywords']);

$res = $mysqli->query("SELECT CONCAT(apellido,', ',nombre, ' (', dni, ')') as name, dni as id
FROM `usuarios` 
WHERE LOWER(apellido) LIKE '%$keywords%' or LOWER(nombre) LIKE '%$keywords%' or dni LIKE '%$keywords%'
ORDER BY apellido ASC
LIMIT 5");
$json_res = array();

while($f = $res->fetch_object()){
    array_push($json_res, $f);
}

echo json_encode($json_res, JSON_UNESCAPED_UNICODE);
?>