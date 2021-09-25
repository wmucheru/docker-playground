<?php
    echo '<h4>Docker + PHP + Nginx + MySQL</h4><hr/>';

    $database ="testdb";
    $user = "root";
    $password = "secret";
    $host = "mysql";

    $connection = new PDO("mysql:host=$host;dbname=$database;", $user, $password);
    $query = $connection->query("SELECT * FROM users");
    $users = $query->fetchAll();

    if(empty($users)){
        echo "<p>There are no tables in database \"{$database}\".</p>";
    }
    else{
        echo '<ul>';

        foreach ($users as $user) {
            $user = (object) $user;
            echo "<li>$user->name - $user->email - $user->age</li>";
        }

        echo '</ul>';
    }
?>