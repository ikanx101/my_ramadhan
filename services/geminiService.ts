
/**
 * Static insights for Ramadan to remove dependency on external AI APIs.
 */
const RAMADAN_QUOTES = [
  "Ramadan adalah waktu untuk membersihkan hati dan mendekatkan diri kepada Sang Pencipta.",
  "Setiap detak jantung di bulan suci ini adalah kesempatan untuk memohon ampunan.",
  "Kesabaran adalah separuh dari iman, dan puasa adalah separuh dari kesabaran.",
  "Berbagi di bulan Ramadan melipatgandakan kebahagiaan dan keberkahan harta.",
  "Al-Qur'an diturunkan di bulan ini sebagai petunjuk bagi umat manusia.",
  "Puasa bukan sekadar menahan lapar, tapi menahan lisan dan hati dari keburukan.",
  "Malam Lailatul Qadr lebih baik dari seribu bulan, carilah dengan ketulusan.",
  "Sedekah yang paling utama adalah sedekah di bulan Ramadan.",
  "Jadikan salat sebagai penyejuk hati dan puasa sebagai perisai diri.",
  "Ramadan adalah sekolah kedisiplinan dan empati terhadap sesama.",
  "Senyummu di hadapan saudaramu saat berbuka adalah sedekah.",
  "Doa orang yang berpuasa tidak akan tertolak, manfaatkanlah setiap waktu.",
  "Kebersihan jiwa dimulai dengan kejujuran dalam berpuasa.",
  "Tangan yang di atas lebih baik daripada tangan yang di bawah, terutama di bulan ini.",
  "Ingatlah Allah dalam lapangmu, maka Dia akan mengingatmu dalam sempitmu.",
  "Puasa mendidik kita untuk menghargai setiap butir nasi dan seteguk air.",
  "Ikhlas adalah kunci diterimanya segala amal ibadah kita.",
  "Ramadan mengajarkan kita bahwa kita mampu mengendalikan hawa nafsu.",
  "Istiqomah dalam kebaikan adalah tanda suksesnya madrasah Ramadan.",
  "Maafkanlah orang lain sebelum kamu memohon ampunan kepada Allah.",
  "Ketakwaan adalah bekal terbaik bagi setiap hamba.",
  "Zakat fitrah membersihkan harta dan menyempurnakan ibadah puasa.",
  "Jauhilah ghibah, karena ia merusak pahala puasa yang kita bangun.",
  "Sholat tarawih adalah kesempatan untuk merasakan ketenangan dalam berjamaah.",
  "Semangat Ramadan janganlah luntur meski bulan berganti.",
  "Ilmu yang bermanfaat adalah cahaya bagi langkah kita di dunia dan akhirat.",
  "Sabar menghadapi ujian lapar adalah latihan menghadapi ujian hidup.",
  "Ramadan adalah momen transformasi diri menjadi pribadi yang lebih baik.",
  "Kesyukuran akan menambah nikmat yang telah Allah berikan.",
  "Semoga Allah menerima seluruh amal ibadah kita di bulan yang mulia ini."
];

export const getRamadanInsight = async (day: number) => {
  // Returns a static quote based on the Ramadan day (1-30)
  const index = Math.max(0, Math.min(29, day - 1));
  return RAMADAN_QUOTES[index];
};
