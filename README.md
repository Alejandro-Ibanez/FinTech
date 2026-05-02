# FinTech Loan Simulator

## Descripción

Esta solución incluye un backend en .NET 10 y un frontend en React + Vite para simular, solicitar y administrar préstamos con cálculo de cuotas y cronograma de pagos. El backend ofrece una API REST con Swagger y lógica financiera para préstamos de tipo francés (cuota fija) y alemán (capital decreciente). El frontend consume esa API para mostrar simulaciones, solicitudes y resultados.

## Links de despliegue

- Frontend URL: `https://carefree-mercy-production.up.railway.app` (local: `http://localhost:5173` si se inicia con Vite)
- Backend URL (Swagger): `https://fintech-production-2a82.up.railway.app` (local: `http://localhost:8080/swagger/index.html`)
- Credenciales de prueba: no se requiere autenticación para las rutas actuales. El API usa parámetros de `userId` en las solicitudes para filtrar préstamos.

## Tecnologías utilizadas

### Stack del proyecto

- Backend: .NET 10, ASP.NET Core, Entity Framework Core, PostgreSQL
- Frontend: React 19, Vite, TypeScript, Tailwind CSS
- Comunicación: Axios, JSON REST API

### Librerías principales

- Backend:
  - `Microsoft.EntityFrameworkCore` / `Npgsql.EntityFrameworkCore.PostgreSQL`
  - `Swashbuckle.AspNetCore` (Swagger)
- Frontend:
  - `react`, `react-dom`
  - `react-router-dom`
  - `react-hook-form`
  - `zod`
  - `axios`
  - `tailwindcss`

### Decisiones técnicas importantes

- Se adoptó un patrón `Factory` para encapsular la creación de préstamos y cronogramas de pago. Esto mantiene el servicio enfocado en validaciones, reglas de negocio y persistencia.
- Se usa el patrón `Strategy` para separar los cálculos de intereses entre dos métodos: `FrenchInterestStrategy` para préstamos de cuota fija y `GermanInterestStrategy` para préstamos de capital decreciente.
- El backend expone Swagger para facilitar pruebas y documentación de la API.
- El frontend usa Vite para un arranque rápido y carga de desarrollo ligera.

## Instalación local

### Prerrequisitos

- .NET 10 SDK
- Node.js 22+
- PostgreSQL 16+

### Backend

```bash
cd backend\FinTech.API
dotnet restore
# Configurar el connection string en appsettings.json o en variables de entorno
dotnet ef database update
dotnet run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Variables de entorno

### Backend (`appsettings.json` o variables de entorno)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=FinTechDb;Username=postgres;Password=tu_password"
  }
}
```

O usar variable de entorno en el sistema con el mismo connection string y configurar `DefaultConnection` en `appsettings.json`.

### Frontend (`.env.local`)

```env
VITE_API_URL=http://localhost:8080/api
```

> Nota: el frontend usa `import.meta.env.VITE_API_URL` desde `src/lib/api.ts`.

## Testing

```bash
cd backend\FinTech.Tests
dotnet test
```

## Arquitectura

La solución está organizada en dos carpetas principales:

- `backend/FinTech.API`
  - `Controllers/`: define los endpoints HTTP para préstamos y transacciones.
  - `Services/`: contiene la lógica de negocio y reglas de validación.
  - `Repositories/`: acceso a datos y persistencia.
  - `Factories/`: construcción de entidades de préstamo con reglas de cálculo.
  - `Models/`: entidades del dominio y enums.
  - `DTOs/`: objetos de transferencia usados por la API.
  - `Data/`: contexto de Entity Framework y migraciones.
- `frontend/`
  - `src/components`: componentes UI reutilizables.
  - `src/pages`: pantallas principales.
  - `src/services`: wrappers de API.
  - `src/lib/api.ts`: configuración de Axios y base URL.
  - `src/types`: tipado TypeScript.

### Patrones implementados

- `Factory`: `LoanFactory` construye los préstamos y sus cronogramas de pago según el tipo de préstamo.
- `Strategy`: `IInterestRateStrategy` permite intercambiar fácilmente el algoritmo de cálculo de intereses entre `FrenchInterestStrategy` y `GermanInterestStrategy`.
- `Repository`: capas de acceso a datos para mantener el servicio desacoplado de EF Core.

### Diagrama simple

```
[Controller] -> [Service] -> [Factory] -> [Strategy]
                         \-> [Repository] -> [DbContext]
```

## Decisiones de diseño

- Se eligió `Factory` para centralizar la creación de préstamos complejos y evitar duplicación de lógica en varios servicios.
- Se eligió `Strategy` porque el cálculo de tasas e intereses cambia según el tipo de préstamo. Esto permite agregar nuevos métodos de amortización sin modificar la fábrica o el servicio principal.
- Se simplificó la autenticación / autorización ya que la solución actual no requiere login; esto permite concentrarse en la lógica del préstamo y la UX.
- Se definió un límite de hasta 3 préstamos activos y regla de compromiso del 40% del ingreso mensual para validar solicitudes, en lugar de implementar un sistema de scoring completo.

## Supuestos y limitaciones

### Funcionalidades no implementadas

- No hay autenticación de usuarios ni gestión de sesiones.
- No hay interfaz administrativa ni panel de control para aprobar/rechazar préstamos más allá de los endpoints.
- No se incluyen notificaciones por correo ni reportes avanzados.
- No se valida el formato de `userId` más allá de su uso como filtro.

### Simplificaciones realizadas

- La lógica de scoring se basa en reglas estáticas simples (monto < 10000 y menos de 2 préstamos activos).
- Se asume que todas las transacciones con un `IdempotencyKey` repetido son idénticas y retornan la misma transacción existente.
- La simulación y la creación de préstamos comparten la misma configuración de cálculos, pero la creación valida adicionalmente el máximo compromiso de ingresos y la cantidad de préstamos activos.

### Mejoras futuras

- Agregar autenticación/usuarios reales y autorización por rol.
- Exponer más reportes de estados de préstamos y transacciones.
- Añadir validación avanzada de datos en el frontend con Zod en todos los formularios.
- Implementar pruebas de integración para el frontend y cobertura de extremo a extremo.
- Permitir múltiples métodos de pago y manejo de pagos parciales.
