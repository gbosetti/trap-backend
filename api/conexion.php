<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
?>
<?php
# phpinfo();
$mysqli = new mysqli('localhost', 'user', 'pass', 'database'); //TODO: replace
$mysqli->set_charset("utf8");

if ($mysqli -> connect_errno) {
  echo $mysqli -> connect_error;
}
?>