# Auditoría Completa del Sistema Full Stack

## Contexto del Proyecto

Este es un sistema full stack que actualmente presenta problemas con varios endpoints en el frontend. Necesitamos una revisión exhaustiva del repositorio para identificar y solucionar todos los errores.

## Tu Misión

Realizar una auditoría completa del código para diagnosticar y resolver problemas de conectividad entre frontend y backend, endpoints fallidos, y cualquier error que esté afectando la funcionalidad del sistema.

## Proceso de Auditoría

### 1. Mapeo de la Arquitectura
- Identifica la estructura del proyecto (frontend/backend/monorepo)
- Localiza archivos de configuración (package.json, tsconfig.json, .env.example, docker-compose.yml)
- Mapea la arquitectura de carpetas y convenciones de naming
- Identifica el framework/tecnologías usadas (React, Next.js, Express, NestJS, etc.)

### 2. Análisis del Backend
- **Endpoints**: Lista TODOS los endpoints definidos en el backend
  - Rutas (GET, POST, PUT, DELETE, PATCH)
  - Controllers/handlers asociados
  - Middleware aplicado
  - Validaciones y schemas
- **Configuración**:
  - Variables de entorno requeridas
  - Configuración de CORS
  - Puerto del servidor
  - Base URLs y prefijos
- **Base de datos**:
  - Modelos/schemas definidos
  - Migraciones pendientes
  - Conexión a la BD

### 3. Análisis del Frontend
- **Llamadas API**: Identifica TODAS las llamadas al backend
  - Archivos de servicios/API clients
  - Hooks personalizados que hacen fetch
  - Componentes que hacen llamadas directas
- **Configuración**:
  - Variables de entorno para API URL
  - Configuración de axios/fetch
  - Interceptores y middleware
- **URLs hardcodeadas**: Busca cualquier URL hardcodeada que pueda estar apuntando a lugares incorrectos

### 4. Verificación de Concordancia

Crea una tabla de concordancia endpoint por endpoint:

| Endpoint Backend | Método | Frontend Llama a | Método | URL Usada | Estado | Problema Detectado |
|-----------------|--------|------------------|--------|-----------|--------|-------------------|
| /api/users | GET | ✅ | GET | /api/users | ⚠️ | CORS no configurado |
| /api/auth/login | POST | ❌ | - | - | ❌ | No hay llamada en frontend |

### 5. Problemas Comunes a Verificar

#### Configuración
- [ ] Variables de entorno no definidas o incorrectas
- [ ] CORS mal configurado (origins, methods, headers)
- [ ] Puertos incorrectos
- [ ] Base URL del API mal configurada
- [ ] Proxy no configurado (en desarrollo)

#### Rutas y URLs
- [ ] Discrepancia en naming de rutas (backend: /users vs frontend: /user)
- [ ] Falta de prefijo /api o versioning (/v1)
- [ ] URLs hardcodeadas apuntando a localhost
- [ ] Trailing slashes inconsistentes

#### Autenticación/Autorización
- [ ] Headers de autorización no enviados
- [ ] Tokens no almacenados/recuperados correctamente
- [ ] Middleware de autenticación bloqueando requests válidos
- [ ] Refresh token no implementado

#### Request/Response
- [ ] Content-Type incorrecto
- [ ] Body mal formateado (JSON.stringify faltante)
- [ ] Parámetros de query mal construidos
- [ ] Headers requeridos no enviados

#### Manejo de Errores
- [ ] Errores no capturados (try-catch faltante)
- [ ] Respuestas de error no parseadas
- [ ] Status codes no manejados (401, 403, 500)
- [ ] Timeouts no configurados

#### TypeScript/Validación
- [ ] Tipos incompatibles entre frontend y backend
- [ ] Validaciones de schemas diferentes
- [ ] DTOs no sincronizados
- [ ] Campos requeridos no enviados

### 6. Reporte de Hallazgos

Para cada problema encontrado, proporciona:

1. **Ubicación**: Archivo y línea exacta
2. **Problema**: Descripción clara del error
3. **Impacto**: Qué funcionalidad está afectada
4. **Solución**: Código exacto para arreglar
5. **Prioridad**: Crítico/Alto/Medio/Bajo

### 7. Plan de Remediación

Proporciona:
- Lista priorizada de fixes
- Orden sugerido de implementación
- Posibles breaking changes
- Tests recomendados después de cada fix

## Comandos Útiles para la Auditoría

```bash
# Buscar todas las llamadas fetch/axios
rg "fetch\(|axios\." --type ts --type tsx --type js

# Buscar URLs hardcodeadas
rg "http://|https://" --type ts --type tsx --type js

# Buscar definiciones de endpoints
rg "@Get\(|@Post\(|@Put\(|@Delete\(|router\.(get|post|put|delete)" --type ts

# Buscar variables de entorno no definidas
rg "process\.env\." --type ts --type js

# Buscar TODOs y FIXMEs
rg "TODO|FIXME" --type ts --type js
```

## Output Esperado

1. **Resumen ejecutivo**: 2-3 párrafos sobre el estado general
2. **Tabla de concordancia completa**: Todos los endpoints mapeados
3. **Lista de problemas**: Ordenada por prioridad
4. **Código de fixes**: Para cada problema crítico
5. **Checklist de verificación**: Para confirmar que todo funciona
6. **Recomendaciones**: Mejoras arquitecturales si aplica

## Notas Importantes

- Sé exhaustivo: revisa TODO el código, no solo lo obvio
- Usa búsquedas con ripgrep (rg) para no perderte nada
- Verifica archivos de configuración en TODOS los niveles
- No asumas nada: verifica cada conexión
- Si encuentras patrones problemáticos, señala TODAS las ocurrencias
- Prioriza problemas que bloquean funcionalidad core

## Criterios de Éxito

La auditoría está completa cuando:
- ✅ Todos los endpoints están mapeados
- ✅ Todos los problemas están identificados
- ✅ Hay soluciones concretas para cada problema
- ✅ Las prioridades están claras
- ✅ Hay un plan de acción específico