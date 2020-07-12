<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
?>
<?php 
# Using https://github.com/adhocore/php-jwt
require dirname(__FILE__) . '/php-jwt-master/src/JWTException.php';
require dirname(__FILE__) . '/php-jwt-master/src/ValidatesJWT.php';
require dirname(__FILE__) . '/php-jwt-master/src/JWT.php';
use Ahc\Jwt\JWT;

class JwtAuthenticator {
    function __construct($key="top-secret-phrase", $maxAge=3600) {
        $this->jwt = new JWT($key, 'HS512', $maxAge, 10); //key, algo, maxAge and leeway
        # maxAge: Specifies the maximum elapsed time in seconds since the last time the user was actively authenticated by the authorization server. If the elapsed time is greater than this value, the token is considered invalid and the user must be re-authenticated.
        # leeway: Specifies the number of seconds to account for clock skew when validating time-based claims such as `iat` and `exp`. The default is 60 seconds.
    }

    function generate_token($username) {
        $exp = time() + 1000;
        #echo '<br>'.$exp.'<br>';
        return $this->jwt->encode(['uid' => $username, 'exp' => $exp, 'scopes' => ['user']]);
    }
    
    function decode_token($token) {
        return $this->jwt->decode($token);
    }
    
    function validate($token, $expected_username){
        $res=false;
        try{
            $payload = $this->jwt->decode($token);
            $remote_username = $payload["uid"];
            $remaining_minutes = ($payload["exp"]-time())/60;
            #echo "Time elapsed: ".($oldtime)."<br>";

            $res = ($remote_username==$expected_username) && ($remaining_minutes>0);
        } catch (Exception $e) { 
            #echo 'Caught exception: ',  $e->getMessage(), "\n"; 
        }
        
        return $res;
    }
}
?>