"use client";

import { useEffect, useState } from "react";
import { MODELS } from "../../lib/adminContent";
import type { Field, ModelConfig } from "../../lib/adminContent";
import { readImage } from "../../lib/image";
import SafeImg from "./SafeImg";

type Row = Record<string, unknown> & { id: number };
type Option = { value: number; label: string };
type FormValues = Record<string, string | boolean>;
type Loaded = { key: string; rows: Row[]; options: Record<string, Option[]> };

function emptyForm(model: ModelConfig): FormValues {
  const form: FormValues = {};
  for (const f of model.fields) {
    if (f.type === "bool") form[f.name] = true;
    else if (f.type === "select") form[f.name] = f.options![0];
    else form[f.name] = "";
  }
  return form;
}

function rowToForm(model: ModelConfig, row: Row): FormValues {
  const form: FormValues = {};
  for (const f of model.fields) {
    const v = row[f.name];
    if (f.type === "bool") form[f.name] = Boolean(v);
    else form[f.name] = v === null || v === undefined || f.type === "upload" ? "" : String(v);
  }
  return form;
}

function send(key: string, method: string, body?: unknown, query = "") {
  return fetch(`/api/admin/content/${key}${query}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

export default function ContentManager() {
  const [modelKey, setModelKey] = useState(MODELS[0].key);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormValues>(() => emptyForm(MODELS[0]));
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [fileKey, setFileKey] = useState(0);

  const model = MODELS.find((m) => m.key === modelKey)!;
  const rows = loaded?.key === modelKey ? loaded.rows : [];
  const options = loaded?.key === modelKey ? loaded.options : {};

  useEffect(() => {
    resetForm();
    loadData(modelKey);
  }, [modelKey]);

  async function loadData(key: string) {
    const res = await fetch(`/api/admin/content/${key}`);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return alert(data.message ?? "Gagal memuat data (kode " + res.status + ").");
    }
    const data = await res.json();
    setLoaded({ key, rows: data.rows, options: data.options });
  }

  function resetForm() {
    setEditId(null);
    setForm(emptyForm(model));
    setFiles({});
    setFileKey((k) => k + 1);
  }

  function setValue(name: string, value: string | boolean) {
    setForm({ ...form, [name]: value });
  }

  function handleEdit(row: Row) {
    setEditId(row.id);
    setForm(rowToForm(model, row));
    setFiles({});
    setFileKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus data ini?")) return;
    const res = await send(modelKey, "DELETE", undefined, `?id=${id}`);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return alert(data.message ?? "Gagal menghapus.");
    }
    await loadData(modelKey);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!confirm(editId !== null ? "Simpan perubahan?" : "Tambah data baru?")) return;

    const body: Record<string, unknown> = { ...form, id: editId };

    for (const f of model.fields) {
      const file = files[f.name];
      if (!file) continue;

      let dataUrl: string;
      try {
        dataUrl = await readImage(file, 1000);
      } catch {
        return alert("File yang dipilih bukan gambar yang valid.");
      }

      if (f.type === "upload") {
        body[f.name] = dataUrl;
        continue;
      }

      const alt = String(form.title || form.label || form.platform || f.label);
      const res = await send("media", "POST", { url: dataUrl, alt });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return alert(data.message ?? "Gagal mengunggah gambar.");
      }
      body[f.name] = (await res.json()).id;
    }

    const res = await send(modelKey, editId !== null ? "PATCH" : "POST", body);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return alert(data.message ?? "Gagal menyimpan.");
    }
    await loadData(modelKey);
    resetForm();
  }

  function renderInput(f: Field) {
    const value = form[f.name];

    if (f.type === "bool") {
      return <input type="checkbox" checked={Boolean(value)} onChange={(e) => setValue(f.name, e.target.checked)} />;
    }
    if (f.type === "textarea") {
      return (
        <textarea rows={4} required={!f.optional} value={String(value)}
          onChange={(e) => setValue(f.name, e.target.value)} />
      );
    }
    if (f.type === "number") {
      return (
        <input type="number" min={0} required={!f.optional} value={String(value)}
          onChange={(e) => setValue(f.name, e.target.value)} />
      );
    }
    if (f.type === "select") {
      return (
        <select value={String(value)} onChange={(e) => setValue(f.name, e.target.value)}>
          {f.options!.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      );
    }
    if (f.type === "relation") {
      return (
        <select required={!f.optional} value={String(value)} onChange={(e) => setValue(f.name, e.target.value)}>
          <option value="">-- pilih --</option>
          {(options[f.name] ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
    }
    if (f.type === "image" || f.type === "upload") {
      const current = editId !== null ? rows.find((r) => r.id === editId) : undefined;
      const url = current
        ? f.type === "upload" ? current[f.name] : (current[f.rel!] as { url: string } | null)?.url
        : null;
      return (
        <>
          {typeof url === "string" && <SafeImg src={url} className="thumb" />}
          <input key={fileKey} type="file" accept="image/*" required={editId === null && !f.optional}
            onChange={(e) => setFiles({ ...files, [f.name]: e.target.files?.[0] ?? null })} />
          {editId !== null && <small>Kosongkan jika tidak ingin mengganti gambar.</small>}
        </>
      );
    }
    return (
      <input type="text" required={!f.optional} disabled={editId !== null && f.locked}
        value={String(value)} onChange={(e) => setValue(f.name, e.target.value)} />
    );
  }

  function showCell(f: Field, row: Row) {
    const v = row[f.name];
    if (f.type === "upload") return <SafeImg src={String(v)} className="thumb" />;
    if (f.type === "image") {
      const img = row[f.rel!] as { url: string } | null;
      return img ? <SafeImg src={img.url} className="thumb" /> : "-";
    }
    if (f.type === "bool") return v ? "Ya" : "Tidak";
    if (f.type === "relation") return options[f.name]?.find((o) => o.value === v)?.label ?? String(v);
    const text = v === null || v === undefined ? "-" : String(v);
    return text.length > 60 ? text.slice(0, 60) + "..." : text;
  }

  return (
    <>
      <h1>Konten Situs</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {MODELS.map((m) => (
          <button key={m.key} className="btn-add" style={{ opacity: m.key === modelKey ? 1 : 0.5 }}
            onClick={() => setModelKey(m.key)}>
            {m.label}
          </button>
        ))}
      </div>
      <p>{model.desc}</p>

      {(model.canAdd || editId !== null) ? (
        <form className="admin-form" onSubmit={handleSubmit}>
          {model.fields.map((f) => (
            <label key={f.name}
              style={{ display: "flex", flexDirection: "column", flex: "1 1 240px", gap: 4, fontSize: 13 }}>
              {f.label}{f.optional ? " (opsional)" : ""}
              {renderInput(f)}
            </label>
          ))}
          <button type="submit" className="btn-add" id="saveBtn">
            {editId !== null ? "Simpan perubahan" : "Tambah data"}
          </button>
          {editId !== null && (
            <button type="button" className="btn-del" id="cancelBtn" onClick={resetForm}>
              Batal
            </button>
          )}
        </form>
      ) : (
        <p><em>Bagian ini hanya bisa diedit. Klik Edit pada baris di bawah.</em></p>
      )}

      <table>
        <thead>
          <tr>
            {model.columns.map((c) => <th key={c}>{model.fields.find((f) => f.name === c)!.label}</th>)}
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {model.columns.map((c) => (
                <td key={c}>{showCell(model.fields.find((f) => f.name === c)!, row)}</td>
              ))}
              <td>
                <button className="btn-add" onClick={() => handleEdit(row)}>Edit</button>
                {model.canDelete && (
                  <button className="btn-del" onClick={() => handleDelete(row.id)}>Hapus</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}