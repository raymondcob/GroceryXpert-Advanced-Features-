<?php

include "conn.php";

$product=$_POST["name"];
$desc=$_POST["description"];
$price=$_POST["price"];
$img=$_POST["image"];




$sql = "INSERT INTO products(product_name,product_desc,price,img) VALUES('$product','$desc',$price,'$img')";
$query = mysqli_query($conn, $sql);

if($query){
    echo 1;
}else{
    echo 0;
}

//echo $sql;


?>