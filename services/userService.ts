export async function logInUser(formData : {email: string, password: string}) {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
    try {
        const response = await fetch(`${url}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData),
        })

        if (!response.ok) return new Error(`Error: ${response.status} - ${response.statusText}`);
        
        const data = await response.json();
        return data;
    }
    catch(err) {
        throw err;
    }
}

export async function authGoogleService(googleData: { idToken?: string | null, email?: string | null, name?: string | null}) {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
    try {
        const response = await fetch(`${url}/api/login-google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(googleData)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Error en login con Google');
        }

        return response.json();
    }
    catch (err) {
        console.error('Error in authGoogleService:', err);
        throw err;
    }
}

export async function registerUser(formData: {name: string, lastName: string, email: string, password: string}) {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
    try {
        const response = await fetch(`${url}/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Error en el registro de usuario');
        }

        return response.json();
    } catch(err) {
        console.error('Error registering user:', err);
        throw err;
    }
}

export async function checkSession() {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
    try {
        console.log('[checkSession] Fetching from:', `${url}/api/check-session`);
        
        const response = await fetch(`${url}/api/check-session`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        
        console.log('[checkSession] Response status:', response.status, response.ok);
        
        // Si no está autenticado (401), retornar objeto indicando no logueado
        if (response.status === 401) {
            console.log('[checkSession] User not authenticated (401)');
            return { loggedIn: false, user: null };
        }
        
        if (!response.ok) {
            console.error('[checkSession] Error response:', response.status, response.statusText);
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('[checkSession] Response data:', { loggedIn: data.loggedIn, hasUser: !!data.user });
        return data;
    } catch (err) {
        console.error('[checkSession] Fetch error:', err);
        // En caso de error de red, retornar como no autenticado para evitar loops
        return { loggedIn: false, user: null, error: err instanceof Error ? err.message : 'Unknown error' };
    }
}

export async function getUsers() {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
    try {
        const response = await fetch(`${url}/api/users`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (!response.ok) return new Error(`Error: ${response.status} - ${response.statusText}`);

        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Error fetching users:', err);
        throw err;
    }
}

export async function logOut() {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
    try {
        const response = await fetch(`${url}/api/logout`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (!response.ok) return new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    catch(err) {
        console.error('Error logging out:', err);
        throw err;
    }
}