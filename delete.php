<?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        
        $tabs = json_decode(file_get_contents("files/storage.json"), true);
        
        array_splice($tabs, $_POST["index"], 1);
        $tabs[0] = 1;
        
        $data = json_encode($tabs, JSON_PRETTY_PRINT);
        $storage = fopen("files/storage.json", "w");
        if ($storage) {
            fwrite($storage, $data);
            fclose($storage);
        }
        
        header("Content-Type: application/json");
        print($data);
    }        
?>