<?php

function insert($username,$address,$region,$city,$country){
    $conn = mysqli_connect("dbserver.in.cs.ucy.ac.cy", "student",
    "gtNgMF8pZyZq6l53") or die("Could not connect: " . mysqli_error($conn));
    echo "Connected succesfully<br/>";
    mysqli_select_db($conn , "epl425") or die ("db will not open" .
    mysqli_error($conn));
    $time = time();
    $query = "INSERT INTO requests (username, timestamp , address , region, city, country) VALUES('$username', '$time' , '$address' , '$region', '$city', '$country')";
    mysqli_query($conn, $query) or die("Invalid query");

}

//insert('itheop02','Gravias','Strovolos','Nicosia','Cyprus');
function get($username){
    $conn = mysqli_connect("dbserver.in.cs.ucy.ac.cy", "student",
    "gtNgMF8pZyZq6l53") or die("Could not connect: " . mysqli_error($conn));
    mysqli_select_db($conn , "epl425") or die ("db will not open" .
    mysqli_error($conn));
    $query = "SELECT * FROM requests WHERE username='$username'";
    $result = mysqli_query($conn, $query) or die("Invalid query");
    $num = mysqli_num_rows($result);
    $retu = array();
    $counter = 0;
    for($i=0; $i<$num; $i++) {
     $row = mysqli_fetch_row($result);
     if( $i >= $num - 5){
        $retu[4-$counter] = $row;
        $counter++;
     }
    }
    //print_r($retu);
    $json_str = json_encode($retu,true);
    echo $json_str;

}

if(strcasecmp($_SERVER['REQUEST_METHOD'], 'GET') == 0) {
    $user = $_GET["userid"];
    if(empty($user))
        http_response_code(400);
    else
        get($user);
}

if(strcasecmp($_SERVER['REQUEST_METHOD'], 'POST') == 0) {
    // Takes raw data from the request body
    $json = trim(file_get_contents('php://input'));
    // Converts it into a PHP object
    $data = json_decode($json);
    insert($data->username,$data->address,$data->region,$data->city,"Cyprus");
}
?>