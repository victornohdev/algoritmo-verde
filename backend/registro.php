<?php
/**
 * RECEPTOR TEMPORAL DEL REGISTRO (maqueta).
 *
 * Valida lo básico en el servidor y muestra lo recibido.
 * NO guarda nada en ninguna base de datos todavía.
 */

// Este recurso solo acepta POST (el formulario de frontend/pages/auth/registro.html)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit('Método no permitido: este recurso solo acepta POST.');
}

$nombre     = trim($_POST['nombre'] ?? '');
$telefono   = trim($_POST['telefono'] ?? '');
$correo     = trim($_POST['correo'] ?? '');
$rol        = $_POST['rol'] ?? '';
$password   = $_POST['password'] ?? '';
$comentario = trim($_POST['comentario'] ?? '');
$acepto     = isset($_POST['acepto']);

// El navegador ya valida, pero el servidor nunca debe confiar en eso.
$roles = ['estudiante' => 'Estudiante', 'docente' => 'Docente', 'personal' => 'Personal del plantel', 'externo' => 'Persona externa'];
$errores = [];

if (mb_strlen($nombre) < 3 || mb_strlen($nombre) > 100)        $errores[] = 'El nombre debe tener entre 3 y 100 caracteres.';
if (!preg_match('/^[0-9 ()+\-]{10,18}$/', $telefono))           $errores[] = 'El teléfono no es válido.';
if (!filter_var($correo, FILTER_VALIDATE_EMAIL))                $errores[] = 'El correo no es válido.';
if (!isset($roles[$rol]))                                       $errores[] = 'Elige una opción válida en "Soy".';
if (mb_strlen($password) < 6)                                   $errores[] = 'La contraseña debe tener al menos 6 caracteres.';
if (mb_strlen($comentario) > 500)                               $errores[] = 'El comentario no puede pasar de 500 caracteres.';
if (!$acepto)                                                   $errores[] = 'Debes aceptar el aviso de privacidad.';

// Todo lo que se imprime se escapa. La contraseña nunca se imprime.
function e(string $texto): string { return htmlspecialchars($texto, ENT_QUOTES, 'UTF-8'); }

if ($errores) http_response_code(400);
?>
<!DOCTYPE html>
<html lang="es-MX">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= $errores ? 'Revisa tus datos' : 'Datos recibidos' ?> | Algoritmo Verde</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #f5f9f6; color: #14231a; display: grid; place-items: center; min-height: 100vh; margin: 0; }
    .caja { background: #fff; border: 1px solid #e2eae5; border-radius: 12px; padding: 32px 36px; max-width: 480px; box-shadow: 0 8px 24px rgba(10,40,20,.08); }
    h1 { margin: 0 0 8px; font-size: 1.4rem; color: #127330; }
    h1.error { color: #c0392b; }
    dl { margin: 18px 0; display: grid; grid-template-columns: auto 1fr; gap: 6px 16px; }
    dt { color: #55655b; }
    dd { margin: 0; font-weight: 600; overflow-wrap: anywhere; }
    a { color: #127330; font-weight: 600; }
    small { color: #55655b; }
  </style>
</head>
<body>
  <div class="caja">
<?php if ($errores): ?>
    <h1 class="error">Revisa tus datos</h1>
    <ul>
<?php foreach ($errores as $error): ?>
      <li><?= e($error) ?></li>
<?php endforeach; ?>
    </ul>
    <p><a href="../frontend/pages/auth/registro.html">&larr; Volver al registro</a></p>
<?php else: ?>
    <h1>Datos recibidos por POST</h1>
    <p>Registro ficticio: el formulario llegó correctamente a <code>backend/registro.php</code>.</p>
    <dl>
      <dt>Nombre</dt><dd><?= e($nombre) ?></dd>
      <dt>Teléfono</dt><dd><?= e($telefono) ?></dd>
      <dt>Correo</dt><dd><?= e($correo) ?></dd>
      <dt>Soy</dt><dd><?= e($roles[$rol]) ?></dd>
      <dt>Contraseña</dt><dd>recibida (no se muestra)</dd>
      <dt>Comentario</dt><dd><?= $comentario === '' ? '—' : nl2br(e($comentario)) ?></dd>
    </dl>
    <p><a href="../frontend/pages/auth/login.html">Ir al login</a> · <a href="../index.html">Inicio</a></p>
    <small>Aún no se guarda ningún usuario.</small>
<?php endif; ?>
  </div>
</body>
</html>
