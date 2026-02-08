---
name: frontend-development
description: Desarrollo frontend con React, Redux y Next.js siguiendo arquitectura feature-based con separación de módulos compartidos y no compartidos. Usar este contexto para todas las tareas relacionadas con UI, componentes, estado, routing, y lógica del cliente.
---

# Frontend Development - React + Redux + Next.js

## 🔍 AUDITORÍA Y REFACTORIZACIÓN DEL REPOSITORIO

### Objetivo Principal: Hooks para Lógica de Negocio

**PRIORIDAD MÁXIMA**: Toda la lógica de negocio debe estar encapsulada en custom hooks. Los componentes deben ser declarativos y centrados en la presentación.

### Checklist de Auditoría Completa

#### 1. 🎯 Hooks para Lógica de Negocio (CRÍTICO)

**✅ Identificar y Refactorizar:**

- [ ] **Llamadas a APIs directas en componentes** → Mover a hooks personalizados
- [ ] **Dispatches de Redux dispersos** → Centralizar en hooks del feature
- [ ] **Lógica de formularios compleja** → Extraer a `useForm` hooks
- [ ] **Efectos secundarios (useEffect) con lógica compleja** → Abstraer en hooks
- [ ] **Transformación de datos en componentes** → Mover a hooks o utils
- [ ] **Manejo de estados de carga/error repetidos** → Crear hooks reutilizables

**Patrón Correcto:**

```typescript
// ❌ MAL: Lógica en el componente
function UserProfile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  
  useEffect(() => {
    setLoading(true)
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        setUser(data)
        dispatch(setUser(data))
        setLoading(false)
      })
  }, [])
  
  return loading ? <Spinner /> : <div>{user?.name}</div>
}

// ✅ BIEN: Lógica en hook personalizado
function UserProfile() {
  const { user, isLoading } = useUser()
  
  if (isLoading) return <Spinner />
  return <div>{user?.name}</div>
}

// features/users/hooks/useUser.ts
export function useUser() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const isLoading = useAppSelector(selectUserLoading)

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])

  return { user, isLoading }
}
```

#### 2. 📦 Modularización de Componentes (DRY)

**Detectar Componentes Grandes (>200 líneas):**

- [ ] Archivos TSX con más de 200 líneas de código
- [ ] Componentes con múltiples responsabilidades
- [ ] Renderizado condicional complejo
- [ ] Múltiples handlers de eventos en un solo componente
- [ ] Lógica de presentación repetida

**Estrategia de División:**

```typescript
// ❌ MAL: Componente monolítico (300+ líneas)
function UserDashboard() {
  return (
    <div>
      {/* 50 líneas de header */}
      <header>...</header>
      
      {/* 100 líneas de estadísticas */}
      <section>...</section>
      
      {/* 80 líneas de tabla */}
      <table>...</table>
      
      {/* 70 líneas de sidebar */}
      <aside>...</aside>
    </div>
  )
}

// ✅ BIEN: Componentes modulares
function UserDashboard() {
  return (
    <div>
      <DashboardHeader />
      <DashboardStats />
      <DashboardTable />
      <DashboardSidebar />
    </div>
  )
}

// Cada subcomponente en su propio archivo
// components/DashboardHeader.tsx (30 líneas)
// components/DashboardStats.tsx (50 líneas)
// components/DashboardTable.tsx (60 líneas)
// components/DashboardSidebar.tsx (40 líneas)
```

#### 3. 🧩 Componentes Dumb vs Smart

**Separación Clara:**

- [ ] **Dumb Components** (Presentacionales): Solo reciben props, sin lógica
- [ ] **Smart Components** (Contenedores): Manejan lógica y estado via hooks
- [ ] Mover componentes dumb a `shared/components/ui/`
- [ ] Mantener smart components en `features/[feature]/components/`

```typescript
// ✅ Dumb Component (shared/components/ui/Button.tsx)
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export function Button({ label, onClick, variant = 'primary', disabled }: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

// ✅ Smart Component (features/products/components/ProductActions.tsx)
export function ProductActions({ productId }: { productId: string }) {
  const { deleteProduct, isDeleting } = useProductActions()
  
  const handleDelete = () => {
    deleteProduct(productId)
  }
  
  return (
    <Button 
      label="Delete"
      onClick={handleDelete}
      disabled={isDeleting}
      variant="secondary"
    />
  )
}
```

