import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const RefundPolicy = () => {
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
            Kebijakan Pengembalian Dana
          </h1>

          <p className="text-muted-foreground mb-6">
            Terakhir diperbarui: 6 Januari 2026
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              1. Garansi Kepuasan
            </h2>
            <p className="text-muted-foreground">
              Kami berkomitmen untuk memberikan pengalaman belajar terbaik. Jika Anda tidak puas dengan kursus yang dibeli, kami menawarkan garansi uang kembali dalam periode waktu tertentu sesuai ketentuan di bawah ini.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              2. Periode Pengembalian Dana
            </h2>
            <p className="text-muted-foreground mb-4">
              Anda dapat mengajukan pengembalian dana dalam waktu:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>2 hari</strong> setelah tanggal pembelian untuk kursus berbayar</li>
              <li><strong>2 hari</strong> untuk pembatalan pendaftaran</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              3. Syarat Pengembalian Dana
            </h2>
            <p className="text-muted-foreground mb-4">
              Untuk memenuhi syarat pengembalian dana, Anda harus:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Mengajukan permintaan dalam periode waktu yang ditentukan</li>
              <li>Memberikan alasan yang jelas untuk permintaan refund</li>
              <li>Belum mengunduh atau menyimpan materi kursus</li>
              <li>Mengikuti kursus online dari awal sampai selesai</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              4. Pengecualian
            </h2>
            <p className="text-muted-foreground mb-4">
              Pengembalian dana TIDAK berlaku untuk:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Kursus gratis (termasuk AI Basic 101)</li>
              <li>Permintaan setelah periode refund berakhir</li>
              <li>Peserta yang tidak mengikuti kursus online dari awal sampai selesai</li>
              <li>Pelanggaran terhadap syarat dan ketentuan kami</li>
              <li>Pembelian menggunakan kode promo atau diskon khusus (kecuali disebutkan lain)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              5. Proses Pengembalian Dana
            </h2>
            <p className="text-muted-foreground mb-4">
              Untuk mengajukan pengembalian dana:
            </p>
            <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-4">
              <li>Kirim email ke academy-support@felio.id dengan subjek "Permintaan Refund"</li>
              <li>Sertakan nama lengkap dan email yang digunakan saat pendaftaran</li>
              <li>Jelaskan alasan permintaan refund Anda</li>
              <li>Tim kami akan meninjau permintaan dalam 3-5 hari kerja</li>
              <li>Jika disetujui, dana akan dikembalikan dalam 7-14 hari kerja</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              6. Metode Pengembalian
            </h2>
            <p className="text-muted-foreground">
              Pengembalian dana akan dilakukan melalui metode pembayaran yang sama dengan yang digunakan saat pembelian. Untuk transfer bank, pastikan informasi rekening Anda masih aktif dan valid.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              7. Biaya Administrasi
            </h2>
            <p className="text-muted-foreground">
              Pengembalian dana penuh (100%) akan diberikan jika permintaan diajukan dalam 48 jam pertama setelah pembelian. Setelah itu, biaya administrasi sebesar 10% mungkin berlaku tergantung pada kondisi dan alasan pengembalian.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              8. Penggantian Kursus
            </h2>
            <p className="text-muted-foreground">
              Sebagai alternatif pengembalian dana, Anda dapat memilih untuk menukar kursus yang dibeli dengan kursus lain yang tersedia. Jika kursus yang dibeli lebih murah dari pada kursus yang ingin ditukar, maka selisih harga harus dibayarkan. Jika sebaliknya, maka akan dilakukan pengembalian dana sebesar selisih harga.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              9. Hubungi Kami
            </h2>
            <p className="text-muted-foreground">
              Jika Anda memiliki pertanyaan tentang kebijakan pengembalian dana, silakan hubungi kami di{" "}
              <a href="mailto:support@aibootcamp.id" className="text-primary hover:underline">
                academy-support@felio.id
              </a>
              {" "}atau melalui WhatsApp di nomor yang tertera di halaman kontak.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
};

export default RefundPolicy;