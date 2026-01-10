export async function logInUser(formData : {email: string, password: string}) {
    const url = process.env.NEXT_PUBLIC_API_URL
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
    const url = process.env.NEXT_PUBLIC_API_URL;
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
    const url = process.env.NEXT_PUBLIC_API_URL;
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
    const url = process.env.NEXT_PUBLIC_API_URL;
    try {
        const response = await fetch(`${url}/api/check-session`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (!response.ok) return new Error(`Error: ${response.status} - ${response.statusText}`);

        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Error checking session:', err);
        throw err;
    }
}