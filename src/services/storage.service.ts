import { supabaseAdmin } from '@/config/supabase';
import { env } from '@/config/env';

const BUCKET = 'boxes';

/**
 * Sube una imagen de caja al bucket 'boxes' en Supabase Storage.
 * @returns URL pública de la imagen subida
 */
export async function uploadBoxImage(
  file: Buffer,
  filename: string,
  mimetype: string
): Promise<string> {
  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(filename, file, {
      contentType: mimetype,
      upsert: true,
    });

  if (error) {
    throw new Error(`Error al subir imagen: ${error.message}`);
  }

  return `${env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filename}`;
}

/**
 * Elimina una imagen de caja del bucket 'boxes' en Supabase Storage.
 */
export async function deleteBoxImage(filename: string): Promise<void> {
  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .remove([filename]);

  if (error) {
    throw new Error(`Error al eliminar imagen: ${error.message}`);
  }
}
