<?php
$base = new PDO('sqlite:todo.db');
$sql = $base->prepare("INSERT INTO ThisTable (content, priority) VALUES ('lolololol', 1);");
$sql->execute();
$base = null;
?>