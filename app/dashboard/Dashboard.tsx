'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Filters {
  from: string;
  to: string;
  family: string;
}

export default function Dashboard() {
  const supabase = createClientComponentClient();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [family, setFamily] = useState('');

  const [mesAchats, setMesAchats] = useState<any[]>([]);
  const [pourMoi, setPourMoi] = useState<any[]>([]);
  const [pourLesAutres, setPourLesAutres] = useState<any[]>([]);
  const [vueGlobale, setVueGlobale] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const filters: Filters = { from, to, family };

      const { data: mes } = await supabase.rpc('dashboard_mes_achats', filters);
      const { data: moi } = await supabase.rpc('dashboard_pour_moi', filters);
      const { data: autres } = await supabase.rpc('dashboard_pour_les_autres', filters);
      const { data: global } = await supabase.rpc('dashboard_vue_globale', filters);

      setMesAchats(mes ?? []);
      setPourMoi(moi ?? []);
      setPourLesAutres(autres ?? []);
      setVueGlobale(global ?? []);
    };

    fetchData();
  }, [from, to, family, supabase]);

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div className="flex gap-4 items-end">
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={family}
          onChange={(e) => setFamily(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Toutes les familles</option>
          <option value="familleA">Famille A</option>
          <option value="familleB">Famille B</option>
        </select>
      </div>

      <section>
        <h2 className="text-lg font-semibold">Mes achats</h2>
        <pre>{JSON.stringify(mesAchats, null, 2)}</pre>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Pour moi</h2>
        <pre>{JSON.stringify(pourMoi, null, 2)}</pre>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Pour les autres</h2>
        <pre>{JSON.stringify(pourLesAutres, null, 2)}</pre>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Vue globale</h2>
        <pre>{JSON.stringify(vueGlobale, null, 2)}</pre>
      </section>
    </div>
  );
}