#### 4. 🏗️ Principios SOLID Aplicados

**S - Single Responsibility:**
- [ ] Un componente = Una responsabilidad
- [ ] Un hook = Una funcionalidad específica
- [ ] Un archivo = Una exportación principal

**O - Open/Closed:**
- [ ] Componentes extensibles via props
- [ ] Hooks composables
- [ ] Usar composition sobre configuración

**L - Liskov Substitution:**
- [ ] Props interfaces consistentes
- [ ] Componentes intercambiables del mismo tipo

**I - Interface Segregation:**
- [ ] Props mínimas necesarias
- [ ] No forzar props que no se usan
- [ ] Dividir interfaces grandes

**D - Dependency Inversion:**
- [ ] Inyectar dependencias via props o context
- [ ] No hardcodear servicios en componentes
- [ ] Usar abstracciones (interfaces) no implementaciones

```typescript
// ✅ SOLID aplicado
// Interface segregation
interface BaseCardProps {
  title: string
  children: React.ReactNode
}

interface ClickableCardProps extends BaseCardProps {
  onClick: () => void
}

// Dependency Inversion
interface UserCardProps {
  user: User
  onUpdate: (user: User) => void  // Inyectamos la dependencia
}

export function UserCard({ user, onUpdate }: UserCardProps) {
  // No llama directamente al API, recibe la función
  return <Card onClick={() => onUpdate(user)}>{user.name}</Card>
}
```

#### 5. 🔄 Principio DRY (Don't Repeat Yourself)

**Buscar y Eliminar Duplicación:**

- [ ] Código duplicado en componentes → Extraer a shared component
- [ ] Lógica duplicada → Extraer a hook o utility
- [ ] Validaciones repetidas → Centralizar en utils
- [ ] Mapeos/transformaciones repetidas → Crear funciones helper
- [ ] Estilos duplicados → Usar Tailwind utilities o crear componentes

```typescript
// ❌ MAL: Código duplicado
function ProductList() {
  const products = useAppSelector(state => state.products.items)
  const loading = useAppSelector(state => state.products.loading)
  const error = useAppSelector(state => state.products.error)
  
  if (loading) return <Spinner />
  if (error) return <Error message={error} />
  return <div>{products.map(p => <ProductCard key={p.id} product={p} />)}</div>
}

function UserList() {
  const users = useAppSelector(state => state.users.items)
  const loading = useAppSelector(state => state.users.loading)
  const error = useAppSelector(state => state.users.error)
  
  if (loading) return <Spinner />
  if (error) return <Error message={error} />
  return <div>{users.map(u => <UserCard key={u.id} user={u} />)}</div>
}

// ✅ BIEN: Hook reutilizable
function useResourceState<T>(selector: (state: RootState) => {
  items: T[]
  loading: boolean
  error: string | null
}) {
  const { items, loading, error } = useAppSelector(selector)
  return { items, loading, error }
}

// Uso
function ProductList() {
  const { items, loading, error } = useResourceState(state => state.products)
  
  if (loading) return <Spinner />
  if (error) return <Error message={error} />
  return <div>{items.map(p => <ProductCard key={p.id} product={p} />)}</div>
}
```

#### 6. 📁 Estructura de Archivos Óptima

**Reglas de Organización:**

- [ ] Máximo 200 líneas por archivo (excepto generados)
- [ ] Un componente por archivo
- [ ] Colocar componentes relacionados en carpetas
- [ ] Usar index.ts para exportaciones limpias
- [ ] Separar tipos en archivos `.types.ts`

```
features/products/
├── components/
│   ├── ProductCard.tsx              # 80 líneas
│   ├── ProductList.tsx              # 60 líneas
│   ├── ProductForm/                 # Componente complejo
│   │   ├── index.tsx                # 40 líneas (componente principal)
│   │   ├── ProductFormFields.tsx   # 50 líneas
│   │   ├── ProductFormActions.tsx  # 30 líneas
│   │   └── useProductForm.ts       # 70 líneas (hook de lógica)
│   └── index.ts                     # Exportaciones públicas
├── hooks/
│   ├── useProducts.ts               # Hook principal del feature
│   ├── useProductActions.ts         # CRUD operations
│   ├── useProductFilters.ts         # Filtrado y búsqueda
│   └── index.ts
├── types/
│   ├── product.types.ts
│   └── index.ts
└── index.ts                         # API pública del feature
```

