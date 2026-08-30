"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Profile = {
  full_name: string | null;
  phone: string | null;
  role: string | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const result = await supabase.auth.getUser();
    const user = result.data.user;

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    const profileResult = await supabase
      .from("profiles")
      .select("full_name, phone, role")
      .eq("id", user.id)
      .single();

    if (profileResult.error) {
      console.error(profileResult.error);
    } else {
      setProfile(profileResult.data);
    }

    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5]">
        <p className="text-sm text-black/40">
          Profil yükleniyor...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-5 py-10 text-[#111]">
      <div className="mx-auto max-w-3xl">

        <header className="mb-10 flex items-center justify-between">
          <a
            href="/"
            className="text-lg font-bold tracking-[-0.04em]"
          >
            HAK<span className="font-normal">DEVRİ</span>
          </a>

          <button
            type="button"
            onClick={logout}
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium"
          >
            Çıkış Yap
          </button>
        </header>

        <section className="rounded-[2rem] border border-black/10 bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.05)] md:p-10">

          <p className="text-xs font-medium tracking-widest text-black/35">
            PROFİLİM
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
            Hoş geldin
            {profile?.full_name
              ? ", " + profile.full_name
              : ""}
            .
          </h1>

          <div className="mt-8 grid gap-4 md:grid-cols-2">

            <div className="rounded-2xl bg-[#f7f7f5] p-5">
              <p className="text-xs text-black/40">
                Ad Soyad
              </p>

              <p className="mt-2 font-medium">
                {profile?.full_name || "Belirtilmemiş"}
              </p>
            </div>

            <div className="rounded-2xl bg-[#f7f7f5] p-5">
              <p className="text-xs text-black/40">
                Telefon
              </p>

              <p className="mt-2 font-medium">
                {profile?.phone || "Belirtilmemiş"}
              </p>
            </div>

            <div className="rounded-2xl bg-[#f7f7f5] p-5">
              <p className="text-xs text-black/40">
                Hesap Tipi
              </p>

              <p className="mt-2 font-medium">
                {profile?.role || "user"}
              </p>
            </div>

            <div className="rounded-2xl bg-[#f7f7f5] p-5">
              <p className="text-xs text-black/40">
                Hesap Durumu
              </p>

              <p className="mt-2 font-medium">
                Aktif
              </p>
            </div>

          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">

            <a
              href="#"
              className="rounded-xl border border-black/10 px-4 py-4 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              Haklarım
            </a>

            <a
              href="#"
              className="rounded-xl border border-black/10 px-4 py-4 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              Devirlerim
            </a>

            <a
              href="#"
              className="rounded-xl border border-black/10 px-4 py-4 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              İşlemlerim
            </a>

          </div>

        </section>
      </div>
    </main>
  );
}