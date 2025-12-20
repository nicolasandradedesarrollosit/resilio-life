export async function sendContactForm(formData: {name: string; email: string; subject: string; message: string}) {
    try {
        const url = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${url}/api/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const contentType = response.headers.get('content-type') || '';

        if (!response.ok) {
            let bodyText: string | Record<string, unknown> = await response.text();
            try {
                bodyText = JSON.parse(bodyText as string);
            } catch (e) {
            }
            const msg = `Request failed with status ${response.status}: ${JSON.stringify(bodyText)}`;
            throw new Error(msg);
        }

        if (contentType.includes('application/json')) {
            return await response.json();
        }

        return { message: 'OK', status: response.status };
    }
    catch (error) {
        console.error('Error sending contact form:', error);
        if (error instanceof Error) throw error;
        throw new Error(String(error));
    }
}