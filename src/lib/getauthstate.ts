async function getAuthState(token: string): Promise<any> {
  const response = await fetch("/api/protected", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to authenticate");
  }

  const data = await response.json();
  return data;
}

export {getAuthState}