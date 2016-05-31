<?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        
        // get the json files
        $tabs = json_decode(file_get_contents("files/storage.json"), true);
        
        
        if (filter_input(INPUT_POST, "new-index", FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]])) {
            
            //delete the old entry
            if (filter_input(INPUT_POST, "index", FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]])) {
                array_splice($tabs, $_POST["index"], 1);
            }
            
            // insert the new one
            $len = count($tabs);
            $index = $_POST["new-index"] > $len ? $len : $_POST["new-index"];
            $title = $_POST["title"] ? $_POST["title"] : "Tab" . $index;
            array_splice($tabs, $index, 0, [["title" => $title, "content" => $_POST["content"]]]);
            
            // indicate which tab to load the content of
            $tabs[0] = $index;
            
            // encode and write to jsom file from scratch
            $data = json_encode($tabs, JSON_PRETTY_PRINT);
            $storage = fopen("files/storage.json", "w");
            if ($storage) {
                fwrite($storage, $data);
                fclose($storage);
            }
            
            // send the data back
            header("Content-Type: application/json");
            print($data);
            
        } else {
            $tabs[0] = $_POST["index"];
            header("Content-Type: application/json");
            print(json_encode($tabs, JSON_PRETTY_PRINT));             
        }
    }    
?>