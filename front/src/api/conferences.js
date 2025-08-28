import { api } from "./client.js";

// GET /conferences
export const listConfs = () => api("/conferences");

// GET /conference/:id
export const getConf = (id) => api(`/conference/${encodeURIComponent(id)}`);

// CREATE: POST /conference   
export const createConf = (payload) =>
  api("/conference", { method: "POST", body: payload });

// UPDATE: PATCH /conference?id=...  
export const updateConf = async (id, payload) => {
  const pid = encodeURIComponent(id);
  const tries = [
    { url: `/conference/${pid}`, body: payload },
    { url: `/conference?id=${pid}`, body: payload },
    { url: `/conference/${pid}`, body: { conference: payload } },
    { url: `/conference?id=${pid}`, body: { conference: payload } },
  ];
  let lastErr;
  for (const t of tries) {
    try {
      return await api(t.url, { method: "PATCH", body: t.body });
    } catch (e) {
      lastErr = e;
      const msg = String(e.message || "");
      if (!msg.startsWith("404") && !msg.startsWith("400")) throw e;
    }
  }
  throw lastErr;
};

// DELETE: DELETE /conference?id=...
export const removeConf = async (id) => {
  return api(`/conference/${encodeURIComponent(id)}`, { method: "DELETE" });
};
