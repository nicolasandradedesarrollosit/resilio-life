# Frontend Restructuring Guide - Feature-Based Architecture with Hooks

## Project Overview
This is a Next.js frontend application that requires restructuring to follow a feature-based architecture pattern, with business logic encapsulated in custom hooks and adherence to clean code principles.

## Core Architecture Principles

### 1. Feature-Based Structure
Organize code by features/domains rather than technical layers. Each feature should be self-contained and cohesive.

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useLogin.ts
│   │   │   └── useSession.ts
│   │   ├── services/
│   │   │   └── authService.ts
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   ├── utils/
│   │   │   └── tokenHelpers.ts
│   │   └── index.ts
│   ├── users/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.ts
│   └── dashboard/
│       ├── components/
│       ├── hooks/
│       └── index.ts
├── shared/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── useFetch.ts
│   ├── utils/
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── constants.ts
│   └── types/
│       └── common.types.ts
├── lib/
│   ├── api/
│   │   └── client.ts
│   └── config/
│       └── environment.ts
└── app/
    ├── (auth)/
    │   ├── login/
    │   │   └── page.tsx
    │   └── register/
    │       └── page.tsx
    └── (dashboard)/
        └── page.tsx
```

### 2. Business Logic in Custom Hooks

**ALWAYS encapsulate business logic in custom hooks following these patterns:**

#### Hook Categories

**Data Fetching Hooks**
```typescript
// features/users/hooks/useUsers.ts
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
}
```

**Business Logic Hooks**
```typescript
// features/auth/hooks/useAuth.ts
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const { token, user } = await authService.login(credentials);
    tokenStorage.set(token);
    setUser(user);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.remove();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, user, login, logout };
}
```

**Form Handling Hooks**
```typescript
// features/users/hooks/useUserForm.ts
export function useUserForm(initialValues: UserFormData) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isDirty, setIsDirty] = useState(false);

  const validate = useCallback(() => {
    const validationErrors = validateUserForm(values);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [values]);

  const handleChange = useCallback((field: keyof UserFormData, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }, []);

  const handleSubmit = useCallback(async (onSuccess?: () => void) => {
    if (!validate()) return;
    
    try {
      await userService.update(values);
      onSuccess?.();
      setIsDirty(false);
    } catch (error) {
      setErrors({ submit: 'Failed to save user' });
    }
  }, [values, validate]);

  return { values, errors, isDirty, handleChange, handleSubmit, validate };
}
```

### 3. Component Design Principles

**Components should be THIN and PRESENTATIONAL:**

```typescript
// ❌ BAD: Business logic in component
export function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users/me')
      .then(res => res.json())
      .then(data => setUser(data))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (data: UserData) => {
    // Complex validation logic
    if (!data.name || data.name.length < 3) return;
    if (!validateEmail(data.email)) return;
    
    // API call
    await fetch('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  };

  return <div>...</div>;
}

// ✅ GOOD: Business logic in hooks
export function UserProfile() {
  const { user, loading } = useCurrentUser();
  const { updateUser, updating } = useUpdateUser();

  return (
    <ProfileView 
      user={user}
      loading={loading || updating}
      onUpdate={updateUser}
    />
  );
}
```

### 4. Service Layer Pattern

**All API calls must go through service modules:**

```typescript
// features/users/services/userService.ts
class UserService {
  private apiClient = createApiClient();

  async getAll(): Promise<User[]> {
    return this.apiClient.get<User[]>('/users');
  }

  async getById(id: string): Promise<User> {
    return this.apiClient.get<User>(`/users/${id}`);
  }

  async create(data: CreateUserDTO): Promise<User> {
    return this.apiClient.post<User>('/users', data);
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    return this.apiClient.put<User>(`/users/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return this.apiClient.delete(`/users/${id}`);
  }
}

export const userService = new UserService();
```

### 5. Clean Code Standards

**Naming Conventions:**
- Components: PascalCase (`UserProfile.tsx`)
- Hooks: camelCase with 'use' prefix (`useUserProfile.ts`)
- Services: camelCase with 'Service' suffix (`userService.ts`)
- Types: PascalCase with descriptive names (`UserProfileData`)
- Utils: camelCase (`validateEmail.ts`)

**File Organization:**
- One component per file
- Co-locate types with their feature
- Export through index.ts (barrel exports)
- Max 200 lines per file (split if larger)

**Code Quality:**
```typescript
// ✅ Single Responsibility
export function useUserValidation() {
  // Only handles validation logic
}

// ✅ Descriptive naming
const isUserAuthenticated = checkAuthStatus();

// ✅ Early returns
function validateUser(user: User) {
  if (!user.email) return { valid: false, error: 'Email required' };
  if (!user.name) return { valid: false, error: 'Name required' };
  return { valid: true };
}

// ✅ Avoid magic numbers
const MAX_USERNAME_LENGTH = 50;
const MIN_PASSWORD_LENGTH = 8;

// ✅ Use TypeScript strictly
interface UserFormProps {
  onSubmit: (data: UserData) => Promise<void>;
  initialValues?: Partial<UserData>;
  disabled?: boolean;
}
```

### 6. State Management Strategy

**Local State (useState):**
- Component UI state (modals, dropdowns)
- Form inputs
- Temporary data

**Custom Hooks:**
- Feature-specific business logic
- Data fetching
- Complex state transitions

**Context (when needed):**
- Truly global state (theme, auth)
- Avoid prop drilling
- Keep contexts small and focused

**Redux (if already present):**
- Only for complex shared state
- Prefer hooks for new features
- Gradually migrate to hooks

### 7. Testing Strategy

**Each hook should have corresponding tests:**

```typescript
// features/auth/hooks/__tests__/useAuth.test.ts
describe('useAuth', () => {
  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login({ email: 'test@test.com', password: 'pass' });
    });
    
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

## Restructuring Workflow

### Phase 1: Analysis
1. Identify all current features in the application
2. Map existing components to features
3. Document current business logic locations
4. List all API endpoints used

### Phase 2: Setup Structure
1. Create `src/features` directory
2. Create feature folders with subdirectories
3. Create `src/shared` for reusable code
4. Set up barrel exports (index.ts)

### Phase 3: Extract Business Logic
1. Identify business logic in components
2. Create custom hooks for each logical unit
3. Move API calls to service layer
4. Update components to use hooks

### Phase 4: Refactor Components
1. Make components presentational
2. Extract complex logic to hooks
3. Simplify component responsibilities
4. Add proper TypeScript types

### Phase 5: Clean Up
1. Remove unused code
2. Consolidate duplicated logic
3. Ensure consistent naming
4. Add documentation

## Migration Checklist

When restructuring any feature:

- [ ] Create feature folder structure
- [ ] Move related components to feature
- [ ] Extract business logic to hooks
- [ ] Create service layer for API calls
- [ ] Define TypeScript types/interfaces
- [ ] Update imports in consuming components
- [ ] Add tests for hooks
- [ ] Remove old files
- [ ] Update barrel exports
- [ ] Document any breaking changes

## Code Review Standards

Before considering restructuring complete:

- [ ] No business logic in components
- [ ] All API calls through services
- [ ] Hooks follow single responsibility
- [ ] Types are defined and exported
- [ ] No code duplication
- [ ] Consistent naming conventions
- [ ] Files are under 200 lines
- [ ] Tests cover main use cases
- [ ] Documentation is updated
- [ ] No console.logs or debug code

## Anti-Patterns to Avoid

**❌ Don't:**
- Put business logic directly in components
- Make API calls from components
- Create god components (>300 lines)
- Use magic strings/numbers
- Ignore TypeScript errors
- Mix presentation and business logic
- Create circular dependencies
- Overuse global state

**✅ Do:**
- Encapsulate logic in focused hooks
- Keep components thin and presentational
- Use services for data access
- Follow single responsibility principle
- Leverage TypeScript for type safety
- Compose small, focused functions
- Prefer composition over inheritance
- Document complex logic

## Example Feature Implementation

Complete example of a well-structured feature:

```typescript
// features/products/types/product.types.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface CreateProductDTO {
  name: string;
  price: number;
  stock: number;
}

// features/products/services/productService.ts
export const productService = {
  getAll: () => apiClient.get<Product[]>('/products'),
  create: (data: CreateProductDTO) => apiClient.post<Product>('/products', data),
};

// features/products/hooks/useProducts.ts
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, refetch: fetchProducts };
}

// features/products/hooks/useCreateProduct.ts
export function useCreateProduct() {
  const [creating, setCreating] = useState(false);

  const createProduct = useCallback(async (data: CreateProductDTO) => {
    setCreating(true);
    try {
      return await productService.create(data);
    } finally {
      setCreating(false);
    }
  }, []);

  return { createProduct, creating };
}

// features/products/components/ProductList.tsx
export function ProductList() {
  const { products, loading } = useProducts();
  
  if (loading) return <Spinner />;
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// features/products/index.ts
export { ProductList } from './components/ProductList';
export { useProducts } from './hooks/useProducts';
export type { Product, CreateProductDTO } from './types/product.types';
```

## Notes for Claude Code

When restructuring:
1. **Always ask** which feature to restructure first
2. **Analyze** existing code before moving
3. **Preserve** existing functionality
4. **Create** hooks before refactoring components
5. **Test** after each major change
6. **Document** any architectural decisions
7. **Validate** TypeScript types are correct
8. **Ensure** no breaking changes to public APIs

Remember: The goal is maintainable, testable, and scalable code that follows React best practices and clean code principles.