<?php
if (isset($_SERVER['REQUEST_URI'])) {
    $queryString = explode('?', $_SERVER['REQUEST_URI'])[1];
    $path = 'https://apis-dev.berkeley.edu/cxf/asws/course?' . $queryString;
    try {
        $ch = curl_init();
        curl_setopt_array($ch, array(
            CURLOPT_URL => $path,
            CURLOPT_RETURNTRANSFER => true,
            // The key shown has been disabled and is not the one used in prod
            CURLOPT_HTTPHEADER => array('app_id:4fc7196a',
                                        'app_key:24296f1e62d48d91170d4d18ef4b43a5'),
            CURLOPT_CONNECTTIMEOUT => 4,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_SSL_VERIFYPEER => false
        ));
        $output = curl_exec($ch);
        echo $output;
        curl_close($ch);
    } catch (Exception $ex) {
        echo $ex;
    }
} else {

}
