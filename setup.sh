#!/bin/bash

# 1. Actualizar e instalar MariaDB de forma no interactiva
sudo apt-get update
sudo apt-get install -y mariadb-server

# 2. Iniciar el servicio de base de datos
sudo service mariadb start

# 3. Configurar permisos básicos (reemplaza a mysql_secure_installation en automatización)
# Permitimos que el root entre sin password localmente para el script inicial
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED VIA unix_socket;"

# 4. Importar la base de datos (usando la ruta correcta desde la raíz)
# Asumiendo que el script está en la raíz o en backend/config/
if [ -f "backend/config/init.sql" ]; then
    sudo mysql -u root < backend/config/init.sql
    echo "✅ Base de datos inicializada."
else
    echo "⚠️ No se encontró init.sql en backend/config/"
fi

# 5. Configurar Node.js (La imagen base ya trae nvm, instalamos v24)
#nvm install 24
#nvm use 24

# 6. Moverse a backend, instalar dependencias y crear .env
cd backend
npm install express mysql2 cors multer jsonwebtoken bcrypt dotenv
npm update

echo "Creando archivo .env..."
cat <<EOF > .env
PORT=3000
DB_HOST=localhost
DB_USER=bibliotech
DB_PASS=bibliotech
DB_NAME=bibliotech
JWT_SECRET=tu_clave_secreta_super_segura
NODE_ENV=production
EOF

cp .env ../.

echo "🚀 Configuración de entorno completada con éxito."