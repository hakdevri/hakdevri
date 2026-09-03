"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Right = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  purchase_price: number | null;
  transfer_price: number | null;
  valid_from: string | null;
  valid_until: string | null;
};

export default function RightsPage() {
  const [rights, setRights] = useState<Right[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadRights();
  }, []);

  async function loadRights() {
    setLoading(true);
    setErrorMessage("");

    const userResult = await supabase.auth.getUser();
    const user = userResult.data.user;

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    const rightsResult = await supabase
      .from("rights")
      .select(
        "id, title, description, category, status, purchase_price, transfer_price, valid_from, valid_until"
      )
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (rightsResult.error) {
      console.error(rightsResult.error);
      setErrorMessage("Haklar yüklenirken bir hata oluştu.");
      setLoading(false);
      return;
    }

    setRights(rightsResult.data || []);
    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  function formatPrice(price: number | null) {
    if (price === null) {
      return "Belirtilmemiş";
    }

    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(price);
  }

  function formatDate(date: string | null) {
    if (!date) {
      return "Belirtilmemiş";
    }

    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  }

  function getStatusText(status: string) {
    switch (status) {
      case "active":
        return "Aktif";
      case "used":
        return "Kullanıldı";
      case "transferred":
        return "Devredildi";
      case "cancelled":
        return "İptal";
      default:
        return status;
    }
  }

  function getStatusStyle(status: string) {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border-green-100";
      case "used":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "transferred":
        return "bg-gray-100 text-gray-600 border-gray-200";
      case "cancelled":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  }

  function getTransferUrl(id: string) {
    return "/rights/transfer?id=" + encodeURIComponent(id);
  }

  const activeRights = rights.filter(
    (right) => right.status === "active"
  ).length;

  const transferableRights = rights.filter(
    (right) =>
      right.status === "active" &&
      right.transfer_price !== null
  ).length;

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#111]">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#f7f7f5]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-5">

          <div className="flex h-20 items-center justify-between">

            <a
              href="/"
              className="text-xl font-bold tracking-[-0.05em]"
            >
              HAK<span className="font-normal">DEVRİ</span>
            </a>

            {/* DESKTOP NAV */}
            <nav className="hidden items-center gap-7 md:flex">

              <a
                href="/"
                className="text-sm text-black/50 transition hover:text-black"
              >
                Ana Sayfa
              </a>

              <a
                href="/discover"
                className="text-sm text-black/50 transition hover:text-black"
              >
                Pazaryeri
              </a>

              <a
                href="/rights"
                className="text-sm font-medium text-black"
              >
                Haklarım
              </a>

              <a
                href="/transfers"
                className="text-sm text-black/50 transition hover:text-black"
              >
                Devirlerim
              </a>

              <a
                href="/transactions"
                className="text-sm text-black/50 transition hover:text-black"
              >
                İşlemlerim
              </a>

            </nav>

            {/* DESKTOP ACTIONS */}
            <div className="hidden items-center gap-3 md:flex">

              <a
                href="/transfers"
                className="rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black/80"
              >
                + İlan Ver
              </a>

              <a
                href="/profile"
                className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium transition hover:border-black/20"
              >
                Profilim
              </a>

            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(!mobileMenuOpen)
              }
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 bg-white md:hidden"
              aria-label="Menüyü aç"
            >
              {mobileMenuOpen ? (
                <span className="text-2xl leading-none">
                  ×
                </span>
              ) : (
                <span className="text-lg">
                  ☰
                </span>
              )}
            </button>

          </div>

          {/* MOBILE MENU */}
          {mobileMenuOpen && (
            <div className="border-t border-black/[0.06] py-5 md:hidden">

              <nav className="flex flex-col gap-1">

                <a
                  href="/"
                  className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-white"
                >
                  Ana Sayfa
                </a>

                <a
                  href="/discover"
                  className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-white"
                >
                  Pazaryeri
                </a>

                <a
                  href="/rights"
                  className="rounded-xl bg-white px-4 py-3 text-sm font-medium"
                >
                  Haklarım
                </a>

                <a
                  href="/transfers"
                  className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-white"
                >
                  Devirlerim
                </a>

                <a
                  href="/transactions"
                  className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-white"
                >
                  İşlemlerim
                </a>

                <a
                  href="/profile"
                  className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-white"
                >
                  Profilim
                </a>

                <a
                  href="/transfers"
                  className="mt-2 rounded-xl bg-black px-4 py-3 text-center text-sm font-medium text-white"
                >
                  + İlan Ver
                </a>

                <button
                  type="button"
                  onClick={logout}
                  className="rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Çıkış Yap
                </button>

              </nav>

            </div>
          )}

        </div>
      </header>

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl px-5 py-8 md:py-12">

        {/* BREADCRUMB */}
        <div className="mb-8 flex items-center gap-2 text-xs text-black/35">

          <a
            href="/"
            className="transition hover:text-black"
          >
            Ana Sayfa
          </a>

          <span>/</span>

          <span className="text-black/60">
            Haklarım
          </span>

        </div>

        {/* HERO */}
        <section className="mb-10">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <p className="text-xs font-medium tracking-[0.2em] text-black/35">
                DİJİTAL CÜZDAN
              </p>

              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] md:text-5xl">
                Haklarım
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-black/50">
                Sahip olduğun hakları görüntüle, kullanım sürelerini
                takip et ve uygun olanları güvenli şekilde devret.
              </p>

            </div>

            <a
              href="/discover"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/80"
            >
              Pazaryerini Keşfet
              <span>→</span>
            </a>

          </div>

        </section>

        {/* STATS */}
        {!loading && !errorMessage && (
          <section className="mb-8 grid gap-3 sm:grid-cols-3">

            <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">

              <p className="text-xs text-black/40">
                Toplam Hak
              </p>

              <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                {rights.length}
              </p>

            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">

              <p className="text-xs text-black/40">
                Aktif Hak
              </p>

              <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                {activeRights}
              </p>

            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">

              <p className="text-xs text-black/40">
                Devre Hazır
              </p>

              <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                {transferableRights}
              </p>

            </div>

          </section>
        )}

        {/* LOADING */}
        {loading && (
          <div className="rounded-[2rem] border border-black/10 bg-white p-12 text-center shadow-[0_20px_60px_rgba(0,0,0,0.04)]">

            <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-black/10" />

            <p className="mt-5 text-sm text-black/40">
              Hakların yükleniyor...
            </p>

          </div>
        )}

        {/* ERROR */}
        {!loading && errorMessage && (
          <div className="rounded-[2rem] border border-red-200 bg-white p-10 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              !
            </div>

            <h2 className="mt-5 text-lg font-semibold">
              Bir sorun oluştu
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={loadRights}
              className="mt-6 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
            >
              Tekrar Dene
            </button>

          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !errorMessage &&
          rights.length === 0 && (
            <div className="rounded-[2rem] border border-black/10 bg-white p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.04)] md:p-16">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f7f7f5] text-2xl">
                +
              </div>

              <h2 className="mt-6 text-2xl font-semibold tracking-[-0.04em]">
                Henüz bir hakkın yok
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-black/45">
                Pazaryerindeki fırsatları keşfederek ilk hakkını
                satın aldığında burada görüntüleyebilirsin.
              </p>

              <a
                href="/discover"
                className="mt-7 inline-flex rounded-xl bg-black px-6 py-3 text-sm font-medium text-white"
              >
                Pazaryerini Keşfet
              </a>

            </div>
          )}

        {/* RIGHTS LIST */}
        {!loading &&
          !errorMessage &&
          rights.length > 0 && (
            <section>

              <div className="mb-5">

                <h2 className="text-xl font-semibold tracking-[-0.03em]">
                  Haklarınız
                </h2>

                <p className="mt-1 text-sm text-black/40">
                  Hesabına kayıtlı haklar
                </p>

              </div>

              <div className="grid gap-5 lg:grid-cols-2">

                {rights.map((right) => {

                  const isActive =
                    right.status === "active";

                  const canTransfer =
                    isActive &&
                    right.transfer_price !== null;

                  const transferUrl =
                    getTransferUrl(right.id);

                  return (
                    <article
                      key={right.id}
                      className="group overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_15px_45px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.07)]"
                    >

                      <div className="p-6 md:p-7">

                        {/* TITLE */}
                        <div className="flex items-start justify-between gap-4">

                          <div className="min-w-0">

                            <span className="inline-flex rounded-full bg-black px-3 py-1.5 text-[11px] font-medium text-white">
                              {right.category}
                            </span>

                            <h3 className="mt-4 text-xl font-semibold leading-tight tracking-[-0.04em] md:text-2xl">
                              {right.title}
                            </h3>

                          </div>

                          <span
                            className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-medium ${getStatusStyle(
                              right.status
                            )}`}
                          >
                            {getStatusText(right.status)}
                          </span>

                        </div>

                        {/* DESCRIPTION */}
                        {right.description && (
                          <p className="mt-4 text-sm leading-6 text-black/50">
                            {right.description}
                          </p>
                        )}

                        {/* PRICES */}
                        <div className="mt-6 grid grid-cols-2 gap-3">

                          <div className="rounded-2xl bg-[#f7f7f5] p-4">

                            <p className="text-xs text-black/40">
                              Alış Değeri
                            </p>

                            <p className="mt-1.5 text-sm font-semibold">
                              {formatPrice(
                                right.purchase_price
                              )}
                            </p>

                          </div>

                          <div className="rounded-2xl bg-[#f7f7f5] p-4">

                            <p className="text-xs text-black/40">
                              Devir Değeri
                            </p>

                            <p className="mt-1.5 text-sm font-semibold">
                              {formatPrice(
                                right.transfer_price
                              )}
                            </p>

                          </div>

                        </div>

                        {/* DATES */}
                        <div className="mt-3 grid grid-cols-2 gap-3">

                          <div className="rounded-2xl border border-black/10 p-4">

                            <p className="text-xs text-black/40">
                              Başlangıç
                            </p>

                            <p className="mt-1.5 text-sm font-medium">
                              {formatDate(
                                right.valid_from
                              )}
                            </p>

                          </div>

                          <div className="rounded-2xl border border-black/10 p-4">

                            <p className="text-xs text-black/40">
                              Son Kullanım
                            </p>

                            <p className="mt-1.5 text-sm font-medium">
                              {formatDate(
                                right.valid_until
                              )}
                            </p>

                          </div>

                        </div>

                        {/* ACTIONS */}
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">

                          <a
                            href={
                              canTransfer
                                ? transferUrl
                                : "#"
                            }
                            className={`rounded-xl px-5 py-3 text-center text-sm font-medium transition ${
                              canTransfer
                                ? "bg-black text-white hover:bg-black/80"
                                : "pointer-events-none bg-black/5 text-black/30"
                            }`}
                            aria-disabled={!canTransfer}
                          >
                            {canTransfer
                              ? "Bu Hakkı Devret"
                              : "Devir Kullanılamıyor"}
                          </a>

                          <a
                            href={transferUrl}
                            className="rounded-xl border border-black/10 bg-white px-5 py-3 text-center text-sm font-medium transition hover:border-black/20 hover:bg-black/[0.02]"
                          >
                            Detayları Gör
                          </a>

                        </div>

                      </div>

                      {/* FOOTER */}
                      <div className="border-t border-black/[0.06] bg-[#fafaf8] px-6 py-4 md:px-7">

                        <div className="flex items-center justify-between gap-4 text-xs text-black/40">

                          <span>
                            Hak ID
                          </span>

                          <span className="max-w-[180px] truncate font-mono text-[10px]">
                            {right.id}
                          </span>

                        </div>

                      </div>

                    </article>
                  );
                })}

              </div>

            </section>
          )}

      </div>

      {/* FOOTER */}
      <footer className="border-t border-black/[0.06] px-5 py-8">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-black/35 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © {new Date().getFullYear()} HakDevri
          </p>

          <div className="flex gap-5">

            <a
              href="/profile"
              className="hover:text-black"
            >
              Profil
            </a>

            <a
              href="/discover"
              className="hover:text-black"
            >
              Pazaryeri
            </a>

            <a
              href="/transactions"
              className="hover:text-black"
            >
              İşlemler
            </a>

          </div>

        </div>

      </footer>

    </main>
  );
}