$bytes = [System.IO.File]::ReadAllBytes("c:\Development\Alex_Plug_In\TESTE\Fabio_Correa_resized.jpg")
$b64 = [Convert]::ToBase64String($bytes)
$dataUri = "data:image/jpeg;base64,$b64"
[System.IO.File]::WriteAllText("c:\Development\Alex_Plug_In\TESTE\datauri.txt", $dataUri)
Write-Host "Data URI length: $($dataUri.Length)"
Write-Host "First 50 chars: $($dataUri.Substring(0,50))"
