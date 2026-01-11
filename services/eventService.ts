export async function getEvents () {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
    try {
        const response = await fetch(`${url}/api/events`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Error fetching events');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
}