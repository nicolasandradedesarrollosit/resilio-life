---
name: frontend-development
description: Desarrollo frontend con React, Redux y Next.js siguiendo arquitectura feature-based con separación de módulos compartidos y no compartidos. Usar este contexto para todas las tareas relacionadas con UI, componentes, estado, routing, y lógica del cliente.
---

# Frontend Development - React + Redux + Next.js

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