import { supabase, BUCKET_NAME } from './supabase';
import { Meme, UploadResult } from '../types';

export const uploadMeme = async (file: File): Promise<UploadResult> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error al subir:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return { success: true, path: publicUrl };
  } catch (error) {
    console.error('Error al subir el meme:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Error desconocido al subir el archivo' };
  }
};

export const getMemes = async (): Promise<Meme[]> => {
  try {
    const { data, error: listError } = await supabase.storage
      .from(BUCKET_NAME)
      .list();

    if (listError) {
      console.error('Error al listar:', listError);
      throw listError;
    }

    if (!data) return [];

    return data.map(item => ({
      name: item.name,
      url: supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(item.name).data.publicUrl
    }));
  } catch (error) {
    console.error('Error al obtener memes:', error);
    if (error instanceof Error) {
      console.error('Error al obtener memes:', error.message);
    } else {
      console.error('Error desconocido al obtener memes');
    }
    return [];
  }
};