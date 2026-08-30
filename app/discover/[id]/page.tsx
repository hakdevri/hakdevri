"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type Transfer = {
  id: string;
  right_id: string;
  seller_id: string;
  title: string;
  description: string | null;
  asking_price: number;
  status: string;
  created_at: string;
};

export default function TransferDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (id) {
      loadTransfer();
    }
  }, [id]);

  async function loadTransfer() {
    setLoading(true);
    setMessage("");

    const result = await supabase
      .from("transfers")
      .select(
        "id, right_id, seller_id, title, description, asking_price, status, created_at"
      )
      .eq("id", id)
      .eq("status", "listed")
      .single();

    if (result.error) {
      console.error(result.error);

      setMessage(
        "Bu devir ilanı bulunamadı veya artık yayında değil."
      );

      setLoading(false);
      return;
    }

    setTransfer(result.data);
    setLoading(false);
  }

  async function createPurchaseRequest() {
    if (!transfer) {
      return;
    }

    setBuying(true);
    setMessage("");

    const userResult = await supabase.auth.getUser();
    const user = userResult.data.user;

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    if (user.id === transfer.seller_id) {
      setMessage(
        "Kendi ilanınız için satın alma talebi oluşturamazsınız."
      );

      setBuying(false);
      return;
    }

    const existingResult = await supabase
      .from("purchase_requests")
      .select("id, status")
      .eq("transfer_id", transfer.id)
      .eq("buyer_id", user.id)
      .in("status", ["pending", "accepted"])
      .maybeSingle();

    if (existingResult.error) {
      console.error(existingResult.error);

      setMessage(
        "Mevcut talepler kontrol edilirken bir hata oluştu."
      );

      setBuying(false);
      return;
    }

    if (existingResult.data) {
      setMessage(
        "Bu ilan için zaten aktif bir satın alma talebiniz bulunuyor."
      );

      setBuying(false);
      return;
    }

    const insertResult = await supabase
      .from("purchase_requests")
      .insert({
        transfer_id: transfer.id,
        buyer_id: user.id,
        seller_id: transfer.seller_id,
        amount: transfer.asking_price,
        status: "pending",
      });

    if (insertResult.error) {
      console.error(insertResult.error);

      setMessage(
        "Satın alma talebi oluşturulamadı: " +
          insertResult.error.message
      );

      setBuying(false);
      return;
    }

    setMessage(
      "Satın alma talebiniz başarıyla oluşturuldu. Satıcının onayı bekleniyor."
    );

    setBuying(false);
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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5]">
        <p className="text-sm text-black/40">
          İlan yükleniyor...
        </p>
      </main>
    );
  }

  if (!transfer) {
    return (
      <main className="min-h-screen bg-[#f7f7f5] px-5 py-8 text-[#111]">
        <div className="mx-auto max-w-3xl">

          <header className="mb-10">
            <a
              href="/"
              className="text-xl font-bold tracking-[-0.05em]"
            >
              HAK<span className="font-normal">DEVRİ</span>
            </a>
          </header>

          <div className="rounded-3xl border border-black/10 bg-white p-10 text-center">

            <h1 className="text-2xl font-semibold">
              İlan bulunamadı
            </h1>

            <p className="mt-3 text-sm text-black/45">
              {message}
            </p>

            <a
              href="/discover"
              className="mt-6 inline-block rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
            >
              İlanlara Dön
            </a>

          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-5 py-8 text-[#111]">

      <div className="mx-auto max-w-4xl">

        <header className="mb-10 flex items-center justify-between">

          <a
            href="/"
            className="text-xl font-bold tracking-[-0.05em]"
          >
            HAK<span className="font-normal">DEVRİ</span>
          </a>

          <div className="flex items-center gap-3">

            <a
              href="/discover"
              className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium"
            >
              Keşfet
            </a>

            <a
              href="/profile"
              className="rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white"
            >
              Profilim
            </a>

          </div>

        </header>

        <div className="grid gap-6 md:grid-cols-[1.4fr_0.8fr]">

          <section className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.05)]">

            <div className="flex h-56 items-start justify-between bg-[#e9e9e5] p-6">

              <span className="rounded-full bg-white px-4 py-2 text-xs font-medium">
                Hak Devri
              </span>

              <span className="rounded-full bg-green-50 px-4 py-2 text-xs font-medium text-green-700">
                Yayında
              </span>

            </div>

            <div className="p-7 md:p-9">

              <p className="text-xs font-medium tracking-[0.2em] text-black/35">
                DEVİR İLANI
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] md:text-4xl">
                {transfer.title}
              </h1>

              {transfer.description && (
                <div className="mt-7">

                  <h2 className="text-sm font-semibold">
                    Açıklama
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-black/55">
                    {transfer.description}
                  </p>

                </div>
              )}

              <div className="mt-8 grid gap-3 sm:grid-cols-2">

                <div className="rounded-2xl bg-[#f7f7f5] p-5">

                  <p className="text-xs text-black/40">
                    İlan fiyatı
                  </p>

                  <p className="mt-1 text-2xl font-semibold">
                    {formatPrice(
                      transfer.asking_price
                    )}
                  </p>

                </div>

                <div className="rounded-2xl bg-[#f7f7f5] p-5">

                  <p className="text-xs text-black/40">
                    Yayın tarihi
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {formatDate(
                      transfer.created_at
                    )}
                  </p>

                </div>

              </div>

            </div>

          </section>

          <aside className="h-fit rounded-[2rem] border border-black/10 bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">

            <p className="text-xs font-medium tracking-[0.2em] text-black/35">
              SATIN ALMA
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
              Bu hakkı almak ister misin?
            </h2>

            <p className="mt-3 text-sm leading-6 text-black/50">
              Satın alma talebini oluştur.
              Satıcı talebini gördükten sonra
              işlemin sonraki aşamasına geçilecek.
            </p>

            <div className="mt-6 rounded-2xl bg-[#f7f7f5] p-5">

              <p className="text-xs text-black/40">
                İlan fiyatı
              </p>

              <p className="mt-1 text-2xl font-semibold">
                {formatPrice(
                  transfer.asking_price
                )}
              </p>

            </div>

            <button
              type="button"
              onClick={createPurchaseRequest}
              disabled={buying}
              className="mt-5 w-full rounded-xl bg-black px-5 py-3.5 text-sm font-medium text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {buying
                ? "Talep oluşturuluyor..."
                : "Bu Hakkı Satın Al"}
            </button>

            {message && (
              <div className="mt-4 rounded-xl bg-black/[0.04] p-4 text-sm leading-6 text-black/55">
                {message}
              </div>
            )}

            <a
              href="/discover"
              className="mt-3 block w-full rounded-xl border border-black/10 px-5 py-3.5 text-center text-sm font-medium"
            >
              İlanlara Dön
            </a>

          </aside>

        </div>

      </div>

    </main>
  );
}