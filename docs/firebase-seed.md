# Firestore seed

El script `npm run seed:firestore` usa Firebase Admin SDK para cargar datos iniciales en Firestore desde una máquina local.

La credencial Admin SDK se usa solo para ejecutar seeds o migraciones locales. No debe subirse al repositorio y no debe subirse al hosting.

En hosting solo se configurarían credenciales admin si en el futuro existe un backend que realmente las necesite. Para el frontend público de Next.js no se debe exponer una clave Admin SDK.

La ruta local de la credencial se configura en `.env.local` con:

```env
GOOGLE_APPLICATION_CREDENTIALS=C:\firebase-credentials\otae-portfolio-firebase-adminsdk-fbsvc-7293750c81.json
```

Cuando se migre a la cuenta Firebase del cliente, se debe generar una nueva clave Admin SDK desde el proyecto Firebase del cliente, guardarla fuera del repo y actualizar esa ruta local en `.env.local`.

No actives Firebase Storage todavía. Storage se configurará después, cuando la cuenta del cliente y su plan lo permitan.
