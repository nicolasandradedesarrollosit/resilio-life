# CLAUDE.md - Frontend (Next.js + React)

## 🎯 Project Overview

Frontend application built with Next.js 14+ and React 18+ requiring major refactoring to feature-based architecture.

| Aspect | Details |
|--------|---------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict mode) |
| State | React Query / Zustand |
| Styling | Tailwind / CSS Modules |
| Priority | Route restructuring + folder organization |

---

## 📁 Target Architecture (Feature-Based)

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route group: authentication
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/              # Route group: authenticated pages
│   │   ├── layout.tsx
│   │   └── [feature]/
│   │       └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── features/                     # 🔥 Feature modules
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useLogin.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   └── index.ts              # Public API
│   │
│   ├── users/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   │
│   └── [other-features]/
│
├── shared/                       # 🔄 Shared resources
│   ├── components/
│   │   ├── ui/                   # Button, Input, Modal, Card...
│   │   │   └── index.ts
│   │   ├── layout/               # Header, Footer, Sidebar...
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useFetch.ts
│   │   └── index.ts
│   │
│   ├── services/
│   │   ├── api.service.ts        # Axios instance + interceptors
│   │   └── index.ts
│   │
│   ├── types/
│   │   ├── api.types.ts
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── index.ts
│   │
│   ├── constants/
│   │   ├── routes.ts
│   │   ├── api.constants.ts
│   │   └── index.ts
│   │
│   └── context/
│       └── index.ts
│
├── lib/                          # Third-party configs
│   ├── axios.ts
│   └── react-query.ts
│
└── config/
    └── env.ts
```

---

## 🔧 Refactoring Phases (One Commit Each)

```
Phase 1: Setup structure
├── Create folder structure (features/, shared/, lib/, config/)
├── Setup path aliases in tsconfig.json
├── Create all index.ts barrel exports
└── COMMIT: "refactor(frontend): setup feature-based folder structure"

Phase 2: Shared infrastructure  
├── Create/move shared/components/ui/*
├── Create/move shared/hooks/*
├── Create/move shared/utils/*
├── Setup shared/services/api.service.ts
└── COMMIT: "refactor(frontend): setup shared infrastructure"

Phase 3: Feature migration (one per commit)
├── features/auth/
│   └── COMMIT: "refactor(frontend): migrate auth feature"
├── features/users/
│   └── COMMIT: "refactor(frontend): migrate users feature"
└── [Continue per feature...]

Phase 4: Route restructuring
├── Implement (auth) route group
├── Implement (dashboard) route group
├── Clean up old routes
└── COMMIT: "refactor(frontend): restructure routes with App Router groups"

Phase 5: Strict TypeScript
├── Enable strict mode in tsconfig
├── Fix all type errors
├── Add proper interfaces everywhere
└── COMMIT: "refactor(frontend): enforce strict TypeScript"
```

---

## 📝 Code Standards

### tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
```

### Component Template

```tsx
// src/features/[feature]/components/[Component].tsx
import { FC } from 'react';

interface ComponentProps {
  title: string;
  onClick?: () => void;
}

export const Component: FC<ComponentProps> = ({ title, onClick }) => {
  return (
    <div onClick={onClick}>
      {title}
    </div>
  );
};
```

### Hook Template

```tsx
// src/shared/hooks/useExample.ts
import { useState, useCallback } from 'react';

interface UseExampleReturn {
  value: string;
  setValue: (v: string) => void;
  reset: () => void;
}

export const useExample = (initial = ''): UseExampleReturn => {
  const [value, setValue] = useState(initial);
  const reset = useCallback(() => setValue(initial), [initial]);
  return { value, setValue, reset };
};
```

### API Service Template

```tsx
// src/shared/services/api.service.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Feature Service Template

```tsx
// src/features/auth/services/auth.service.ts
import { api } from '@/shared/services';
import type { LoginDto, RegisterDto, AuthResponse } from '../types';

export const authService = {
  login: (data: LoginDto) => 
    api.post<AuthResponse>('/auth/login', data),
  
  register: (data: RegisterDto) => 
    api.post<AuthResponse>('/auth/register', data),
  
  logout: () => 
    api.post('/auth/logout'),
  
  me: () => 
    api.get<AuthResponse>('/auth/me'),
};
```

---

## 🚨 Rules

### DO ✅
- Use named exports (except Next.js pages)
- Create barrel exports (index.ts)
- Use path aliases (@/features, @/shared)
- Type ALL props and return values
- Keep components under 150 lines
- One component per file

### DON'T ❌
- Never use `any`
- Never fetch data in components directly (use hooks/services)
- Never use relative imports beyond one level (../../)
- Never skip TypeScript errors with @ts-ignore
- Never commit multiple features in one commit

---

## 🔌 MCP Servers

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem", "."]
    },
    "git": {
      "command": "npx", 
      "args": ["-y", "@anthropic-ai/mcp-server-git"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-github"],
      "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
    }
  }
}
```

---

## 🚀 Commands

```bash
npm run dev          # Development
npm run build        # Build
npm run type-check   # tsc --noEmit
npm run lint         # ESLint
```