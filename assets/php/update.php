<?php

include "conn.php";

$id=$_POST["id"];
$product=$_POST["name"];
$desc=$_POST["description"];
$img=$_POST["image"];
$price=$_POST["price"];
    

$sql="UPDATE  products SET product_name='$product', product_desc='$desc',price=$price,img='$img' WHERE id_product=$id";
$query = mysqli_query($conn, $sql);


if ($query)
    
    echo 1;
else
    
    echo 0;


?>