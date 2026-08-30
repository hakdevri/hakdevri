"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type User = {
  email?: string;
};

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          email: session.user.email,
        });
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    const result = await supabase.auth.getUser();

    if (result.data.user) {
      setUser({
        email: result.data.user.email,
      });
    }

    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5]">
        <p className="text-sm text-black/40">
          Yükleniyor...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#111]">

      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">

          <a
            href="/"
            className="text-xl font-bold tracking-[-0.05em]"
          >
            HAK<span className="font-normal">DEVRİ</span>
          </a>

          <nav className="hidden items-center gap-7 text-sm md:flex">
            <a
              href="#nasil-calisir"
              className="text-black/50 transition hover:text-black"
            >
              Nasıl Çalışır?
            </a>

            <a
              href="#kesfet"
              className="text-black/50 transition hover:text-black"
            >
              Hakları Keşfet
            </a>
          </nav>

          <div className="flex items-center gap-3">

            {user ? (
              <>
                <a
                  href="/profile"
                  className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium"
                >
                  Profilim
                </a>

                <button
                  type="button"
                  onClick={logout}
                  className="hidden rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white sm:block"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <>
                <a
                  href="/auth"
                  className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium"
                >
                  Giriş Yap
                </a>

                <a
                  href="/auth"
                  className="hidden rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white sm:block"
                >
                  Kayıt Ol
                </a>
              </>
            )}

          </div>
        </div>
      </header>

      <section className="px-5 py-20 md:py-32">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-4xl">

            <p className="mb-5 text-xs font-medium tracking-[0.25em] text-black/35">
              DİJİTAL HAK YÖNETİM PLATFORMU
            </p>

            <h1 className="text-5xl font-semibold leading-[0.95] tracking-[-0.06em] md:text-7xl">
              Sahip olduğun
              <br />
              hakkı yönet.
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-black/50 md:text-lg">
              Kullanmadığın hakları güvenli şekilde devret,
              yeni hakları keşfet ve tüm haklarını tek bir dijital
              cüzdandan yönet.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              {user ? (
                <>
                  <a
                    href="/profile"
                    className="rounded-xl bg-black px-6 py-3.5 text-center text-sm font-medium text-white"
                  >
                    Profilime Git
                  </a>

                  <a
                    href="#kesfet"
                    className="rounded-xl border border-black/10 bg-white px-6 py-3.5 text-center text-sm font-medium"
                  >
                    Hakları Keşfet
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="/auth"
                    className="rounded-xl bg-black px-6 py-3.5 text-center text-sm font-medium text-white"
                  >
                    Hemen Başla
                  </a>

                  <a
                    href="#nasil-calisir"
                    className="rounded-xl border border-black/10 bg-white px-6 py-3.5 text-center text-sm font-medium"
                  >
                    Nasıl Çalışır?
                  </a>
                </>
              )}

            </div>

          </div>

        </div>
      </section>

      <section
        id="kesfet"
        className="border-y border-black/10 bg-white px-5 py-20"
      >
        <div className="mx-auto max-w-7xl">

          <div className="mb-10">
            <p className="text-xs font-medium tracking-[0.2em] text-black/35">
              HAKLAR
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
              Yakında keşfedebileceğin haklar
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">

            <div className="rounded-3xl border border-black/10 p-6">
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-lg text-white">
                01
              </div>

              <h3 className="text-xl font-semibold">
                Konaklama Hakları
              </h3>

              <p className="mt-3 text-sm leading-6 text-black/50">
                Otel, tatil köyü ve konaklama tesislerindeki
                kullanılabilir hakları keşfet.
              </p>
            </div>

            <div className="rounded-3xl border border-black/10 p-6">
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-lg text-white">
                02
              </div>

              <h3 className="text-xl font-semibold">
                Etkinlik Hakları
              </h3>

              <p className="mt-3 text-sm leading-6 text-black/50">
                Etkinlik, organizasyon ve deneyim haklarını
                güvenli şekilde devret veya satın al.
              </p>
            </div>

            <div className="rounded-3xl border border-black/10 p-6">
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-lg text-white">
                03
              </div>

              <h3 className="text-xl font-semibold">
                Üyelik Hakları
              </h3>

              <p className="mt-3 text-sm leading-6 text-black/50">
                Spor salonu, kulüp ve benzeri üyelik haklarını
                dijital olarak yönet.
              </p>
            </div>

          </div>

        </div>
      </section>

      <section
        id="nasil-calisir"
        className="px-5 py-20 md:py-28"
      >
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-12 md:grid-cols-2">

            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-black/35">
                NASIL ÇALIŞIR?
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
                Hakların artık
                <br />
                cebinde.
              </h2>
            </div>

            <div className="space-y-7">

              <div className="border-b border-black/10 pb-7">
                <span className="text-xs text-black/35">
                  01
                </span>

                <h3 className="mt-2 text-lg font-semibold">
                  Hesabını oluştur
                </h3>

                <p className="mt-2 text-sm leading-6 text-black/50">
                  Tek bir hesapla tüm haklarını ve işlemlerini
                  yönet.
                </p>
              </div>

              <div className="border-b border-black/10 pb-7">
                <span className="text-xs text-black/35">
                  02
                </span>

                <h3 className="mt-2 text-lg font-semibold">
                  Hakkını keşfet veya devret
                </h3>

                <p className="mt-2 text-sm leading-6 text-black/50">
                  İhtiyacın olan hakkı satın al veya
                  kullanmadığın hakkını uygun koşullarda devret.
                </p>
              </div>

              <div>
                <span className="text-xs text-black/35">
                  03
                </span>

                <h3 className="mt-2 text-lg font-semibold">
                  QR ile kullan
                </h3>

                <p className="mt-2 text-sm leading-6 text-black/50">
                  Kullanım zamanı geldiğinde dijital hakkını
                  güvenli doğrulama ile kullan.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      <footer className="border-t border-black/10 bg-white px-5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-black/40 md:flex-row">
          <p>
            © 2026 HakDevri
          </p>

          <p>
            Dijital hakların yeni adresi.
          </p>
        </div>
      </footer>

    </main>
  );
}