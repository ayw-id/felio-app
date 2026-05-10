import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>

        <article className="max-w-3xl mx-auto prose prose-gray">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl mb-8">
            Kebijakan Privasi
          </h1>

          <p className="text-muted-foreground mb-6">
            Terakhir diperbarui: 6 Januari 2026
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              1. Informasi yang Kami Kumpulkan
            </h2>
            <p className="text-muted-foreground mb-4">
              Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, termasuk:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Nama lengkap</li>
              <li>Alamat email</li>
              <li>Nomor telepon</li>
              <li>Informasi pembayaran</li>
              <li>Informasi lain yang Anda pilih untuk berikan</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              2. Penggunaan Informasi
            </h2>
            <p className="text-muted-foreground mb-4">
              Kami menggunakan informasi yang kami kumpulkan untuk:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Menyediakan, memelihara, dan meningkatkan layanan kami</li>
              <li>Memproses transaksi dan mengirimkan pemberitahuan terkait</li>
              <li>Mengirimkan informasi teknis, update, dan pesan dukungan</li>
              <li>Menanggapi komentar, pertanyaan, dan permintaan Anda</li>
              <li>Mengirimkan komunikasi pemasaran (dengan persetujuan Anda)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              3. Berbagi Informasi
            </h2>
            <p className="text-muted-foreground mb-4">
              Kami tidak menjual, memperdagangkan, atau mentransfer informasi pribadi Anda kepada pihak ketiga tanpa persetujuan Anda, kecuali untuk:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Penyedia layanan yang membantu operasional kami</li>
              <li>Kepatuhan terhadap kewajiban hukum</li>
              <li>Perlindungan hak dan keamanan kami</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              4. Keamanan Data
            </h2>
            <p className="text-muted-foreground">
              Kami menerapkan langkah-langkah keamanan yang sesuai untuk melindungi informasi pribadi Anda dari akses yang tidak sah, perubahan, pengungkapan, atau penghancuran. Namun, tidak ada metode transmisi melalui internet yang 100% aman.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              5. Hak Anda
            </h2>
            <p className="text-muted-foreground mb-4">
              Anda memiliki hak untuk:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Mengakses informasi pribadi Anda</li>
              <li>Memperbaiki informasi yang tidak akurat</li>
              <li>Meminta penghapusan data Anda</li>
              <li>Menolak pemrosesan data Anda</li>
              <li>Menarik persetujuan kapan saja</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              6. Cookie
            </h2>
            <p className="text-muted-foreground">
              Kami menggunakan cookie dan teknologi pelacakan serupa untuk meningkatkan pengalaman browsing Anda dan menganalisis lalu lintas situs. Anda dapat mengatur browser Anda untuk menolak cookie, namun beberapa fitur mungkin tidak berfungsi dengan baik.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              7. Perubahan Kebijakan
            </h2>
            <p className="text-muted-foreground">
              Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan akan diposting di halaman ini dengan tanggal revisi yang diperbarui. Kami mendorong Anda untuk meninjau kebijakan ini secara berkala.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              8. Hubungi Kami
            </h2>
            <p className="text-muted-foreground">
              Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami melalui email di{" "}
              <a href="mailto:support@aibootcamp.id" className="text-primary hover:underline">
                academy-support@felio.id
              </a>
            </p>
          </section>
        </article>
      </div>
    </main>
  );
};

export default Privacy;