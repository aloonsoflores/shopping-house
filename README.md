# 🛒 Shared Shopping List App

Aplicación móvil **React Native + Supabase** para crear y compartir listas de la compra entre todos los miembros de una casa.
Permite a familiares, amigos o compañeros añadir y gestionar artículos en tiempo real.

---

## 🚀 Características (MVP)

* Registro e inicio de sesión con **email + contraseña** (Supabase Auth).
* Creación de una **casa/grupo** con código de invitación único.
* Posibilidad de **unirse a una casa existente** mediante código.
* Gestión básica de lista compartida (pendiente en siguientes pasos).
* Funciona en **Android e iOS**.

---

## 🛠️ Tecnologías

* [React Native](https://reactnative.dev/)
* [Expo](https://expo.dev/) (si se usa)
* [Supabase](https://supabase.com/) (Auth + Base de datos en Postgres)
* Context API para manejo de autenticación
* TypeScript

---

## 📂 Estructura del proyecto

```
.
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── screens/
│   │   ├── HouseSetupScreen.tsx
│   │   └── SharedList.tsx
│   ├── supabase.ts
│   └── App.tsx
├── package.json
└── README.md
```

---

## ⚙️ Instalación y ejecución

1. **Clonar repositorio**

   ```bash
   git clone https://github.com/usuario/shared-shopping-list.git
   cd shared-shopping-list
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configurar Supabase**

   * Crear un proyecto en [Supabase](https://supabase.com/).
   * Copiar el `project URL` y la `anon public key`.
   * Editar `supabase.ts` en el proyecto:

     ```ts
     import { createClient } from '@supabase/supabase-js';

     const SUPABASE_URL = "https://xxxx.supabase.co";
     const SUPABASE_ANON_KEY = "tu-clave-anon-publica";

     export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
     ```

4. **Lanzar la app**

   ```bash
   npx expo start
   ```

---

## 🗄️ Tablas principales en Supabase

### `houses`

| Columna     | Tipo        | Notas                  |
| ----------- | ----------- | ---------------------- |
| id          | uuid        | PK, autogenerado       |
| name        | text        | Nombre de la casa      |
| invite_code | text        | Código único de acceso |
| created_at  | timestamptz | por defecto `now()`    |

### `house_members`

| Columna    | Tipo        | Notas                          |
| ---------- | ----------- | ------------------------------ |
| id         | uuid        | PK, autogenerado               |
| house_id   | uuid        | FK a `houses(id)`              |
| user_id    | uuid        | FK a usuarios de Supabase Auth |
| created_at | timestamptz | por defecto `now()`            |

> 🔑 Constraint única recomendada:
>
> ```sql
> ALTER TABLE house_members
> ADD CONSTRAINT house_members_unique UNIQUE (house_id, user_id);
> ```

---

## 🛣️ Próximos pasos (roadmap)

* ✅ Autenticación con email/contraseña
* ✅ Crear/join houses con código
* ⬜ Lista de la compra compartida (CRUD de items)
* ⬜ Sincronización en tiempo real (Supabase Realtime)
* ⬜ Roles y permisos por usuario
* ⬜ UI mejorada con diseño Material/Minimalista
* ⬜ Notificaciones push

---

## 📜 Licencia

MIT License
