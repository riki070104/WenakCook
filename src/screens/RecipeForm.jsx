// src/screens/RecipeForm.jsx
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  addNewRecipeFirestore,
  updateRecipeFirestore,
} from '../services/Firebase'; // Pastikan path ini benar

// Impor Notifee
import notifee, {AndroidImportance} from '@notifee/react-native';

const RecipeForm = ({navigation, route}) => {
  const {
    recipe: recipeToEdit,
    isEdit,
    onFormSubmitSuccess,
  } = route.params || {};

  // State untuk form fields
  const [recipeName, setRecipeName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [ingredientsList, setIngredientsList] = useState([]);
  const [currentStep, setCurrentStep] = useState('');
  const [stepsList, setStepsList] = useState([]);

  // State untuk gambar
  const [imageUri, setImageUri] = useState(null); // URI lokal dari image picker, atau URL http jika sudah ada dari edit
  const [currentSavedImageUrl, setCurrentSavedImageUrl] = useState(null); // URL gambar yg tersimpan di DB (untuk mode edit)

  // State untuk mode edit dan proses submit
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Variabel ini tidak perlu state, nilainya diturunkan dari props/state lain
  const screenTitle = isEdit ? 'Edit Resep' : 'Tambah Resep Baru';
  const submitButtonText = isEdit ? 'Simpan Perubahan' : 'Simpan Resep';

  useEffect(() => {
    if (isEdit && recipeToEdit) {
      setRecipeName(recipeToEdit.name || '');
      setShortDescription(recipeToEdit.shortDescription || '');
      setIngredientsList(
        Array.isArray(recipeToEdit.ingredients) ? recipeToEdit.ingredients : [],
      );
      setStepsList(Array.isArray(recipeToEdit.steps) ? recipeToEdit.steps : []);
      const existingImageUri = recipeToEdit.image?.uri || null;
      setImageUri(existingImageUri); // Untuk display awal dan perbandingan apakah diubah
      setCurrentSavedImageUrl(existingImageUri); // Simpan URL asli dari DB untuk referensi
      setEditingRecipeId(recipeToEdit.id);
    } else {
      // Reset form untuk mode tambah
      setRecipeName('');
      setShortDescription('');
      setIngredientsList([]);
      setStepsList([]);
      setImageUri(null);
      setCurrentSavedImageUrl(null);
      setEditingRecipeId(null);
    }
  }, [isEdit, recipeToEdit]);

  const handleChoosePhoto = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.7,
      maxWidth: 800,
      maxHeight: 800,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('Pengguna batal memilih gambar');
        return;
      }
      if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert(
          'Error Pilih Gambar',
          `Tidak bisa memilih gambar: ${response.errorMessage}. Pastikan izin sudah diberikan.`,
        );
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri); // Ini akan menjadi URI lokal baru
        console.log('Gambar baru dipilih (URI lokal):', response.assets[0].uri);
      }
    });
  };

  const handleAddIngredient = () => {
    if (currentIngredient.trim() !== '') {
      setIngredientsList([...ingredientsList, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const handleRemoveIngredient = indexToRemove => {
    setIngredientsList(prevIngredients =>
      prevIngredients.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleAddStep = () => {
    if (currentStep.trim() !== '') {
      setStepsList([...stepsList, currentStep.trim()]);
      setCurrentStep('');
    }
  };

  const handleRemoveStep = indexToRemove => {
    setStepsList(prevSteps =>
      prevSteps.filter((_, index) => index !== indexToRemove),
    );
  };

  const displayLocalNotification = async (title, body) => {
    try {
      await notifee.requestPermission();
      const channelId = await notifee.createChannel({
        id: 'recipe-success', // ID channel yang lebih spesifik
        name: 'Notifikasi Sukses Resep',
        importance: AndroidImportance.HIGH,
      });
      await notifee.displayNotification({
        title: title,
        body: body,
        android: {
          channelId: channelId,
          pressAction: {id: 'default'},
          // smallIcon: 'ic_notification', // Ganti 'ic_notification' dengan nama file ikon di android/app/src/main/res/drawable
        },
        ios: {sound: 'default'},
      });
    } catch (error) {
      console.error('Gagal menampilkan notifikasi lokal:', error);
    }
  };

  const handleSubmit = async () => {
    if (recipeName.trim() === '') {
      Alert.alert('Input Kurang', 'Nama resep wajib diisi.');
      return;
    }
    if (ingredientsList.length === 0) {
      Alert.alert('Input Kurang', 'Bahan minimal satu.');
      return;
    }
    if (stepsList.length === 0) {
      Alert.alert('Input Kurang', 'Langkah minimal satu.');
      return;
    }
    if (!isEdit && !imageUri) {
      Alert.alert('Input Kurang', 'Foto resep wajib untuk resep baru.');
      return;
    }

    setIsSubmitting(true);
    let finalImageUrlToSave = currentSavedImageUrl;

    try {
      const isNewImageSelected =
        imageUri &&
        imageUri !== currentSavedImageUrl &&
        !imageUri.startsWith('http');
      const isImageRemovedByUser =
        imageUri === null && isEdit && currentSavedImageUrl;

      if (isNewImageSelected) {
        console.log('Mengunggah gambar baru ke backend eksternal...');
        const localUri = imageUri;
        let filename = localUri.substring(localUri.lastIndexOf('/') + 1);
        const extension = filename.split('.').pop() || 'jpg';
        const nameWithoutExtension =
          filename.split('.').slice(0, -1).join('.') || `image_${Date.now()}`;
        filename = `${nameWithoutExtension}_${Date.now()}.${extension}`;

        const imageFormData = new FormData();
        imageFormData.append('file', {
          uri: localUri,
          type: `image/${extension}`,
          name: filename,
        });

        const uploadResponse = await fetch(
          'https://backend-file-praktikum.vercel.app/upload/',
          {method: 'POST', body: imageFormData},
        );
        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(
            `Gagal unggah gambar: ${uploadResponse.status} ${errorText}`,
          );
        }
        const uploadResult = await uploadResponse.json();
        finalImageUrlToSave = uploadResult.url;
      } else if (isImageRemovedByUser) {
        finalImageUrlToSave = null;
        // TODO: Jika backend eksternal punya API untuk hapus gambar, panggil di sini untuk currentSavedImageUrl
      }
      // Jika tidak ada perubahan gambar (imageUri === currentSavedImageUrl) atau gambar tidak diubah (imageUri adalah URL http lama),
      // maka finalImageUrlToSave akan tetap bernilai currentSavedImageUrl.

      const recipePayloadForFirestore = {
        name: recipeName.trim(),
        shortDescription: shortDescription.trim(),
        imageUrl: finalImageUrlToSave, // Ini adalah URL dari backend eksternal, atau null
        ingredients: ingredientsList,
        steps: stepsList,
      };

      let savedRecipe;
      if (isEdit && editingRecipeId) {
        savedRecipe = await updateRecipeFirestore(
          editingRecipeId,
          recipePayloadForFirestore,
        );
        Alert.alert(
          'Sukses',
          `Resep "${savedRecipe.name}" berhasil diperbarui!`,
        );
        // Notifikasi untuk update bisa ditambahkan jika mau
        // await displayLocalNotification("Resep Diperbarui! 🍳", `"${savedRecipe.name}" telah sukses diubah.`);
      } else {
        savedRecipe = await addNewRecipeFirestore(recipePayloadForFirestore);
        Alert.alert(
          'Sukses',
          `Resep "${savedRecipe.name}" berhasil ditambahkan!`,
        );
        await displayLocalNotification(
          'Resep Baru Ditambahkan! 🍲',
          `"${savedRecipe.name}" kini ada di koleksi WenakCook.`,
        );
      }

      if (onFormSubmitSuccess && savedRecipe) {
        onFormSubmitSuccess(savedRecipe);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Operasi Gagal', `Terjadi kesalahan: ${error.message}.`);
      console.error('Error saat submit resep:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <View style={styles.headerNav}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => !isSubmitting && navigation.goBack()}
            disabled={isSubmitting}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{screenTitle}</Text>{' '}
          {/* Pemanggilan screenTitle di sini */}
        </View>

        <Text style={styles.label}>Nama Resep:</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: Ayam Geprek"
          value={recipeName}
          onChangeText={setRecipeName}
          editable={!isSubmitting}
        />

        <Text style={styles.label}>Foto Resep:</Text>
        <TouchableOpacity
          style={[
            styles.imagePickerButton,
            isSubmitting && styles.disabledButton,
          ]}
          onPress={handleChoosePhoto}
          disabled={isSubmitting}>
          <Text style={styles.imagePickerButtonText}>
            {imageUri ? 'Ganti Gambar' : 'Pilih Gambar'}
          </Text>
        </TouchableOpacity>
        {imageUri && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{uri: imageUri}} style={styles.imagePreview} />
            <TouchableOpacity
              style={[
                styles.removeImageButton,
                isSubmitting && styles.disabledButton,
              ]}
              onPress={() => !isSubmitting && setImageUri(null)}
              disabled={isSubmitting}>
              <Text style={styles.removeImageButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.label}>Deskripsi Singkat (Opsional):</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Contoh: Ayam geprek pedas..."
          value={shortDescription}
          onChangeText={setShortDescription}
          multiline
          numberOfLines={3}
          editable={!isSubmitting}
        />

        <Text style={styles.label}>Bahan-bahan:</Text>
        {ingredientsList.map((ing, index) => (
          <View key={`ing-${index}`} style={styles.listItemContainer}>
            <Text style={styles.listItemText}>• {ing}</Text>
            <TouchableOpacity
              style={[
                styles.removeListItemButton,
                isSubmitting && styles.disabledButton,
              ]}
              onPress={() => !isSubmitting && handleRemoveIngredient(index)}
              disabled={isSubmitting}>
              <Text style={styles.removeListItemButtonText}>-</Text>
            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.addInputContainer}>
          <TextInput
            style={styles.inputInline}
            placeholder="Ketik satu bahan, lalu Tambah"
            value={currentIngredient}
            onChangeText={setCurrentIngredient}
            onSubmitEditing={handleAddIngredient}
            returnKeyType="done"
            editable={!isSubmitting}
          />
          <TouchableOpacity
            style={[styles.addButton, isSubmitting && styles.disabledButton]}
            onPress={handleAddIngredient}
            disabled={isSubmitting}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Langkah-langkah Memasak:</Text>
        {stepsList.map((step, index) => (
          <View key={`step-${index}`} style={styles.listItemContainer}>
            <Text style={styles.listItemText}>
              {index + 1}. {step}
            </Text>
            <TouchableOpacity
              style={[
                styles.removeListItemButton,
                isSubmitting && styles.disabledButton,
              ]}
              onPress={() => !isSubmitting && handleRemoveStep(index)}
              disabled={isSubmitting}>
              <Text style={styles.removeListItemButtonText}>-</Text>
            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.addInputContainer}>
          <TextInput
            style={styles.inputInline}
            placeholder="Ketik satu langkah, lalu Tambah"
            value={currentStep}
            onChangeText={setCurrentStep}
            onSubmitEditing={handleAddStep}
            returnKeyType="done"
            editable={!isSubmitting}
          />
          <TouchableOpacity
            style={[styles.addButton, isSubmitting && styles.disabledButton]}
            onPress={handleAddStep}
            disabled={isSubmitting}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>{submitButtonText}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Styles dari file RecipeForm.jsx yang Abang berikan di prompt sebelumnya,
// dengan sedikit penyesuaian dari kode final kita.
const styles = StyleSheet.create({
  scrollView: {flex: 1, backgroundColor: '#fff'},
  container: {paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40},
  headerNav: {flexDirection: 'row', alignItems: 'center', marginBottom: 24},
  backButton: {
    backgroundColor: '#f8d3b2',
    padding: 6,
    borderRadius: 8,
    marginRight: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: '#b35400',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
  },
  title: {fontSize: 26, fontWeight: 'bold', color: '#b35400'},
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#b35400',
    marginTop: 24,
    marginBottom: 10,
  },
  input: {
    borderColor: '#d0d0d0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#fdfdfd',
  },
  multilineInput: {minHeight: 90, textAlignVertical: 'top'},
  addInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  inputInline: {
    flex: 1,
    borderColor: '#d0d0d0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginRight: 12,
    backgroundColor: '#fdfdfd',
  },
  addButton: {
    backgroundColor: '#ff7f50',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  listItemContainer: {
    backgroundColor: '#fff0e6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemText: {fontSize: 16, color: '#b35400', flex: 1, marginRight: 10},
  removeListItemButton: {
    backgroundColor: '#ffA07A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    height: 32,
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeListItemButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  imagePickerButton: {
    backgroundColor: '#ff7f50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerButtonText: {fontSize: 16, color: '#fff', fontWeight: '600'},
  imagePreviewContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  imagePreview: {
    width: 300,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
  },
  removeImageButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(255, 127, 80, 0.8)',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 22,
  },
  submitButton: {
    backgroundColor: '#b35400',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 30,
    marginBottom: 40,
    alignItems: 'center',
  },
  submitButtonText: {fontSize: 18, fontWeight: '700', color: '#fff'},
  disabledButton: {opacity: 0.5},
});

export default RecipeForm;
