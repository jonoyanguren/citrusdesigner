#!/bin/bash

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]; then
    echo "Error: Faltan parámetros requeridos"
    echo "Uso: npm run create-user:prod -- email@ejemplo.com 'Nombre Usuario' contraseña123 [admin|user]"
    echo "Ejemplo: npm run create-user:prod -- juan@ejemplo.com 'Juan Pérez' 123456 admin"
    exit 1
fi

if [ "$ENV" = "prod" ]; then
    URL="https://citrusdesigner.vercel.app/api/create-user"
    echo "Creando usuario en producción..."
elif [ "$ENV" = "dev" ]; then
    URL="http://localhost:3000/api/create-user"
    echo "Creando usuario en desarrollo..."
else
    echo "Error: Entorno no especificado"
    exit 1
fi

EMAIL=$1
NAME=$2
PASSWORD=$3
ROLE=$4

if [ "$ROLE" != "admin" ] && [ "$ROLE" != "user" ]; then
    echo "Error: Rol inválido. Use 'admin' o 'user'"
    exit 1
fi

echo "Enviando petición a: $URL"
echo "Datos del usuario:"
echo "Email: $EMAIL"
echo "Nombre: $NAME"
echo "Rol: $ROLE"

RESPONSE=$(curl -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"name\": \"$NAME\",
    \"password\": \"$PASSWORD\",
    \"role\": \"$ROLE\",
    \"secretKey\": \"maykatapaycaña\"
  }" -v)

echo "Respuesta del servidor:"
echo "$RESPONSE"

if echo "$RESPONSE" | grep -q "error"; then
    echo "Error al crear el usuario. Verifica la respuesta del servidor."
    exit 1
fi 