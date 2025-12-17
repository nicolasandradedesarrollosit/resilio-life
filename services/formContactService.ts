export async function sendContactForm(formData: {name: string; email: string; subject: string; message: string}) {
    try {
        const url = process.env.NEXT_API_URL || 'http://localhost:4000';
        const response = await fetch(`${url}/api/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const contentType = response.headers.get('content-type') || '';

        if (!response.ok) {
            // Try to extract error details from the response body when possible
            let bodyText: string | Record<string, unknown> = await response.text();
            try {
                bodyText = JSON.parse(bodyText as string);
            } catch (e) {
                // not JSON, keep as text
            }
            const msg = `Request failed with status ${response.status}: ${JSON.stringify(bodyText)}`;
            throw new Error(msg);
        }

        if (contentType.includes('application/json')) {
            return await response.json();
        }

        // If no JSON body, return a simple success indicator
        return { message: 'OK', status: response.status };
    }
    catch (error) {
        console.error('Error sending contact form:', error);
        // Wrap non-Error throwables to ensure consistent Error objects
        if (error instanceof Error) throw error;
        throw new Error(String(error));
    }
}