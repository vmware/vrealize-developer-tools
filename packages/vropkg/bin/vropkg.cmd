@SETLOCAL
@SET PATHEXT=%PATHEXT:;.JS;=;%
node "%~dp0\..\dist\cli.js" %*
