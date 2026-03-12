import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// 🔹 EXISTING
export const scanBarcode = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post("/scan-barcode", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

// 🔹 EXISTING
export const scanImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post("/analyze-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

// 🔹 FIXED - was sending "description" but backend expects "text"
export const scanText = async (description) => {
  const response = await apiClient.post("/analyze-text", {
    text: description,
  });
  return response.data;
};

// 🔹 EXISTING
export const getHistory = async () => {
  const response = await apiClient.get("/history");
  return response.data;
};

// 🔹 DELETE HISTORY ITEM
export const deleteHistoryItem = async (itemId) => {
  const response = await apiClient.delete(`/history/${itemId}`);
  return response.data;
};
