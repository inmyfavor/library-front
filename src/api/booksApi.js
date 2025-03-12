const API_URL = "/api/books";

export const getBooks = async () => {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: { "Content-Type": "application/json" }
  });
  return response.json();
};

export const addBook = async (book) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  return response.json();
};

export const updateBook = async (id, book) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  return response.json();
};

export const deleteBook = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};

export const handleLogout = async () => {
  try {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    window.location.href = "/";
  } catch (error) {
    console.error(error);
  }
};
