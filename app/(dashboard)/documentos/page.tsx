'use client';

export default function DocumentosPage() {
  async function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch('/api/documents/upload', { method: 'POST', body: fd });
    const j = await res.json();
    if (!res.ok) alert(j.error); else alert('Documento subido');
    (e.currentTarget as HTMLFormElement).reset();
  }
  return (
    <main className="max-w-md mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-bold">Documentación (plazo 3 meses)</h1>
      <form onSubmit={upload} className="space-y-2">
        <select name="kind" className="border rounded p-2 w-full">
          <option value="prestadores">Registro Nacional de Prestadores</option>
          <option value="mala_praxis">Seguro Mala Praxis (hoja 1)</option>
          <option value="monotributo">Constancia de Monotributo</option>
          <option value="habilitacion">Habilitación de Consultorio</option>
        </select>
        <input type="file" name="file" className="w-full" />
        <button className="px-4 py-2 border rounded">Subir</button>
      </form>
    </main>
  );
}