#### 7. 🎣 Catálogo de Hooks Requeridos

**Hooks de Lógica de Negocio Esenciales:**

```typescript
// 1. Hook principal del feature
export function useProducts() {
  const products = useAppSelector(selectProducts)
  const dispatch = useAppDispatch()
  
  const loadProducts = useCallback(() => {
    dispatch(fetchProducts())
  }, [dispatch])
  
  return { products, loadProducts }
}

// 2. Hook para acciones CRUD
export function useProductActions() {
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  
  const createProduct = async (data: CreateProductDTO) => {
    setIsLoading(true)
    try {
      await dispatch(createProductThunk(data)).unwrap()
    } finally {
      setIsLoading(false)
    }
  }
  
  return { createProduct, updateProduct, deleteProduct, isLoading }
}

// 3. Hook para formularios
export function useProductForm(initialValues: Product) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const validate = () => {
    // Validación
  }
  
  const handleSubmit = async () => {
    if (validate()) {
      // Submit logic
    }
  }
  
  return { values, errors, handleChange, handleSubmit }
}

// 4. Hook para filtros/búsqueda
export function useProductFilters() {
  const [filters, setFilters] = useState<ProductFilters>({})
  const products = useAppSelector(selectProducts)
  
  const filteredProducts = useMemo(
    () => applyFilters(products, filters),
    [products, filters]
  )
  
  return { filters, setFilters, filteredProducts }
}
```

#### 8. 🚨 Código que Debe Refactorizarse

**Señales de Alerta:**

- [ ] `useEffect` con más de 10 líneas → Extraer lógica a hook
- [ ] Funciones handler con lógica de negocio → Mover a hook
- [ ] Múltiples `useState` relacionados → Usar `useReducer` o Redux
- [ ] Prop drilling (>3 niveles) → Usar Context o Redux
- [ ] Fetch/axios directo en componentes → Mover a services + hooks
- [ ] Transformaciones de datos en JSX → Mover a useMemo o utils
- [ ] Lógica condicional compleja en render → Extraer a funciones

#### 9. ✅ Checklist Pre-Commit

Antes de cada commit, verificar:

- [ ] ¿El componente tiene menos de 150-200 líneas?
- [ ] ¿Toda la lógica de negocio está en hooks?
- [ ] ¿No hay llamadas directas a APIs en componentes?
- [ ] ¿Los componentes dumb están en shared/?
- [ ] ¿Se siguen los principios SOLID?
- [ ] ¿No hay código duplicado (DRY)?
- [ ] ¿Los nombres son descriptivos y claros?
- [ ] ¿Hay manejo de errores apropiado?
- [ ] ¿Los tipos TypeScript son estrictos?
- [ ] ¿No hay imports entre features?

#### 10. 🔧 Plan de Refactorización

**Proceso paso a paso:**

1. **Identificar**: Listar componentes >200 líneas o con lógica mezclada
2. **Analizar**: Identificar responsabilidades y dependencias
3. **Extraer Hooks**: Mover lógica de negocio a hooks personalizados
4. **Dividir Componentes**: Separar en componentes más pequeños
5. **Crear Dumb Components**: Extraer partes presentacionales
6. **Eliminar Duplicación**: Consolidar código repetido
7. **Testear**: Verificar que todo funciona correctamente
8. **Documentar**: Actualizar documentación si es necesario

### 🎯 Métricas de Calidad

**Objetivos a alcanzar:**

- ✅ Componentes: Promedio <100 líneas, máximo 200 líneas
- ✅ Hooks: Cada feature debe tener al menos 2-3 hooks personalizados
- ✅ Duplicación: <5% de código duplicado
- ✅ Cobertura: Tests para componentes críticos
- ✅ TypeScript: 100% tipado estricto, sin `any`
- ✅ Separación: 70% dumb components, 30% smart components

---

