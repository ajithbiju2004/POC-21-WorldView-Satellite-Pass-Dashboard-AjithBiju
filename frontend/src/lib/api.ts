export async function getSatellites() {
  const res = await fetch("http://127.0.0.1:8000/api/satellites");

  if (!res.ok) {
    throw new Error("Failed to fetch satellites");
  }

  return res.json();
}