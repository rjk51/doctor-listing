// Function to fetch doctor data from the API
export const fetchDoctors = async () => {
  try {
    const response = await fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');
    if (!response.ok) {
      throw new Error('Failed to fetch doctor data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching doctor data:', error);
    return [];
  }
};