## Arquitectura del Proyecto

### Estructura Feature-Based

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route groups
│   ├── (dashboard)/
│   └── layout.tsx
│
├── features/                     # Feature modules (non-shared)
│   ├── auth/
│   │   ├── components/          # Componentes específicos del feature
│   │   ├── hooks/               # Custom hooks del feature
│   │   ├── store/               # Redux slice del feature
│   │   ├── services/            # API calls específicas
│   │   ├── types/               # TypeScript types
│   │   ├── utils/               # Utilidades del feature
│   │   └── index.ts             # Public API del feature
│   │
│   ├── dashboard/
│   ├── products/
│   └── users/
│
├── shared/                       # Shared modules
│   ├── components/              # Componentes reutilizables
│   │   ├── ui/                  # Componentes UI básicos
│   │   ├── forms/               # Form components
│   │   └── layouts/             # Layout components
│   │
│   ├── hooks/                   # Custom hooks compartidos
│   ├── store/                   # Redux store configuration
│   │   ├── rootReducer.ts
│   │   ├── store.ts
│   │   └── middleware.ts
│   │
│   ├── services/                # Servicios compartidos
│   │   ├── api/                 # API client configuration
│   │   └── storage/             # Local/session storage
│   │
│   ├── utils/                   # Utilidades compartidas
│   ├── types/                   # Types compartidos
│   ├── constants/               # Constantes globales
│   └── styles/                  # Estilos globales
│
└── config/                      # Configuraciones
    ├── env.ts
    └── routes.ts
```

## Principios de Diseño

### 1. Single Responsibility Principle (SRP)
- Cada componente, hook o función tiene una única responsabilidad
- Los componentes grandes se dividen en subcomponentes especializados
- Los hooks personalizados encapsulan lógica específica

### 2. Feature Module Guidelines

**Non-Shared Modules (features/):**
- Contienen lógica de negocio específica del feature
- No deben ser importados por otros features
- Pueden importar de `shared/`
- Exponen una API pública clara a través de `index.ts`

**Shared Modules (shared/):**
- Código reutilizable entre múltiples features
- Sin dependencias de features específicos
- Altamente genéricos y configurables
- Bien documentados y testeados

### 3. Reglas de Importación

```typescript
// ✅ CORRECTO
// Feature puede importar de shared
import { Button } from '@/shared/components/ui'
import { useAuth } from '@/shared/hooks'

// Feature puede importar internamente
import { LoginForm } from './components/LoginForm'
import { authSlice } from './store/authSlice'

// ❌ INCORRECTO
// Feature NO debe importar de otro feature
import { ProductCard } from '@/features/products/components'
```

## Redux Pattern

### Slice Structure

```typescript
// features/auth/store/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/shared/store/store'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    clearAuth: (state) => {
      state.user = null
      state.token = null
    },
  },
})

// Actions
export const { setUser, clearAuth } = authSlice.actions

// Selectors
export const selectUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) => !!state.auth.token

// Reducer
export default authSlice.reducer
```

### Async Thunks

```typescript
// features/auth/store/authThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../services/authService'

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
```

## Component Patterns

### Server Components (Next.js)

```typescript
// app/dashboard/page.tsx
import { getDashboardData } from '@/features/dashboard/services'

export default async function DashboardPage() {
  const data = await getDashboardData()
  
  return <DashboardView data={data} />
}
```

### Client Components

```typescript
'use client'

import { useAppSelector, useAppDispatch } from '@/shared/hooks/redux'
import { increment } from '@/features/counter/store/counterSlice'

export function Counter() {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <button onClick={() => dispatch(increment())}>
      Count: {count}
    </button>
  )
}
```

### Compound Components Pattern

```typescript
// shared/components/ui/Card/Card.tsx
interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return <div className={`card ${className}`}>{children}</div>
}

Card.Header = function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="card-header">{children}</div>
}

Card.Body = function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="card-body">{children}</div>
}

Card.Footer = function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="card-footer">{children}</div>
}

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

## Custom Hooks Guidelines

### Feature-Specific Hook

