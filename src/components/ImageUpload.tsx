import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onImageSelect: (url: string) => void;
  currentImage?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, currentImage }) => {
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar el tamaño del archivo (máximo 2MB para la versión gratuita de ImgBB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    // Verificar el tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload only image files');
      return;
    }

    try {
      toast.loading('Uploading image...');
      
      // Crear FormData para ImgBB
      const formData = new FormData();
      formData.append('image', file);
      formData.append('key', import.meta.env.VITE_IMGBB_API_KEY);

      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onImageSelect(data.data.display_url); // Usando display_url para obtener la URL directa
        toast.dismiss();
        toast.success('Image uploaded successfully');
      } else {
        throw new Error(data.error?.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.dismiss();
      toast.error('Failed to upload image. Please try again.');
    }
  }, [onImageSelect]);

  return (
    <div className="mt-2">
      <div className="flex items-center gap-4">
        {currentImage && (
          <img
            src={currentImage}
            alt="Preview"
            className="w-24 h-24 object-cover rounded-lg"
          />
        )}
        <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-indigo-600 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="h-6 w-6 text-gray-400" />
            <p className="text-xs text-gray-500 mt-2">Upload Image</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </label>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Supported formats: JPG, PNG, GIF (max. 2MB)
      </p>
    </div>
  );
};