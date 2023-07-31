# filmflix-tecnical-test

El proyecto es una aplicación web backend para gestionar y mostrar una colección de películas. Permite a los usuarios registrados explorar películas, ver detalles de cada una, dar likes a sus favoritas y también, a los usuarios con rol de administrador, agregar nuevas películas a la colección. La aplicación cuenta con una funcionalidad de paginación y filtrado para facilitar la navegación y búsqueda de películas. Además, las imágenes de las películas se almacenan en Firebase Storage para su acceso rápido y eficiente.

## Instalación

1. Clona este repositorio en tu máquina local.
2. Instala las dependencias usando el siguiente comando:


```
$ npm install
```


## Scripts

- `npm run build`: Genera una versión de producción del proyecto mediante Babel.
- `npm run dev`: Inicia el servidor en modo de desarrollo.
- `npm run start`: Inicia el servidor en modo de producción (asegúrate de haber hecho 'npm run build' antes).

## Configuración

En el archivo `.env`, puedes configurar ciertas variables para ajustar el comportamiento del proyecto.

### Firebase Authentication

Para habilitar la autenticación con Firebase, necesitas un archivo de configuración `firebase.json` que contiene las credenciales de servicio de tu proyecto en Firebase. Asegúrate de tener este archivo y colócalo en la raíz del proyecto antes de ejecutar la aplicación.

El contenido de `firebase.json` debe tener una estructura similar a esta:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
  "client_email": "your-client-email@your-project-id.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-client-email%40your-project-id.iam.gserviceaccount.com"
}
```
### Firebase Storage

Para configurar el almacenamiento de Firebase, necesitas agregar la variable `FIREBASE_STORAGE_BUCKET` al archivo `.env` en la raíz del proyecto. Asegúrate de tener esta variable de entorno configurada con el valor del bucket de almacenamiento de Firebase.

Contenido del archivo `.env`:

```
FIREBASE_STORAGE_BUCKET=nombre-del-bucket
```

Reemplaza `nombre-del-bucket` con el nombre del bucket que estés utilizando en Firebase Storage.

## Despliegue en Producción

Para desplegar la aplicación en producción, sigue estos pasos:

1. Asegúrate de haber realizado el proceso de construcción para producción mediante el comando:

```
npm run build
```

2. Instala `pm2` de forma global en el servidor (si aún no lo has hecho):

```
npm install pm2 -g
```


3. Copia el archivo `ecosystem.config.js` a tu servidor.

4. En el directorio del proyecto en el servidor, ejecuta el siguiente comando para iniciar la aplicación con `pm2`:

```
pm2 start ecosystem.config.js
```


Con estos pasos, tu aplicación debería estar en funcionamiento en modo de producción en el servidor.