```typescript
// features/products/hooks/useProducts.ts
import { useAppSelector, useAppDispatch } from '@/shared/hooks/redux'
import { fetchProducts } from '../store/productsThunks'
import { selectProducts, selectIsLoading } from '../store/productsSlice'

export function useProducts() {
  const dispatch = useAppDispatch()
  const products = useAppSelector(selectProducts)
  const isLoading = useAppSelector(selectIsLoading)

  const loadProducts = () => {
    dispatch(fetchProducts())
  }

  return {
    products,
    isLoading,
    loadProducts,
  }
}
```

### Shared Hook

```typescript
// shared/hooks/useDebounce.ts
import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
```

## API Services Pattern

### Feature Service

```typescript
// features/products/services/productsService.ts
import { apiClient } from '@/shared/services/api/apiClient'
import type { Product, CreateProductDTO } from '../types'

export const productsService = {
  getAll: () => apiClient.get<Product[]>('/products'),
  
  getById: (id: string) => apiClient.get<Product>(`/products/${id}`),
  
  create: (data: CreateProductDTO) => apiClient.post<Product>('/products', data),
  
  update: (id: string, data: Partial<Product>) => 
    apiClient.put<Product>(`/products/${id}`, data),
  
  delete: (id: string) => apiClient.delete(`/products/${id}`),
}
```

### Shared API Client

```typescript
// shared/services/api/apiClient.ts
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error)
  }
)
```

## TypeScript Best Practices

### Type Organization

```typescript
// features/products/types/index.ts
export interface Product {
  id: string
  name: string
  price: number
  description: string
}

export interface CreateProductDTO {
  name: string
  price: number
  description: string
}

export type ProductFilters = {
  search?: string
  minPrice?: number
  maxPrice?: number
}
```

### Generic Types

```typescript
// shared/types/api.ts
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
```

## File Naming Conventions

- Components: `PascalCase.tsx` (e.g., `LoginForm.tsx`)
- Hooks: `camelCase.ts` (e.g., `useProducts.ts`)
- Utils: `camelCase.ts` (e.g., `formatDate.ts`)
- Types: `camelCase.ts` or `PascalCase.ts` (e.g., `types.ts` o `Product.types.ts`)
- Constants: `UPPER_SNAKE_CASE.ts` (e.g., `API_ENDPOINTS.ts`)

## Testing Structure

```typescript
// features/products/components/__tests__/ProductCard.test.tsx
import { render, screen } from '@testing-library/react'
import { ProductCard } from '../ProductCard'

describe('ProductCard', () => {
  it('renders product information', () => {
    const product = { id: '1', name: 'Test', price: 100 }
    render(<ProductCard product={product} />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

## Performance Optimization

### Code Splitting

```typescript
// Dynamic imports para reducir bundle size
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
  ssr: false,
})
```

### Memoization

```typescript
import { memo, useMemo, useCallback } from 'react'

export const ProductList = memo(({ products }: Props) => {
  const sortedProducts = useMemo(
    () => products.sort((a, b) => a.price - b.price),
    [products]
  )

  const handleClick = useCallback((id: string) => {
    console.log(id)
  }, [])

  return <div>{/* ... */}</div>
})
```

## Code Quality Checklist

Antes de hacer commit, verificar:

- [ ] No hay imports cruzados entre features
- [ ] Los componentes siguen el principio de responsabilidad única
- [ ] Los tipos TypeScript están correctamente definidos
- [ ] Los hooks personalizados siguen las reglas de hooks
- [ ] El código está formateado (Prettier)
- [ ] No hay warnings de ESLint
- [ ] Los componentes están correctamente memoizados si es necesario
- [ ] Las funciones async tienen manejo de errores

## Common Pitfalls

### ❌ Evitar

```typescript
// Feature importando otro feature
import { UserCard } from '@/features/users'

// Estado local para datos que deberían estar en Redux
const [products, setProducts] = useState([])

// Lógica de negocio en componentes
function ProductCard({ product }) {
  const calculateDiscount = () => {
    // Compleja lógica de negocio
  }
}
```

### ✅ Hacer

```typescript
// Crear shared component o duplicar si es necesario
import { Card } from '@/shared/components/ui'

// Usar Redux para estado compartido
const products = useAppSelector(selectProducts)

// Extraer lógica a utils o hooks
import { calculateDiscount } from '../utils/pricing'
```