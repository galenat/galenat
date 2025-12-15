<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {

  $nombre   = $_POST["nombre"];
  $email    = $_POST["email"];
  $telefono = $_POST["telefono"];
  $m1       = $_POST["mensaje1"];
  $m2       = $_POST["mensaje2"];

  $para = "galenat@galenat.com"; // TU CORREO
  $asunto = "Formulario contacto galenat.com";

  $mensaje = "
Nombre: $nombre
Email: $email
Teléfono: $telefono

Cómo nos conociste:
$m1

Más info:
$m2
";

  $headers = "From: Galenat <galenat@galenat.com>";

  mail($para, $asunto, $mensaje, $headers);

  header("Location: https://galenat.com");
exit;
}
