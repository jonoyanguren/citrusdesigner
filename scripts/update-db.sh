#!/bin/bash

# Script para actualizar la base de datos con Prisma
# Uso: ./scripts/update-db.sh [env]
# donde [env] puede ser 'dev' o 'prod' (por defecto: 'dev')

ENV=${1:-dev}
echo "Actualizando base de datos para entorno: $ENV"

if [ "$ENV" = "prod" ]; then
  # Usar URL de producción
  DATABASE_URL=$(cat .env.production | grep DATABASE_URL | cut -d '=' -f2- | tr -d '"') npx prisma db push
else
  # Usar URL de desarrollo (por defecto en .env)
  npx prisma db push
fi
