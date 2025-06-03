// src/services/Firebase.js
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

const RECIPES_COLLECTION = 'Resep'; // Sesuaikan jika nama koleksi Abang berbeda

const mapFirestoreRecipeToAppFormat = (doc) => {
  if (!doc.exists) return null;
  const data = doc.data();
  return {
    id: doc.id,
    name: data.NamaResep || '',
    image: data.Foto ? { uri: data.Foto } : null, // Foto adalah URL dari backend eksternal
    shortDescription: data.DeskripsiSingkat || '',
    ingredients: Array.isArray(data.BahanBahan) ? data.BahanBahan : [],
    steps: Array.isArray(data.Langkah) ? data.Langkah : [],
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
  };
};

const mapAppRecipeToFirestoreFormat = (recipeDataFromApp, isUpdate = false) => {
  const firestorePayload = {
    NamaResep: recipeDataFromApp.name,
    DeskripsiSingkat: recipeDataFromApp.shortDescription,
    BahanBahan: recipeDataFromApp.ingredients,
    Langkah: recipeDataFromApp.steps,
    Foto: recipeDataFromApp.imageUrl, // URL dari backend eksternal, bisa null
  };
  if (!isUpdate) {
    firestorePayload.createdAt = firestore.FieldValue.serverTimestamp();
  }
  return firestorePayload;
};

export const getAllRecipesFirestore = async () => {
  try {
    const snapshot = await firestore()
      .collection(RECIPES_COLLECTION)
      .orderBy('createdAt', 'desc') // PERHATIAN: Membutuhkan index di Firestore
      .get();
    if (snapshot.empty) {
      console.log("Tidak ada resep ditemukan di Firestore.");
      return [];
    }
    const recipes = snapshot.docs.map(mapFirestoreRecipeToAppFormat);
    console.log(`Berhasil mengambil ${recipes.length} resep dari Firestore.`);
    return recipes;
  } catch (error) {
    console.error('Error getAllRecipesFirestore:', error);
    Alert.alert("Error Data", "Gagal mengambil daftar resep. Pastikan index 'createdAt' sudah dibuat di Firestore jika menggunakan orderBy.");
    throw error;
  }
};

export const getRecipeByIdFirestore = async (recipeId) => {
  try {
    const doc = await firestore().collection(RECIPES_COLLECTION).doc(recipeId).get();
    if (!doc.exists) {
      console.log(`Resep dengan ID ${recipeId} tidak ditemukan.`);
      return null;
    }
    return mapFirestoreRecipeToAppFormat(doc);
  } catch (error) {
    console.error(`Error getRecipeByIdFirestore (ID: ${recipeId}):`, error);
    Alert.alert("Error Data", `Gagal mengambil detail resep.`);
    throw error;
  }
};

export const addNewRecipeFirestore = async (recipePayloadWithImageUrl) => {
  try {
    const firestorePayload = mapAppRecipeToFirestoreFormat(recipePayloadWithImageUrl, false);
    const docRef = await firestore().collection(RECIPES_COLLECTION).add(firestorePayload);
    const newDocSnapshot = await docRef.get();
    console.log("Resep baru ditambahkan ke Firestore, ID:", docRef.id);
    return mapFirestoreRecipeToAppFormat(newDocSnapshot);
  } catch (error) {
    console.error("Error addNewRecipeFirestore:", error);
    Alert.alert("Gagal Simpan", "Gagal menambahkan resep baru ke Firestore.");
    throw error;
  }
};

export const updateRecipeFirestore = async (recipeId, recipePayloadWithImageUrl) => {
  try {
    const firestorePayload = mapAppRecipeToFirestoreFormat(recipePayloadWithImageUrl, true);
    const recipeRef = firestore().collection(RECIPES_COLLECTION).doc(recipeId);
    await recipeRef.update(firestorePayload);
    const updatedDocSnapshot = await recipeRef.get();
    console.log("Resep berhasil diperbarui di Firestore, ID:", recipeId);
    return mapFirestoreRecipeToAppFormat(updatedDocSnapshot);
  } catch (error) {
    console.error(`Error updateRecipeFirestore (ID: ${recipeId}):`, error);
    Alert.alert("Gagal Update", "Gagal memperbarui resep di Firestore.");
    throw error;
  }
};

export const deleteRecipeFirestore = async (recipeId) => {
  try {
    // Penghapusan gambar dari backend eksternal (jika ada endpointnya)
    // sebaiknya ditangani di RecipeDetailScreen sebelum memanggil ini,
    // karena Firebase.js tidak tahu menahu tentang backend eksternal tersebut.
    await firestore().collection(RECIPES_COLLECTION).doc(recipeId).delete();
    console.log("Resep berhasil dihapus dari Firestore, ID:", recipeId);
    return { id: recipeId, message: "Resep berhasil dihapus dari Firestore" };
  } catch (error) {
    console.error(`Error deleteRecipeFirestore (ID: ${recipeId}):`, error);
    Alert.alert("Gagal Hapus", "Gagal menghapus resep dari Firestore.");
    throw error;
  }
};