# Configuración para Google Earth Engine con Node.js

Antes de comenzar, asegúrese de tener instalados Node.js, npm y pip en su sistema.

## Comandos a usar

1. Verificar versiones de Node.js y npm:  
node --version  
npm --version

2. Inicializar proyecto Node.js:  
npm init -y

3. Instalar la biblioteca oficial de Earth Engine para Node.js:  
npm install --save @google/earthengine

4. Instalar la API y CLI de Earth Engine (requiere pip):  
pip install earthengine-api

5. Autenticarse con Earth Engine:  
earthengine authenticate

Este último comando abrirá una ventana del navegador para que inicie sesión con su cuenta de Google y autorice el acceso a Earth Engine. Una vez completado, se guardarán las credenciales localmente en ~/.config/earthengine/credentials (en Linux).

Con estos pasos, su entorno estará listo para desarrollar con Google Earth Engine en Node.js y desde la línea de comandos.
