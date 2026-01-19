<?php
function uploadFile($file, $folder)
{
    $dir = __DIR__ . "/../uploads/$folder/";
    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
    }

    $filename = uniqid() . "-" . preg_replace("/\s+/", "", $file['name']);
    move_uploaded_file($file['tmp_name'], $dir . $filename);

    return "uploads/$folder/" . $filename;
}
