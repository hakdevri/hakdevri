"use client";

import { useEffect, useState } from "react";
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
  updated_at: string;
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function TransferManagePage({ params }: PageProps) {
  const [transferId, setTransferId] = useState("");

  const [transfer, setTransfer] = useState<Transfer | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function getId() {
      const resolvedParams = await params;
      setTransferId(resolvedParams.id);
    }

    getId();
  }, [params]);

  useEffect(() => {
    if (transferId) {
      loadTransfer(transferId);
    }
  }, [transferId]);

  async function loadTransfer(id: string) {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth";
        return;
      }

      /*
       * Önce ilanı sadece ID ile buluyoruz.
       * Böylece sorunun ID'den mi yoksa seller_id yetkisinden mi
       * kaynaklandığını daha rahat anlayabiliriz.
       */

      const { data, error: transferError } = await supabase
        .from("transfers")
        .select(
          "id, right_id, seller_id, title, description, asking_price, status, created_at, updated_at"
        )
        .eq("id", id)
        .maybeSingle();

      if (transferError) {
        console.error("TRANSFER HATASI:", transferError);
        setError("İlan yüklenirken hata oluştu: " + transferError.message);
        return;
      }

      if (!data) {
        setError("Bu devir ilanı bulunamadı.");
        return;
      }

      /*
       * İlan bulunduysa şimdi ilan sahibini kontrol ediyoruz.
       */

      if (data.seller_id !== user.id) {
        console.log("İlan sahibi:", data.seller_id);
        console.log("Giriş yapan kullanıcı:", user.id);

        setError("Bu ilanı yönetme yetkiniz bulunmuyor.");
        return;
      }

      setTransfer(data);

      setTitle(data.title || "");
      setDescription(data.description || "");
      setPrice(String(data.asking_price ?? ""));
    } catch (err) {
      console.error("GENEL HATA:", err);
      setError("Beklenmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!transfer) return;

    setError("");
    setMessage("");

    if (!title.trim()) {
      setError("İlan başlığı boş bırakılamaz.");
      return;
    }

    const numericPrice = Number(price);

    if (!price || Number.isNaN(numericPrice) || numericPrice <= 0) {
      setError("Geçerli bir fiyat girin.");
      return;
    }

    try {
      setSaving(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth";
        return;
      }

      const now = new Date().toISOString();

      const { error: updateError } = await supabase
        .from("transfers")
        .update({
          title: title.trim(),
          description: description.trim() || null,
          asking_price: numericPrice,
          updated_at: now,
        })
        .eq("id", transfer.id)
        .eq("seller_id", user.id);

      if (updateError) {
        console.error("GÜNCELLEME HATASI:", updateError);
        setError(
          "Değişiklikler kaydedilemedi: " + updateError.message
        );
        return;
      }

      setTransfer({
        ...transfer,
        title: title.trim(),
        description: description.trim() || null,
        asking_price: numericPrice,
        updated_at: now,
      });

      setMessage("Değişiklikler başarıyla kaydedildi.");
    } catch (err) {
      console.error(err);
      setError("Kaydetme sırasında bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(
    newStatus: "listed" | "cancelled"
  ) {
    if (!transfer) return;

    const question =
      newStatus === "cancelled"
        ? "Bu ilanı yayından kaldırmak istediğinize emin misiniz?"
        : "Bu ilanı tekrar yayına almak istediğinize emin misiniz?";

    if (!window.confirm(question)) {
      return;
    }

    setError("");
    setMessage("");

    try {
      setChangingStatus(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth";
        return;
      }

      const now = new Date().toISOString();

      const { error: updateError } = await supabase
        .from("transfers")
        .update({
          status: newStatus,
          updated_at: now,
        })
        .eq("id", transfer.id)
        .eq("seller_id", user.id);

      if (updateError) {
        console.error("DURUM DEĞİŞTİRME HATASI:", updateError);

        setError(
          "İlan durumu değiştirilemedi: " +
            updateError.message
        );

        return;
      }

      setTransfer({
        ...transfer,
        status: newStatus,
        updated_at: now,
      });

      if (newStatus === "cancelled") {
        setMessage("İlan yayından kaldırıldı.");
      } else {
        setMessage("İlan tekrar yayına alındı.");
      }
    } catch (err) {
      console.error(err);
      setError("İlan durumu değiştirilirken hata oluştu.");
    } finally {
      setChangingStatus(false);
    }
  }

  function formatPrice(value: number) {
    return (
      new Intl.NumberFormat("tr-TR").format(value) +
      " TL"
    );
  }

  function formatDate(value: string) {
    return new Date(value).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f7f5]">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <div className="animate-pulse">
            <div className="h-4 w-32 rounded bg-black/10" />

            <div className="mt-6 h-10 w-72 rounded bg-black/10" />

            <div className="mt-10 h-96 rounded-3xl bg-black/5" />
          </div>
        </div>
      </main>
    );
  }

  if (error && !transfer) {
    return (
      <main className="min-h-screen bg-[#f7f7f5]">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <a
            href="/transfers"
            className="text-sm font-medium text-black/60 hover:text-black"
          >
            ← Devirlerime Dön
          </a>

          <div className="mt-10 rounded-3xl border border-black/10 bg-white p-8 text-center shadow-sm">
            <div className="text-4xl">⚠️</div>

            <h1 className="mt-4 text-xl font-semibold">
              İlan açılamadı
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-black/60">
              {error}
            </p>

            <p className="mt-4 break-all text-xs text-black/40">
              İlan ID: {transferId}
            </p>

            <a
              href="/transfers"
              className="mt-7 inline-flex rounded-xl bg-black px-6 py-3 text-sm font-medium text-white"
            >
              Devirlerime Dön
            </a>
          </div>
        </div>
      </main>
    );
  }

  if (!transfer) {
    return null;
  }

  const isListed = transfer.status === "listed";

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-black">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <a
            href="/"
            className="text-xl font-semibold tracking-tight"
          >
            HakDevri
          </a>

          <a
            href="/transfers"
            className="rounded-xl border border-black/10 px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
          >
            ← Devirlerim
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-5 py-10 pb-20">
        <div>
          <p className="text-sm font-medium text-black/40">
            Devir ilanı
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            İlanı Yönet
          </h1>

          <p className="mt-3 text-sm leading-6 text-black/60">
            Devir ilanınızın bilgilerini buradan güncelleyebilir,
            ilanınızı yayından kaldırabilir veya tekrar
            yayınlayabilirsiniz.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-black/40">
                İlan durumu
              </p>

              <div className="mt-2">
                {isListed ? (
                  <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Yayında
                  </span>
                ) : transfer.status === "cancelled" ? (
                  <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                    Yayından kaldırıldı
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/60">
                    {transfer.status}
                  </span>
                )}
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs text-black/40">
                Güncel fiyat
              </p>

              <p className="mt-1 text-xl font-semibold">
                {formatPrice(transfer.asking_price)}
              </p>
            </div>
          </div>

          {isListed ? (
            <>
              <div className="mt-7">
                <label className="text-sm font-medium">
                  İlan Başlığı
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-3.5 text-sm outline-none transition focus:border-black"
                  placeholder="İlan başlığı"
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium">
                  Açıklama
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  rows={6}
                  className="mt-2 w-full resize-none rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-3.5 text-sm outline-none transition focus:border-black"
                  placeholder="İlan açıklaması"
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium">
                  Devir Fiyatı
                </label>

                <div className="relative mt-2">
                  <input
                    type="number"
                    min="1"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
                    className="w-full rounded-2xl border border-black/10 bg-[#fafafa] px-4 py-3.5 pr-16 text-sm outline-none transition focus:border-black"
                    placeholder="0"
                  />

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-black/40">
                    TL
                  </span>
                </div>
              </div>

              {error && (
                <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {message && (
                <div className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {message}
                </div>
              )}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full rounded-2xl bg-black px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Kaydediliyor..."
                    : "Değişiklikleri Kaydet"}
                </button>

                <button
                  type="button"
                  onClick={() => changeStatus("cancelled")}
                  disabled={changingStatus}
                  className="w-full rounded-2xl border border-red-200 bg-red-50 px-5 py-3.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {changingStatus
                    ? "İşleniyor..."
                    : "İlanı Yayından Kaldır"}
                </button>
              </div>
            </>
          ) : transfer.status === "cancelled" ? (
            <>
              <div className="mt-7 rounded-2xl bg-black/[0.03] p-5">
                <p className="font-medium">
                  Bu ilan şu anda yayında değil.
                </p>

                <p className="mt-2 text-sm leading-6 text-black/60">
                  İlanı tekrar yayınlamak isterseniz aşağıdaki
                  butonu kullanabilirsiniz.
                </p>
              </div>

              {error && (
                <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {message && (
                <div className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {message}
                </div>
              )}

              <button
                type="button"
                onClick={() => changeStatus("listed")}
                disabled={changingStatus}
                className="mt-6 w-full rounded-2xl bg-black px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {changingStatus
                  ? "Yayına Alınıyor..."
                  : "İlanı Tekrar Yayına Al"}
              </button>
            </>
          ) : (
            <div className="mt-7 rounded-2xl bg-black/[0.03] p-5">
              <p className="font-medium">
                Bu ilan şu anda yönetilemiyor.
              </p>

              <p className="mt-2 text-sm leading-6 text-black/60">
                İlanın mevcut durumu nedeniyle düzenleme
                yapılamıyor.
              </p>
            </div>
          )}

          <div className="mt-8 grid gap-4 border-t border-black/10 pt-6 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs text-black/40">
                Oluşturulma
              </p>

              <p className="mt-1 font-medium">
                {formatDate(transfer.created_at)}
              </p>
            </div>

            <div>
              <p className="text-xs text-black/40">
                Son güncelleme
              </p>

              <p className="mt-1 font-medium">
                {formatDate(transfer.updated_at)}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}