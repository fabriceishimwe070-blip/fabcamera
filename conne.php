<?php

$host = "localhost";
$user = "root";
$password = "";
$db = "clinic";

$conn = mysqli_connect($host, $user, $password, $db);

if($conn){
    echo "ok";
}
else{
    die("connection failed: " . mysqli_connect_error());
}

?>