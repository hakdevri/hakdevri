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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    window.location.href = "/";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f5f7]">
        <p className="text-sm text-black/40">
          Profil yükleniyor...
        </p>
      </main>
    );
  }

  const firstLetter =
    profile?.full_name?.trim()?.charAt(0)?.toUpperCase() || "H";

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#111]">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-5">

          {/* LOGO */}
          <a
            href="/"
            className="text-[22px] font-semibold tracking-[-0.07em]"
          >
            HAK<span className="font-normal">DEVRİ</span>
          </a>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-8 text-[13px] md:flex">
            <a
              href="/"
              className="text-black/55 transition hover:text-black"
            >
              Ana Sayfa
            </a>

            <a
              href="/discover"
              className="font-medium text-black transition hover:text-black/60"
            >
              Pazaryeri
            </a>

            <a
              href="/rights"
              className="text-black/55 transition hover:text-black"
            >
              Haklarım
            </a>

            <a
              href="/transfers"
              className="text-black/55 transition hover:text-black"
            >
              Devirlerim
            </a>

            <a
              href="/transactions"
              className="text-black/55 transition hover:text-black"
            >
              İşlemlerim
            </a>
          </nav>

          {/* DESKTOP RIGHT */}
          <div className="hidden items-center gap-2 md:flex">

            <a
              href="/discover"
              className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-[13px] font-medium transition hover:bg-black/5"
            >
              Pazaryeri
            </a>

            <a
              href="/transfers"
              className="rounded-full bg-black px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-black/80"
            >
              İlan Ver
            </a>

            <button
              type="button"
              onClick={logout}
              className="px-2 text-[13px] text-black/40 transition hover:text-black"
            >
              Çıkış
            </button>

          </div>

          {/* MOBILE */}
          <div className="flex items-center gap-2 md:hidden">

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menüyü aç"
              aria-expanded={mobileMenuOpen}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white"
            >
              <div className="flex w-5 flex-col gap-1.5">
                <span
                  className={`block h-[1.5px] w-full bg-black transition ${
                    mobileMenuOpen
                      ? "translate-y-[4px] rotate-45"
                      : ""
                  }`}
                />

                <span
                  className={`block h-[1.5px] w-full bg-black transition ${
                    mobileMenuOpen ? "opacity-0" : ""
                  }`}
                />

                <span
                  className={`block h-[1.5px] w-full bg-black transition ${
                    mobileMenuOpen
                      ? "-translate-y-[4px] -rotate-45"
                      : ""
                  }`}
                />
              </div>
            </button>

          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="border-t border-black/[0.06] bg-white px-5 pb-6 pt-3 md:hidden">

            <nav className="flex flex-col">

              <a
                href="/"
                className="border-b border-black/[0.06] py-4 text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ana Sayfa
              </a>

              <a
                href="/discover"
                className="border-b border-black/[0.06] py-4 text-base font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pazaryeri
              </a>

              <a
                href="/rights"
                className="border-b border-black/[0.06] py-4 text-base text-black/65"
                onClick={() => setMobileMenuOpen(false)}
              >
                Haklarım
              </a>

              <a
                href="/transfers"
                className="border-b border-black/[0.06] py-4 text-base text-black/65"
                onClick={() => setMobileMenuOpen(false)}
              >
                Devirlerim
              </a>

              <a
                href="/transactions"
                className="border-b border-black/[0.06] py-4 text-base text-black/65"
                onClick={() => setMobileMenuOpen(false)}
              >
                İşlemlerim
              </a>

              <a
                href="/discover"
                className="mt-4 rounded-full bg-black px-5 py-3.5 text-center text-sm font-medium text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pazaryerini Keşfet
              </a>

              <button
                type="button"
                onClick={logout}
                className="mt-3 py-3 text-center text-sm text-black/45"
              >
                Çıkış Yap
              </button>

            </nav>

          </div>
        )}
      </header>

      {/* CONTENT */}
      <div className="mx-auto max-w-6xl px-5 py-8 md:py-14">

        {/* BREADCRUMB */}
        <div className="mb-6 flex items-center gap-2 text-xs text-black/40">
          <a
            href="/"
            className="transition hover:text-black"
          >
            Ana Sayfa
          </a>

          <span>→</span>

          <span className="text-black/65">
            Profilim
          </span>
        </div>

        {/* PROFILE HERO */}
        <section className="overflow-hidden rounded-[2rem] border border-black/[0.07] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.05)]">

          <div className="border-b border-black/[0.06] px-6 py-8 md:px-10 md:py-10">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-5">

                {/* AVATAR */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-black text-xl font-semibold text-white md:h-20 md:w-20 md:text-2xl">
                  {firstLetter}
                </div>

                <div>

                  <p className="text-xs font-medium tracking-[0.18em] text-black/35">
                    HAKDEVRİ HESABI
                  </p>

                  <h1 className="mt-1 text-2xl font-semibold tracking-[-0.05em] md:text-3xl">
                    {profile?.full_name || "Profilim"}
                  </h1>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-black/45">
                      Hesabınız aktif
                    </span>
                  </div>

                </div>

              </div>

              <a
                href="/transfers"
                className="rounded-full bg-black px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-black/80"
              >
                + Yeni İlan Ver
              </a>

            </div>

          </div>

          {/* INFO */}
          <div className="p-6 md:p-10">

            <div className="mb-6">

              <p className="text-xs font-medium tracking-[0.16em] text-black/35">
                HESAP BİLGİLERİ
              </p>

              <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">
                Kişisel Bilgiler
              </h2>

            </div>

            <div className="grid gap-4 md:grid-cols-2">

              {/* NAME */}
              <div className="rounded-2xl bg-[#f7f7f5] p-5">

                <p className="text-xs text-black/40">
                  Ad Soyad
                </p>

                <p className="mt-2 font-medium">
                  {profile?.full_name || "Belirtilmemiş"}
                </p>

              </div>

              {/* PHONE */}
              <div className="rounded-2xl bg-[#f7f7f5] p-5">

                <p className="text-xs text-black/40">
                  Telefon
                </p>

                <p className="mt-2 font-medium">
                  {profile?.phone || "Belirtilmemiş"}
                </p>

              </div>

              {/* ROLE */}
              <div className="rounded-2xl bg-[#f7f7f5] p-5">

                <p className="text-xs text-black/40">
                  Hesap Tipi
                </p>

                <p className="mt-2 font-medium capitalize">
                  {profile?.role || "Kullanıcı"}
                </p>

              </div>

              {/* STATUS */}
              <div className="rounded-2xl bg-[#f7f7f5] p-5">

                <p className="text-xs text-black/40">
                  Hesap Durumu
                </p>

                <div className="mt-2 flex items-center gap-2">

                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  <span className="font-medium">
                    Aktif
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* QUICK ACCESS */}
        <section className="mt-8">

          <div className="mb-5">

            <p className="text-xs font-medium tracking-[0.16em] text-black/35">
              HIZLI ERİŞİM
            </p>

            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
              HakDevri işlemleriniz
            </h2>

          </div>

          <div className="grid gap-4 md:grid-cols-3">

            {/* HAKLARIM */}
            <a
              href="/rights"
              className="group rounded-[1.5rem] border border-black/[0.07] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-lg text-white">
                  ◇
                </div>

                <span className="text-xl text-black/20 transition group-hover:translate-x-1 group-hover:text-black">
                  →
                </span>

              </div>

              <h3 className="mt-6 text-lg font-semibold">
                Haklarım
              </h3>

              <p className="mt-2 text-sm leading-6 text-black/45">
                Sahip olduğunuz dijital hakları ve yayınladığınız ilanları görüntüleyin.
              </p>

            </a>

            {/* DEVİRLERİM */}
            <a
              href="/transfers"
              className="group rounded-[1.5rem] border border-black/[0.07] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-lg text-white">
                  ↗️
                </div>

                <span className="text-xl text-black/20 transition group-hover:translate-x-1 group-hover:text-black">
                  →
                </span>

              </div>

              <h3 className="mt-6 text-lg font-semibold">
                Devirlerim
              </h3>

              <p className="mt-2 text-sm leading-6 text-black/45">
                Yayındaki haklarınızı, devir ilanlarınızı ve satış süreçlerinizi yönetin.
              </p>

            </a>

            {/* İŞLEMLERİM */}
            <a
              href="/transactions"
              className="group rounded-[1.5rem] border border-black/[0.07] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-lg text-white">
                  ✓
                </div>

                <span className="text-xl text-black/20 transition group-hover:translate-x-1 group-hover:text-black">
                  →
                </span>

              </div>

              <h3 className="mt-6 text-lg font-semibold">
                İşlemlerim
              </h3>

              <p className="mt-2 text-sm leading-6 text-black/45">
                Gerçekleştirdiğiniz devir, ödeme ve diğer hesap işlemlerini takip edin.
              </p>

            </a>

          </div>

        </section>

        {/* MARKETPLACE CTA */}
        <section className="mt-8 overflow-hidden rounded-[2rem] bg-black px-6 py-8 text-white md:px-10 md:py-10">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-xs font-medium tracking-[0.18em] text-white/40">
                HAKDEVRİ PAZARYERİ
              </p>

              <h2 className="mt-2 max-w-xl text-2xl font-semibold tracking-[-0.04em] md:text-3xl">
                Yeni haklar keşfetmeye hazır mısınız?
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
                Farklı dijital hakları inceleyin, size uygun fırsatları keşfedin ve güvenli şekilde işlem yapın.
              </p>

            </div>

            <a
              href="/discover"
              className="shrink-0 rounded-full bg-white px-6 py-3.5 text-center text-sm font-medium text-black transition hover:bg-white/90"
            >
              Pazaryerini Keşfet →
            </a>

          </div>

        </section>

        {/* LOGOUT */}
        <div className="mt-8 flex justify-center md:justify-end">

          <button
            type="button"
            onClick={logout}
            className="text-sm text-black/35 transition hover:text-black"
          >
            Hesaptan Çıkış Yap
          </button>

        </div>

      </div>

      {/* FOOTER */}
      <footer className="border-t border-black/[0.06] px-5 py-8">

        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-xs text-black/35 md:flex-row md:items-center md:justify-between">

          <p>
            © 2026 HakDevri. Tüm hakları saklıdır.
          </p>

          <div className="flex flex-wrap gap-5">

            <a
              href="/"
              className="transition hover:text-black"
            >
              Ana Sayfa
            </a>

            <a
              href="/discover"
              className="transition hover:text-black"
            >
              Pazaryeri
            </a>

            <a
              href="/rights"
              className="transition hover:text-black"
            >
              Haklarım
            </a>

            <a
              href="/transactions"
              className="transition hover:text-black"
            >
              İşlemlerim
            </a>

          </div>

        </div>

      </footer>

    </main>
  );
}