"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Transfer = {
  id: string;
  right_id: string;
  title: string;
  description: string | null;
  asking_price: number;
  status: string;
  created_at: string;
};

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadTransfers();
  }, []);

  async function loadTransfers() {
    setLoading(true);
    setMessage("");

    const userResult = await supabase.auth.getUser();
    const user = userResult.data.user;

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    const result = await supabase
      .from("transfers")
      .select(
        "id, right_id, title, description, asking_price, status, created_at"
      )
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });

    if (result.error) {
      console.error(result.error);
      setMessage(
        "Devir ilanları yüklenirken bir hata oluştu."
      );
      setLoading(false);
      return;
    }

    setTransfers(result.data || []);
    setLoading(false);
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(price);
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  }

  function getStatusText(status: string) {
    if (status === "listed") {
      return "Yayında";
    }

    if (status === "reserved") {
      return "Rezerve";
    }

    if (status === "sold") {
      return "Satıldı";
    }

    if (status === "cancelled") {
      return "İptal";
    }

    return status;
  }

  function getStatusClass(status: string) {
    if (status === "listed") {
      return "bg-green-50 text-green-700";
    }

    if (status === "reserved") {
      return "bg-yellow-50 text-yellow-700";
    }

    if (status === "sold") {
      return "bg-blue-50 text-blue-700";
    }

    return "bg-black/5 text-black/45";
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-5 py-8 text-[#111]">
      <div className="mx-auto max-w-6xl">

        <header className="mb-10 flex items-center justify-between">

          <a
            href="/"
            className="text-xl font-bold tracking-[-0.05em]"
          >
            HAK<span className="font-normal">DEVRİ</span>
          </a>

          <div className="flex items-center gap-3">

            <a
              href="/rights"
              className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium"
            >
              Haklarım
            </a>

            <a
              href="/profile"
              className="hidden rounded-xl bg-black px-4 py-2.5 text-sm font-medium sm:block"
            >
              Profilim
            </a>

          </div>

        </header>

        <section className="mb-10">

          <p className="text-xs font-medium tracking-[0.2em] text-black/35">
            DEVİR YÖNETİMİ
          </p>

          <div className="mt-2 flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <h1 className="text-4xl font-semibold tracking-[-0.05em]">
                Devir İlanlarım
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-black/50">
                Devre çıkardığın hakları, fiyatlarını ve ilan
                durumlarını buradan takip edebilirsin.
              </p>

            </div>

            <div className="rounded-2xl border border-black/10 bg-white px-5 py-4">

              <p className="text-xs text-black/40">
                Toplam İlan
              </p>

              <p className="mt-1 text-2xl font-semibold">
                {transfers.length}
              </p>

            </div>

          </div>

        </section>

        {loading && (
          <div className="rounded-3xl border border-black/10 bg-white p-10 text-center">

            <p className="text-sm text-black/40">
              İlanların yükleniyor...
            </p>

          </div>
        )}

        {!loading && message && (
          <div className="rounded-3xl border border-red-200 bg-white p-10 text-center">

            <p className="text-sm text-red-600">
              {message}
            </p>

            <button
              type="button"
              onClick={loadTransfers}
              className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
            >
              Tekrar Dene
            </button>

          </div>
        )}

        {!loading &&
          !message &&
          transfers.length === 0 && (
            <div className="rounded-3xl border border-black/10 bg-white p-10 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f7f5] text-lg">
                +
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                Henüz devir ilanı oluşturmadın
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/45">
                Sahip olduğun aktif haklardan birini
                devretmek için yeni bir ilan oluşturabilirsin.
              </p>

              <a
                href="/rights/transfer"
                className="mt-6 inline-block rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
              >
                Hak Devret
              </a>

            </div>
          )}

        {!loading &&
          !message &&
          transfers.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2">

              {transfers.map((transfer) => (
                <article
                  key={transfer.id}
                  className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_15px_45px_rgba(0,0,0,0.04)]"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <p className="text-xs font-medium tracking-wide text-black/35">
                        DEVİR İLANI
                      </p>

                      <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                        {transfer.title}
                      </h2>

                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                        transfer.status
                      )}`}
                    >
                      {getStatusText(transfer.status)}
                    </span>

                  </div>

                  {transfer.description && (
                    <p className="mt-4 text-sm leading-6 text-black/50">
                      {transfer.description}
                    </p>
                  )}

                  <div className="mt-6 rounded-2xl bg-[#f7f7f5] p-5">

                    <p className="text-xs text-black/40">
                      Devir Fiyatı
                    </p>

                    <p className="mt-1 text-2xl font-semibold tracking-[-0.03em]">
                      {formatPrice(
                        transfer.asking_price
                      )}
                    </p>

                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-black/40">

                    <span>
                      Oluşturulma
                    </span>

                    <span>
                      {formatDate(
                        transfer.created_at
                      )}
                    </span>

                  </div>

                  {transfer.status === "listed" && (
                    <button
                      type="button"
                      className="mt-5 w-full rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-medium transition hover:bg-black hover:text-white"
                    >
                      İlanı Yönet
                    </button>
                  )}

                </article>
              ))}

            </div>
          )}

        <div className="mt-8">

          <a
            href="/rights/transfer"
            className="inline-block rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
          >
            + Yeni Devir İlanı
          </a>

        </div>

      </div>
    </main>
  );
}