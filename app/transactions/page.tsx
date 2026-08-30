"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Transaction = {
  id: string;
  purchase_request_id: string;
  transfer_id: string;
  buyer_id: string;
  seller_id: string;
  sale_price: number;
  platform_fee: number;
  total_amount: number;
  payment_status: string;
  transfer_status: string;
  status: string;
  created_at: string;
  updated_at: string;
  transfers: {
    title: string;
  } | null;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    setLoading(true);
    setMessage("");

    const result = await supabase.auth.getUser();
    const user = result.data.user;

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    const buyerFilter = "buyer_id.eq." + user.id;
    const sellerFilter = "seller_id.eq." + user.id;
    const filter = buyerFilter + "," + sellerFilter;

    const query = await supabase
      .from("transactions")
      .select(
        "id, purchase_request_id, transfer_id, buyer_id, seller_id, sale_price, platform_fee, total_amount, payment_status, transfer_status, status, created_at, updated_at, transfers(title)"
      )
      .or(filter)
      .order("created_at", {
        ascending: false,
      });

    if (query.error) {
      console.error(query.error);

      setMessage(
        "İşlemler yüklenemedi: " +
          query.error.message
      );

      setLoading(false);
      return;
    }

    setTransactions(
      (query.data || []) as unknown as Transaction[]
    );

    setLoading(false);
  }

  function formatPrice(amount: number) {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  function getStatusText(status: string) {
    switch (status) {
      case "payment_pending":
        return "Ödeme bekleniyor";

      case "payment_processing":
        return "Ödeme işleniyor";

      case "paid":
        return "Ödeme tamamlandı";

      case "transfer_pending":
        return "Devir bekleniyor";

      case "completed":
        return "İşlem tamamlandı";

      case "cancelled":
        return "İşlem iptal edildi";

      default:
        return status;
    }
  }

  function getStatusClass(status: string) {
    switch (status) {
      case "payment_pending":
        return "bg-yellow-50 text-yellow-700";

      case "payment_processing":
        return "bg-blue-50 text-blue-700";

      case "paid":
        return "bg-green-50 text-green-700";

      case "transfer_pending":
        return "bg-purple-50 text-purple-700";

      case "completed":
        return "bg-green-50 text-green-700";

      case "cancelled":
        return "bg-red-50 text-red-700";

      default:
        return "bg-black/5 text-black/50";
    }
  }

  function getPaymentText(status: string) {
    switch (status) {
      case "pending":
        return "Ödeme bekleniyor";

      case "paid":
        return "Ödeme alındı";

      case "failed":
        return "Ödeme başarısız";

      case "refunded":
        return "Ödeme iade edildi";

      default:
        return status;
    }
  }

  function getTransferText(status: string) {
    switch (status) {
      case "pending":
        return "Devir süreci bekliyor";

      case "documents_pending":
        return "Belgeler bekleniyor";

      case "buyer_confirmation":
        return "Alıcı onayı bekleniyor";

      case "completed":
        return "Devir tamamlandı";

      case "cancelled":
        return "Devir iptal edildi";

      default:
        return status;
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-5 py-8 text-[#111]">
      <div className="mx-auto max-w-5xl">

        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">

          <a
            href="/"
            className="text-xl font-bold tracking-[-0.05em]"
          >
            HAK<span className="font-normal">DEVRİ</span>
          </a>

          <nav className="flex flex-wrap gap-3">

            <a
              href="/discover"
              className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium"
            >
              Keşfet
            </a>

            <a
              href="/transfers"
              className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium"
            >
              İlanlarım
            </a>

            <a
              href="/my-requests"
              className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium"
            >
              Taleplerim
            </a>

            <a
              href="/requests"
              className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium"
            >
              Gelen Talepler
            </a>

            <a
              href="/profile"
              className="rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white"
            >
              Profilim
            </a>

          </nav>

        </header>

        <section className="mb-8">

          <p className="text-xs font-medium tracking-[0.2em] text-black/35">
            HAKDEVRI GÜVENLİ İŞLEM
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
            İşlemlerim
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/50">
            Kabul edilen satın alma taleplerinden
            oluşan işlemlerini buradan takip
            edebilirsin.
          </p>

        </section>

        {message !== "" && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-white p-5">
            <p className="text-sm text-red-600">
              {message}
            </p>
          </div>
        )}

        {loading && (
          <div className="rounded-3xl border border-black/10 bg-white p-10 text-center">
            <p className="text-sm text-black/40">
              İşlemler yükleniyor...
            </p>
          </div>
        )}

        {!loading &&
          message === "" &&
          transactions.length === 0 && (
            <div className="rounded-3xl border border-black/10 bg-white p-12 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f7f5]">
                —
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                Henüz aktif işlemin yok
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/45">
                Satın alma talebin satıcı tarafından
                kabul edildiğinde burada bir işlem
                dosyası oluşacak.
              </p>

              <a
                href="/discover"
                className="mt-6 inline-block rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
              >
                Hakları Keşfet
              </a>

            </div>
          )}

        {!loading &&
          message === "" &&
          transactions.length > 0 && (
            <div className="grid gap-6">

              {transactions.map((transaction) => {

                const title =
                  transaction.transfers &&
                  transaction.transfers.title
                    ? transaction.transfers.title
                    : "Devir işlemi";

                return (
                  <article
                    key={transaction.id}
                    className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_15px_45px_rgba(0,0,0,0.04)]"
                  >

                    <div className="border-b border-black/10 p-6">

                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                        <div>

                          <p className="text-xs font-medium tracking-[0.15em] text-black/35">
                            İŞLEM DOSYASI
                          </p>

                          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                            {title}
                          </h2>

                          <p className="mt-2 text-xs text-black/40">
                            Oluşturulma:{" "}
                            {formatDate(
                              transaction.created_at
                            )}
                          </p>

                        </div>

                        <span
                          className={
                            "rounded-full px-4 py-2 text-xs font-medium " +
                            getStatusClass(
                              transaction.status
                            )
                          }
                        >
                          {getStatusText(
                            transaction.status
                          )}
                        </span>

                      </div>

                    </div>

                    <div className="grid gap-4 p-6 sm:grid-cols-3">

                      <div className="rounded-2xl bg-[#f7f7f5] p-5">

                        <p className="text-xs text-black/40">
                          Satış bedeli
                        </p>

                        <p className="mt-2 text-xl font-semibold">
                          {formatPrice(
                            Number(
                              transaction.sale_price
                            )
                          )}
                        </p>

                      </div>

                      <div className="rounded-2xl bg-[#f7f7f5] p-5">

                        <p className="text-xs text-black/40">
                          Hizmet bedeli
                        </p>

                        <p className="mt-2 text-xl font-semibold">
                          {formatPrice(
                            Number(
                              transaction.platform_fee
                            )
                          )}
                        </p>

                      </div>

                      <div className="rounded-2xl bg-black p-5 text-white">

                        <p className="text-xs text-white/50">
                          Toplam
                        </p>

                        <p className="mt-2 text-xl font-semibold">
                          {formatPrice(
                            Number(
                              transaction.total_amount
                            )
                          )}
                        </p>

                      </div>

                    </div>

                    <div className="grid gap-4 border-t border-black/10 p-6 md:grid-cols-2">

                      <div className="rounded-2xl border border-black/10 p-5">

                        <p className="text-xs font-medium tracking-[0.1em] text-black/35">
                          ÖDEME DURUMU
                        </p>

                        <p className="mt-2 text-sm font-semibold">
                          {getPaymentText(
                            transaction.payment_status
                          )}
                        </p>

                        <p className="mt-2 text-xs leading-5 text-black/45">
                          Ödeme durumu güvenli
                          ödeme sistemi üzerinden
                          güncellenecek.
                        </p>

                      </div>

                      <div className="rounded-2xl border border-black/10 p-5">

                        <p className="text-xs font-medium tracking-[0.1em] text-black/35">
                          DEVİR DURUMU
                        </p>

                        <p className="mt-2 text-sm font-semibold">
                          {getTransferText(
                            transaction.transfer_status
                          )}
                        </p>

                        <p className="mt-2 text-xs leading-5 text-black/45">
                          Devir süreci ödeme
                          tamamlandıktan sonra
                          başlayacak.
                        </p>

                      </div>

                    </div>

                    {transaction.status ===
                      "payment_pending" && (
                      <div className="border-t border-black/10 bg-yellow-50 p-6">

                        <p className="text-sm font-semibold text-yellow-800">
                          Ödeme bekleniyor
                        </p>

                        <p className="mt-1 text-xs leading-5 text-yellow-700">
                          Satıcı talebi kabul etti.
                          Şimdi güvenli ödeme
                          aşamasına geçilebilir.
                        </p>

                        <button
                          type="button"
                          disabled
                          className="mt-4 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white opacity-40"
                        >
                          Ödemeye Geç
                        </button>

                      </div>
                    )}

                    {transaction.status ===
                      "payment_processing" && (
                      <div className="border-t border-black/10 bg-blue-50 p-6">

                        <p className="text-sm font-semibold text-blue-800">
                          Ödeme işleniyor
                        </p>

                      </div>
                    )}

                    {transaction.status === "paid" && (
                      <div className="border-t border-black/10 bg-green-50 p-6">

                        <p className="text-sm font-semibold text-green-800">
                          Ödeme tamamlandı
                        </p>

                        <p className="mt-1 text-xs leading-5 text-green-700">
                          Devir sürecine geçilebilir.
                        </p>

                      </div>
                    )}

                    {transaction.status ===
                      "completed" && (
                      <div className="border-t border-black/10 bg-green-50 p-6">

                        <p className="text-sm font-semibold text-green-800">
                          🎉 İşlem başarıyla tamamlandı.
                        </p>

                        <p className="mt-1 text-xs leading-5 text-green-700">
                          Hak devri süreci tamamlandı.
                        </p>

                      </div>
                    )}

                  </article>
                );
              })}

            </div>
          )}

      </div>
    </main>
  );
}