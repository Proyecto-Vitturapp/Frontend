const API_SECRET_KEY = import.meta.env.VITE_API_SECRET_KEY || "";
const baseUrl = "/api";

async function request(endpoint, options = {}) {
  const url = `${baseUrl}${endpoint}`;
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_SECRET_KEY,
      Authorization: `Bearer ${token || API_SECRET_KEY}`,
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Error en la peticion" }));
    throw new Error(error.message || `Error ${response.status}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export const api = {
  auth: {
    login: (credentials) => request("/login", { method: "POST", body: credentials }),
  },
  vehicles: {
    getAll: () => request("/vehicles/all"),
    getAllTotal: () => request("/vehicles/all/total"),
    getInWorkshop: () => request("/vehicles/in-workshop"),
    getInWorkshopTotal: () => request("/vehicles/in-workshop/total"),
    getByPlate: (plate) => request(`/vehicle/${plate}`),
    getAllUserVehicles: (usuarioId) => request(`/vehicles/${usuarioId}`),
    getInWorkshopUserVehicles: (usuarioId) => request(`/vehicles/${usuarioId}/in-workshop`),
  },
  vehicle: {
    create: (data) => request("/vehicle/new", { method: "POST", body: data }),
    update: (plate, data) => request(`/vehicle/update/${plate}`, { method: "PUT", body: data }),
    delete: (plate) => request(`/vehicle/delete/${plate}`, { method: "DELETE" }),
  },
  reviews: {
    getAll: () => request("/reviews/all"),
    getAllTotal: () => request("/reviews/all/total"),
    getByVehiculo: (matricula) => request(`/reviews/${matricula}`),
    getById: (id) => request(`/review/${id}`),
  },
  review: {
    create: (data) => request("/review/new", { method: "POST", body: data }),
    update: (id, data) => request(`/revisiones/${id}`, { method: "PUT", body: data }),
    delete: (id) => request(`/revisiones/${id}`, { method: "DELETE" }),
  }, 
  users: {
    getAll: () => request("/users/all"),
    getAllTotal: () => request("/users/all/total"),
    getById: (id) => request(`/user/${id}`),
    addVehicle: (usuarioId, plate) => request(`/vehicle/${plate}/add-user/${usuarioId}`, { method: "POST" }),
    getUsersByVehicle: (matricula) => request(`/vehicle/${matricula}/users`),
  },
  user: {
    create: (data) => request("/user/new", { method: "POST", body: data }),
    update: (id, data) => request(`/user/update/${id}`, { method: "PUT", body: data }),
    delete: (id) => request(`/user/delete/${id}`, { method: "DELETE" }),
  },
};
