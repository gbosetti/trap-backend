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
@$settings=json_decode($_REQUEST['settings'], true);

foreach ($settings as $index => $cog ) {
    $val = $cog['valor'];
    $nombre = $cog['nombre'];
    $mysqli->query("UPDATE `settings` SET `valor`='$val' WHERE `nombre`='$nombre'");
};

echo '{"auth":true, "token": "'.$guard_token.'", "error": false, "message": "Se han registrado los cambios."}'; 
?>