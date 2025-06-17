// Gemeenschappelijke error handler voor API calls
export const handleApiResponse = async (response, errorMessage = 'Er is een fout opgetreden') => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || errorMessage);
  }
  return response.json();
};
