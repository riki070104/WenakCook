// src/data/dummyRecipes.js

// Pastikan path ke gambar ini bener ya, Bang, relatif dari App.jsx atau file lain yang make.
// Kalo file ini di src/data/dummyRecipes.js dan gambar di src/assets/images/, pathnya jadi:
// '../assets/images/NamaGambar.jpg'

export const initialRecipes = [
  {
    id: 1,
    name: "Rawon",
    image: require("../assets/images/Rawon.jpg"), // Path disesuaikan
    shortDescription: "Sup daging khas Jawa Timur dengan kuah hitam dari kluwek.",
    ingredients: [
      "500 gr daging sapi (sandung lamur/iga)",
      "2 liter air",
      "3 lembar daun jeruk",
      "2 batang serai, memarkan",
      "Lengkuas, memarkan",
      "4 buah kluwek, ambil isinya, rendam air panas",
      "Minyak untuk menumis",
      "Garam, gula, merica secukupnya",
      "Bumbu Halus: 8 siung bawang merah, 4 siung bawang putih, 2 ruas kunyit, 1 sdt ketumbar, 1/2 sdt jintan"
    ],
    steps: [
      "Rebus daging hingga empuk. Angkat daging, potong dadu. Saring kaldu, sisihkan.",
      "Haluskan bumbu halus. Tumis bumbu halus, serai, daun jeruk, lengkuas hingga harum.",
      "Masukkan kluwek yang sudah direndam, aduk rata.",
      "Masukkan potongan daging ke dalam tumisan bumbu, aduk hingga bumbu meresap.",
      "Tuang tumisan daging berbumbu ke dalam kaldu. Masak dengan api kecil hingga bumbu benar-benar meresap.",
      "Tambahkan garam, gula, merica. Koreksi rasa.",
      "Sajikan rawon dengan tauge pendek, telur asin, kerupuk udang, dan sambal terasi."
    ]
  },
  {
    id: 2,
    name: "Tahu Telur",
    image: require("../assets/images/TahuTelur.jpg"), // Path disesuaikan
    shortDescription: "Tahu goreng dan telur dadar, disajikan dengan saus kacang.",
    ingredients: [
      "2 buah tahu putih, potong dadu",
      "3 butir telur ayam",
      "1 batang daun bawang, iris tipis",
      "Garam, merica secukupnya",
      "Minyak untuk menggoreng",
      "Bumbu Kacang: 100gr kacang tanah goreng, 2 siung bawang putih, 3 buah cabai rawit (sesuai selera), 1 sdm gula merah, 1 sdt air asam jawa, air matang secukupnya, garam",
      "Pelengkap: Tauge rebus, kerupuk, bawang goreng, seledri iris"
    ],
    steps: [
      "Kocok lepas telur, masukkan irisan daun bawang, garam, dan merica. Masukkan potongan tahu, aduk rata.",
      "Panaskan minyak, goreng campuran tahu telur hingga matang dan berwarna kecoklatan. Angkat, tiriskan.",
      "Bumbu Kacang: Haluskan semua bahan bumbu kacang, tambahkan air sedikit demi sedikit hingga kekentalan pas.",
      "Penyajian: Tata tahu telur di piring, siram dengan bumbu kacang. Taburi dengan tauge, kerupuk, bawang goreng, dan seledri."
    ]
  },
  {
    id: 3,
    name: "Rujak Cingur",
    image: require("../assets/images/RujakCingur.jpg"), // Path disesuaikan
    shortDescription: "Rujak khas Surabaya dengan cingur (hidung sapi) dan bumbu petis.",
    ingredients: [
      "200 gr cingur sapi, rebus, potong-potong",
      "1 ikat kangkung, siangi, rebus",
      "100 gr tauge, seduh air panas",
      "1 buah mentimun, cacah",
      "1/2 buah nanas, potong-potong",
      "Lontong secukupnya",
      "Tempe & Tahu goreng secukupnya",
      "Kerupuk kanji",
      "Bumbu Petis: 2 sdm petis udang kualitas baik, 1 buah pisang batu muda (parut/ulek), cabai rawit sesuai selera, 1 siung bawang putih goreng, sedikit terasi bakar, kacang tanah goreng, gula merah, air asam jawa, air matang"
    ],
    steps: [
      "Ulek semua bahan bumbu petis hingga halus dan tercampur rata. Tambahkan air sedikit demi sedikit hingga kekentalan pas.",
      "Tata lontong, cingur, kangkung, tauge, mentimun, nanas, tempe, dan tahu goreng di atas piring.",
      "Siram dengan bumbu petis.",
      "Sajikan dengan taburan bawang goreng dan kerupuk kanji."
    ]
  },
  { // <-- Tambahan Bakso Malang
    id: 4,
    name: "Bakso Malang",
    image: require("../assets/images/BaksoMalang.jpeg"), // Path disesuaikan
    shortDescription: "Bakso dengan tahu, siomay, dan kuah kaldu khas Malang.",
    ingredients: [
      "Adonan Bakso: 250 gr daging sapi giling, 100 gr tepung tapioka, 1 putih telur, 2 siung bawang putih (haluskan), es batu secukupnya, garam, merica",
      "Kuah: 1 liter kaldu sapi, 2 siung bawang putih (geprek), 1 batang daun bawang (iris), garam, merica, gula pasir secukupnya",
      "Pelengkap: Tahu putih (belah, kerok tengahnya isi adonan bakso), kulit pangsit (isi adonan bakso, goreng), mie kuning, bihun, sawi hijau, bawang goreng, seledri"
    ],
    steps: [
      "Adonan Bakso: Campur semua bahan adonan bakso, uleni hingga kalis dan bisa dibentuk. Bentuk bulat-bulat.",
      "Rebus bakso dalam air mendidih hingga mengapung dan matang. Angkat.",
      "Kuah: Didihkan kaldu sapi, masukkan bawang putih geprek. Bumbui dengan garam, merica, gula. Masak hingga mendidih. Masukkan irisan daun bawang sesaat sebelum diangkat.",
      "Siapkan tahu isi dan pangsit goreng.",
      "Penyajian: Tata mie kuning, bihun, sawi, bakso, tahu isi, dan pangsit goreng dalam mangkuk. Siram dengan kuah panas. Taburi bawang goreng dan seledri."
    ]
  },
  { // <-- Tambahan Lontong Balap
    id: 5,
    name: "Lontong Balap",
    image: require("../assets/images/LontongBalap.jpg"), // Path disesuaikan
    shortDescription: "Lontong, tahu, tauge, lentho, dan kuah gurih khas Surabaya.",
    ingredients: [
      "Lontong secukupnya, potong-potong",
      "2 buah tahu putih, goreng setengah matang, potong dadu",
      "200 gr tauge, siangi, seduh air panas sebentar",
      "Lentho: 100 gr kacang tolo (rendam semalam, rebus empuk, haluskan kasar), 1/2 kelapa parut (sangrai), 1 lembar daun jeruk, Bumbu Halus Lentho: 2 siung bawang putih, 1 cm kencur, cabai rawit, garam, gula (Bentuk bulat pipih, goreng)",
      "Kuah: 1 liter air, 2 siung bawang putih (iris, goreng), 1 batang daun bawang (iris), 1 sdt kecap manis, garam, merica",
      "Pelengkap: Bawang goreng, sambal petis"
    ],
    steps: [
      "Lentho: Campur semua bahan lentho dan bumbu halus lentho. Bentuk bulat pipih, goreng hingga matang.",
      "Kuah: Didihkan air, masukkan bawang putih goreng dan daun bawang. Tambahkan kecap manis, garam, merica. Masak hingga mendidih. Koreksi rasa.",
      "Penyajian: Tata lontong, tahu goreng, tauge, dan lentho di atas piring/mangkuk.",
      "Siram dengan kuah panas. Taburi bawang goreng.",
      "Sajikan dengan sambal petis."
    ]
  }
];

// Kalo mau dipake buat gambar default di App.jsx:
// Ganti ke gambar yang lebih generik buat default
export const defaultRecipeImage = require("../assets/images/Rawon.jpg"); // Path disesuaikan