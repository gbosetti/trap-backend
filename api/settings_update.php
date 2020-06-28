<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
?>
<?php
include('conexion.php');

@$settings=json_decode($_REQUEST['settings'], true);

foreach ($settings as $index => $cog ) {
    $val = $cog['valor'];
    $nombre = $cog['nombre'];
    $mysqli->query("UPDATE `settings` SET `valor`='$val' WHERE `nombre`='$nombre'");
};

echo '{"error": false, "message": "Se han registrado los cambios."}'; 
?>