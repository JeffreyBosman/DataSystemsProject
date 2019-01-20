<?php

$contents = file_get_contents("data/duplicates.js");
file_put_contents('data/duplicates.js', $_POST['data']);
exit;

?>