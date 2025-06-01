<?php

include "conn.php";

$id=$_POST["id"];


$sql = "DELETE FROM products WHERE id_product=$id";


if(mysqli_query($conn, $sql)){
    echo 1;
}else{
    echo 0;
}

//echo $sql;


?>