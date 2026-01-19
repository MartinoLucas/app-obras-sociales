// app/(dashboard)/inscripcion/page.tsx
'use client';

export default function InscripcionPage() {
  async function act(kind: 'enroll'|'unenroll') {
    const res = await fetch('/api/enrollment', { method: 'POST', body: JSON.stringify({ kind }), headers: { 'Content-Type': 'application/json' }});
    const j = await res.json();
    if (!res.ok) alert(j.error); else alert('Operación realizada');
  }
  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Inscripción / Baja (1–25)</h1>
      <div className="flex gap-3">
        <button onClick={() => act('enroll')} className="px-4 py-2 border rounded">Inscribirme</button>
        <button onClick={() => act('unenroll')} className="px-4 py-2 border rounded">Darme de baja</button>
      </div>
    </main>
  );
}
