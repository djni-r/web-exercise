<?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {

        $tabs = json_decode(file_get_contents("files/storage.json"), true);
        
        $index = filter_input(INPUT_POST, "index", FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]]);
        if ($index) {        
            
            $len = count($tabs); 
            $index = $index > $len ? $len : $index;
            $title = $_POST["title"] ? $_POST["title"] : "Tab" . $index;
            array_splice($tabs, $index, 0, [["title" => $title, "content" => $_POST["content"]]]);
            $tabs[0] = $index;

            $data = json_encode($tabs, JSON_PRETTY_PRINT);
    
            $storage = fopen("files/storage.json", "w");
            if ($storage) {
                fwrite($storage, $data);
                fclose($storage);
            };
        
            header("Content-Type: application/json");
            print($data);
        } else {
            $tabs[0] = 1;
            header("Content-Type: application/json");
            print(json_encode($tabs, JSON_PRETTY_PRINT));            
        }
    }
?>