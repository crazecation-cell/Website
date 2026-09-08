import { useCallback, useEffect, useState } from "react";
import { Copy, Plus, RefreshCcw, Trash2, Upload } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export async function adminFetch(path, token, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(options.headers || {}) },
  });
  if (response.status === 204) return null;
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.detail || "Request failed");
  return payload;
}

function Status({ error, success }) {
  if (!error && !success) return null;
  return <p data-testid={error ? "admin-panel-error" : "admin-panel-success"} className={`mt-4 border p-3 text-sm ${error ? "border-red-500/40 bg-red-500/10 text-red-200" : "border-[#CCFF00]/40 bg-[#CCFF00]/10 text-[#E8FF80]"}`}>{error || success}</p>;
}

export function OverviewPanel({ setup, me }) {
  const items = [
    ["Database", setup?.database], ["Auth", setup?.auth], ["Storage", setup?.storage], ["Admin", Boolean(me)],
  ];
  return (
    <div data-testid="admin-overview-panel">
      <h2 className="text-4xl font-extrabold uppercase tracking-[-0.05em]">CMS Control Room</h2>
      <p className="mt-4 max-w-2xl text-neutral-400">Manage page content, services, clients, testimonials, media and enquiries from one place.</p>
      <div className="mt-10 grid gap-px border border-neutral-800 bg-neutral-800 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([label, active]) => (
          <div key={label} className="bg-[#0A0A0A] p-6" data-testid={`admin-status-${label.toLowerCase()}`}>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-neutral-500">{label}</p>
            <p className={`mt-5 text-2xl font-extrabold uppercase ${active ? "text-[#CCFF00]" : "text-red-300"}`}>{active ? "Ready" : "Missing"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PagesPanel({ token }) {
  const [content, setContent] = useState(null);
  const [section, setSection] = useState("home");
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    const data = await adminFetch("/admin/content", token);
    setContent(data);
  }, [token]);

  useEffect(() => { load().catch((e) => setError(e.message)); }, [load]);
  useEffect(() => { if (content?.[section]) setDraft(JSON.stringify(content[section], null, 2)); }, [content, section]);

  const save = async () => {
    setError(""); setSuccess("");
    try {
      const parsed = JSON.parse(draft);
      await adminFetch(`/admin/content/${section}`, token, { method: "PUT", body: JSON.stringify({ content: parsed }) });
      setContent((current) => ({ ...current, [section]: parsed }));
      setSuccess("Saved. The public website will use this content.");
    } catch (e) { setError(e.message); }
  };

  if (!content) return <p className="text-neutral-500">Loading page content...</p>;
  return (
    <div data-testid="admin-pages-panel">
      <h2 className="text-3xl font-extrabold uppercase tracking-[-0.04em]">Page content</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-500">Edit home images, counters, marquee slots, process cards, social links, contact options and About personality cards.</p>
      <div className="mt-8 flex flex-wrap gap-2">
        {Object.keys(content).map((key) => (
          <button key={key} data-testid={`content-section-${key}`} type="button" onClick={() => setSection(key)} className={`rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] ${section === key ? "border-[#CCFF00] bg-[#CCFF00] text-neutral-950" : "border-neutral-800 text-neutral-400"}`}>{key}</button>
        ))}
      </div>
      <textarea data-testid="page-content-editor" aria-label={`${section} content JSON editor`} value={draft} onChange={(e) => setDraft(e.target.value)} rows={22} className="editorial-input mt-8 min-h-[480px] font-mono text-sm" spellCheck="false" />
      <Status error={error} success={success} />
      <button data-testid="save-page-content-button" type="button" onClick={save} className="mt-6 rounded-full bg-[#CCFF00] px-6 py-3 text-sm font-extrabold uppercase tracking-[0.16em] text-neutral-950">Save content</button>
    </div>
  );
}

function FieldInput({ field, value, onChange, resource }) {
  const id = `${resource}-${field.name}`;
  if (field.type === "checkbox") {
    return <label className="flex items-center gap-3 text-sm text-neutral-300"><input id={id} data-testid={`${id}-input`} type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-[#CCFF00]" /> Published</label>;
  }
  if (field.type === "textarea" || field.type === "list") {
    return <textarea id={id} data-testid={`${id}-input`} value={field.type === "list" ? (value || []).join("\n") : value || ""} onChange={(e) => onChange(e.target.value)} rows={field.type === "list" ? 6 : 4} className="editorial-input resize-y" />;
  }
  return <input id={id} data-testid={`${id}-input`} type={field.type || "text"} value={value ?? ""} onChange={(e) => onChange(field.type === "number" ? Number(e.target.value) : e.target.value)} className="editorial-input" />;
}

export function CollectionPanel({ title, resource, fields, emptyItem, token }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    setItems(await adminFetch(`/admin/${resource}`, token));
  }, [resource, token]);

  useEffect(() => { load().catch((e) => setError(e.message)); }, [load]);

  const update = (name, value) => setForm((current) => ({ ...current, [name]: value }));
  const save = async () => {
    setError(""); setSuccess("");
    try {
      const payload = { ...form };
      fields.forEach((field) => {
        if (field.type === "list") payload[field.name] = String(payload[field.name] || "").split("\n").map((item) => item.trim()).filter(Boolean);
      });
      delete payload.id; delete payload.created_at; delete payload.updated_at; delete payload.image; delete payload.links;
      const id = form.id;
      const saved = await adminFetch(`/admin/${resource}${id && !String(id).startsWith("new") ? `/${id}` : ""}`, token, { method: id && !String(id).startsWith("new") ? "PUT" : "POST", body: JSON.stringify(payload) });
      setSuccess("Saved.");
      setForm(saved);
      await load();
    } catch (e) { setError(e.message); }
  };
  const remove = async () => {
    if (!form?.id || String(form.id).startsWith("new")) return;
    setError(""); setSuccess("");
    try { await adminFetch(`/admin/${resource}/${form.id}`, token, { method: "DELETE" }); setForm(null); setSuccess("Deleted."); await load(); } catch (e) { setError(e.message); }
  };

  return (
    <div data-testid={`admin-${resource}-panel`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-extrabold uppercase tracking-[-0.04em]">{title}</h2>
        <button data-testid={`new-${resource}-button`} type="button" onClick={() => setForm({ ...emptyItem, id: `new-${Date.now()}` })} className="inline-flex items-center gap-2 rounded-full bg-[#CCFF00] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.16em] text-neutral-950"><Plus className="h-4 w-4" /> New</button>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.35fr_0.65fr]">
        <div className="grid content-start gap-2">
          {items.map((item) => (
            <button key={item.id} data-testid={`${resource}-item-${item.id}`} type="button" onClick={() => setForm(item)} className={`border p-4 text-left transition-colors duration-300 ${form?.id === item.id ? "border-[#CCFF00] bg-[#CCFF00]/10" : "border-neutral-800 hover:border-neutral-600"}`}>
              <span className="block font-bold uppercase text-neutral-50">{item.name || item.client_name}</span>
              <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-neutral-500">{item.published ? "Published" : "Draft"}</span>
            </button>
          ))}
          {!items.length && <p className="border border-dashed border-neutral-800 p-5 text-neutral-500">No records yet.</p>}
        </div>
        <div className="border border-neutral-800 bg-neutral-950 p-6">
          {!form ? <p className="text-neutral-500">Select a record or create a new one.</p> : (
            <div className="grid gap-5">
              {fields.map((field) => (
                <div key={field.name}>
                  <label htmlFor={`${resource}-${field.name}`} className="mb-2 block font-mono text-xs uppercase tracking-[0.22em] text-neutral-500">{field.label}</label>
                  <FieldInput field={field} value={form[field.name]} onChange={(value) => update(field.name, value)} resource={resource} />
                </div>
              ))}
              <Status error={error} success={success} />
              <div className="flex flex-wrap gap-3">
                <button data-testid={`save-${resource}-button`} type="button" onClick={save} className="rounded-full bg-[#CCFF00] px-6 py-3 text-xs font-extrabold uppercase tracking-[0.16em] text-neutral-950">Save</button>
                <button data-testid={`delete-${resource}-button`} type="button" onClick={remove} className="inline-flex items-center gap-2 rounded-full border border-red-500/40 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-red-200"><Trash2 className="h-4 w-4" /> Delete</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function MediaPanel({ token }) {
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const load = useCallback(async () => setAssets(await adminFetch("/admin/media", token)), [token]);
  useEffect(() => { load().catch((e) => setError(e.message)); }, [load]);
  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(""); setSuccess("");
    const body = new FormData(); body.append("file", file);
    const response = await fetch(`${API}/admin/media`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) setError(payload.detail || "Upload failed"); else { setSuccess("Image uploaded."); await load(); }
  };
  return (
    <div data-testid="admin-media-panel">
      <h2 className="text-3xl font-extrabold uppercase tracking-[-0.04em]">Media library</h2>
      <label data-testid="media-upload-label" className="mt-8 flex min-h-44 cursor-pointer flex-col items-center justify-center border border-dashed border-neutral-700 text-neutral-400 transition-colors duration-300 hover:border-[#CCFF00] hover:text-[#CCFF00]">
        <Upload className="mb-3 h-8 w-8" /> Upload JPEG, PNG, WebP or GIF up to 5 MB
        <input data-testid="media-upload-input" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={upload} className="hidden" />
      </label>
      <Status error={error} success={success} />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <div key={asset.id} className="border border-neutral-800 bg-neutral-950 p-3">
            <img src={asset.public_url} alt="CMS asset" className="aspect-video w-full object-cover" />
            <button data-testid={`copy-media-${asset.id}`} type="button" onClick={() => navigator.clipboard.writeText(asset.public_url)} className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#CCFF00]"><Copy className="h-4 w-4" /> Copy URL</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EnquiriesPanel({ token }) {
  const [items, setItems] = useState([]); const [error, setError] = useState("");
  const load = useCallback(async () => setItems(await adminFetch("/admin/enquiries", token)), [token]);
  useEffect(() => { load().catch((e) => setError(e.message)); }, [load]);
  const update = async (id, status) => { await adminFetch(`/admin/enquiries/${id}`, token, { method: "PATCH", body: JSON.stringify({ status }) }); await load(); };
  return (
    <div data-testid="admin-enquiries-panel">
      <div className="flex items-center justify-between"><h2 className="text-3xl font-extrabold uppercase tracking-[-0.04em]">Enquiries</h2><button data-testid="refresh-enquiries-button" type="button" onClick={load} className="rounded-full border border-neutral-800 p-3 text-neutral-300"><RefreshCcw className="h-4 w-4" /></button></div>
      <Status error={error} />
      <div className="mt-8 grid gap-4">
        {items.map((item) => (
          <article key={item.id} className="border border-neutral-800 bg-neutral-950 p-5" data-testid={`enquiry-${item.id}`}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div><h3 className="text-xl font-extrabold uppercase">{item.name} — {item.brand}</h3><p className="mt-2 text-sm text-[#CCFF00]">{item.service}</p><p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-400">{item.message}</p><p className="mt-4 text-xs text-neutral-500">{item.email} · {item.phone}</p></div>
              <select data-testid={`enquiry-status-${item.id}`} value={item.status} onChange={(e) => update(item.id, e.target.value)} className="editorial-input max-w-44"><option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option><option value="archived">Archived</option></select>
            </div>
          </article>
        ))}
        {!items.length && !error && <p className="border border-dashed border-neutral-800 p-8 text-neutral-500">No enquiries yet.</p>}
      </div>
    </div>
  );
}
