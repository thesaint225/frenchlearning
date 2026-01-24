import { supabase } from '@/lib/supabase/client';

/**
 * Allowed file types for video uploads.
 */
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

/**
 * Allowed file types for audio uploads.
 */
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'];

/**
 * Maximum file size in bytes (100MB).
 */
const MAX_FILE_SIZE = 100 * 1024 * 1024;

/**
 * Storage bucket name for lesson files.
 */
const LESSONS_BUCKET = 'lessons';

/**
 * Validates file type for video uploads.
 */
const isValidVideoType = (file: File): boolean => {
  return ALLOWED_VIDEO_TYPES.includes(file.type);
};

/**
 * Validates file type for audio uploads.
 */
const isValidAudioType = (file: File): boolean => {
  return ALLOWED_AUDIO_TYPES.includes(file.type);
};

/**
 * Validates file size.
 */
const isValidFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE;
};

/**
 * Generates a unique file path for a lesson file.
 */
const generateFilePath = (lessonId: string, fileName: string, fileType: 'video' | 'audio'): string => {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${lessonId}/${fileType}_${timestamp}_${sanitizedFileName}`;
};

/**
 * Uploads a video file to Supabase Storage.
 *
 * @param file - The video file to upload
 * @param lessonId - The ID of the lesson this file belongs to
 * @returns Object with data (file path) or error
 */
export const uploadVideoFile = async (
  file: File,
  lessonId: string
): Promise<{ data: string | null; error: Error | null }> => {
  try {
    // Validate file type
    if (!isValidVideoType(file)) {
      return {
        data: null,
        error: new Error(
          `Invalid video file type. Allowed types: ${ALLOWED_VIDEO_TYPES.join(', ')}`
        ),
      };
    }

    // Validate file size
    if (!isValidFileSize(file)) {
      return {
        data: null,
        error: new Error(`File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`),
      };
    }

    // Generate file path
    const filePath = generateFilePath(lessonId, file.name, 'video');

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(LESSONS_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { data: null, error: new Error(`Failed to upload video: ${error.message}`) };
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(LESSONS_BUCKET)
      .getPublicUrl(data.path);

    return { data: urlData.publicUrl, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred during video upload'),
    };
  }
};

/**
 * Uploads an audio file to Supabase Storage.
 *
 * @param file - The audio file to upload
 * @param lessonId - The ID of the lesson this file belongs to
 * @returns Object with data (file path) or error
 */
export const uploadAudioFile = async (
  file: File,
  lessonId: string
): Promise<{ data: string | null; error: Error | null }> => {
  try {
    // Validate file type
    if (!isValidAudioType(file)) {
      return {
        data: null,
        error: new Error(
          `Invalid audio file type. Allowed types: ${ALLOWED_AUDIO_TYPES.join(', ')}`
        ),
      };
    }

    // Validate file size
    if (!isValidFileSize(file)) {
      return {
        data: null,
        error: new Error(`File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`),
      };
    }

    // Generate file path
    const filePath = generateFilePath(lessonId, file.name, 'audio');

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(LESSONS_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { data: null, error: new Error(`Failed to upload audio: ${error.message}`) };
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(LESSONS_BUCKET)
      .getPublicUrl(data.path);

    return { data: urlData.publicUrl, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred during audio upload'),
    };
  }
};

/**
 * Deletes a file from Supabase Storage.
 *
 * @param filePath - The path of the file to delete
 * @returns Object with success status or error
 */
export const deleteFile = async (
  filePath: string
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    // Extract bucket and path from full URL or use path directly
    const path = filePath.includes(LESSONS_BUCKET)
      ? filePath.split(`${LESSONS_BUCKET}/`)[1]
      : filePath;

    const { error } = await supabase.storage.from(LESSONS_BUCKET).remove([path]);

    if (error) {
      return { success: false, error: new Error(`Failed to delete file: ${error.message}`) };
    }

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error occurred during file deletion'),
    };
  }
};

/**
 * Gets a public URL for a file in Supabase Storage.
 *
 * @param filePath - The path of the file
 * @returns Public URL for the file
 */
export const getFileUrl = (filePath: string): string => {
  const path = filePath.includes(LESSONS_BUCKET)
    ? filePath.split(`${LESSONS_BUCKET}/`)[1]
    : filePath;

  const { data } = supabase.storage.from(LESSONS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
};

/**
 * Validates if a URL is a valid external video/audio URL.
 * Supports YouTube, Vimeo, and direct video/audio URLs.
 *
 * @param url - The URL to validate
 * @returns True if the URL is valid, false otherwise
 */
export const isValidExternalUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Check for YouTube
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return true;
    }

    // Check for Vimeo
    if (hostname.includes('vimeo.com')) {
      return true;
    }

    // Check for direct video/audio file URLs
    const validExtensions = ['.mp4', '.webm', '.ogg', '.mp3', '.wav', '.m4a'];
    const pathname = urlObj.pathname.toLowerCase();
    if (validExtensions.some((ext) => pathname.endsWith(ext))) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};
