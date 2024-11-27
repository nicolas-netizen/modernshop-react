import React, { useState, useRef } from 'react';
import { useProductStore } from '../../store/useProductStore';
import { Plus, Trash, Edit, Save, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadToImgBB } from '../../services/imgbbService';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types';

const AdminProducts = () => {
  const { products, categories, addProduct, deleteProduct, updateProduct, addCategory, deleteCategory } = useProductStore();
  const { storeEmail, setStoreEmail } = useSettingsStore();
  const [newCategory, setNewCategory] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: '',
    category: '',
    imageUrl: '',
    description: '',
    stock: 0
  });
  const [editingEmail, setEditingEmail] = useState(false);
  const [email, setEmail] = useState(storeEmail || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      try {
        toast.loading('Agregando categoría...', { id: 'addCategory' });
        await addCategory(newCategory.trim());
        toast.success('Categoría agregada exitosamente', { id: 'addCategory' });
        setNewCategory('');
      } catch (error) {
        toast.error('Error al agregar la categoría', { id: 'addCategory' });
      }
    }
  };

  const handleDeleteCategory = async (category: string) => {
    try {
      toast.loading('Eliminando categoría...', { id: 'deleteCategory' });
      await deleteCategory(category);
      toast.success('Categoría eliminada exitosamente', { id: 'deleteCategory' });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { id: 'deleteCategory' });
      } else {
        toast.error('Error al eliminar la categoría', { id: 'deleteCategory' });
      }
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe ser menor a 5MB');
      return;
    }

    try {
      setUploading(true);
      toast.loading('Subiendo imagen...', { id: 'uploadImage' });

      const imageUrl = await uploadToImgBB(file);
      setNewProduct(prev => ({ ...prev, imageUrl }));
      
      toast.success('Imagen subida exitosamente', { id: 'uploadImage' });
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      toast.error('Error al subir la imagen. Intenta de nuevo.', { id: 'uploadImage' });
    } finally {
      setUploading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.stock) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      toast.loading('Agregando producto...', { id: 'addProduct' });
      
      const productToAdd: Product = {
        id: Date.now().toString(),
        name: newProduct.name,
        description: newProduct.description || '',
        price: parseFloat(newProduct.price as string),
        category: newProduct.category,
        imageUrl: newProduct.imageUrl || '',
        stock: parseInt(newProduct.stock as string) || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addProduct(productToAdd);
      toast.success('Producto agregado exitosamente', { id: 'addProduct' });

      setNewProduct({
        name: '',
        price: '',
        category: '',
        imageUrl: '',
        description: '',
        stock: 0
      });
    } catch (error) {
      console.error('Error al agregar producto:', error);
      toast.error('Error al agregar el producto', { id: 'addProduct' });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      toast.loading('Eliminando producto...', { id: 'deleteProduct' });
      await deleteProduct(productId);
      toast.success('Producto eliminado exitosamente', { id: 'deleteProduct' });
    } catch (error) {
      toast.error('Error al eliminar el producto', { id: 'deleteProduct' });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      imageUrl: product.imageUrl,
      description: product.description,
      stock: product.stock
    });
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.stock) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      toast.loading('Actualizando producto...', { id: 'updateProduct' });
      
      const updatedProduct: Product = {
        ...editingProduct,
        name: newProduct.name,
        description: newProduct.description || '',
        price: parseFloat(newProduct.price as string),
        category: newProduct.category,
        imageUrl: newProduct.imageUrl || '',
        stock: parseInt(newProduct.stock as string) || 0,
        updatedAt: new Date()
      };

      await updateProduct(updatedProduct);
      toast.success('Producto actualizado exitosamente', { id: 'updateProduct' });

      setEditingProduct(null);
      setNewProduct({
        name: '',
        price: '',
        category: '',
        imageUrl: '',
        description: '',
        stock: 0
      });
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      toast.error('Error al actualizar el producto', { id: 'updateProduct' });
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setNewProduct({
      name: '',
      price: '',
      category: '',
      imageUrl: '',
      description: '',
      stock: 0
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestión de Productos</h1>
      
      {/* Gestión de Categorías */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Categorías</h2>
        <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Nueva categoría"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5" />
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <div
              key={category}
              className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded"
            >
              <span>{category}</span>
              <button
                onClick={() => handleDeleteCategory(category)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario de Productos */}
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          {editingProduct ? 'Editar Producto' : 'Agregar Producto'}
        </h2>
        <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="grid gap-4 mb-6">
          <input
            type="text"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="p-2 border rounded"
            placeholder="Nombre del producto"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="p-2 border rounded"
              placeholder="Precio"
              required
              min="0"
              step="0.01"
            />
            <input
              type="number"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              className="p-2 border rounded"
              placeholder="Stock"
              required
              min="0"
            />
          </div>
          <select
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            className="p-2 border rounded"
            required
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
          {/* Subida de imagen */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newProduct.imageUrl}
                onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                className="flex-1 p-2 border rounded"
                placeholder="URL de la imagen o sube una imagen"
                required
              />
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(file);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`px-4 py-2 text-white rounded flex items-center gap-2 ${
                  uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700'
                }`}
                disabled={uploading}
              >
                {uploading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Subiendo...
                  </div>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    Subir
                  </>
                )}
              </button>
            </div>
            
            {/* Vista previa de la imagen */}
            {newProduct.imageUrl && (
              <div className="relative w-full h-48 bg-gray-100 rounded overflow-hidden">
                <img
                  src={newProduct.imageUrl}
                  alt="Vista previa"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = '/placeholder.png';
                  }}
                />
              </div>
            )}
          </div>

          <textarea
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="p-2 border rounded"
            placeholder="Descripción del producto"
            rows={4}
            required
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
              disabled={uploading}
            >
              {uploading ? (
                'Subiendo imagen...'
              ) : (
                <>
                  {editingProduct ? <Save className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  {editingProduct ? 'Guardar Cambios' : 'Agregar Producto'}
                </>
              )}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-2"
              >
                <X className="h-5 w-5" />
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Lista de Productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border rounded p-4 hover:shadow-lg transition-shadow">
              <div 
                onClick={() => navigate(`/products/${product.id}`)} 
                className="cursor-pointer"
              >
                <div className="relative w-full h-48 bg-gray-100 rounded overflow-hidden mb-2">
                  <img
                    src={product.imageUrl || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = '/placeholder.png';
                    }}
                  />
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
                    product.stock > 10 
                      ? 'bg-green-100 text-green-800'
                      : product.stock > 0
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 10 
                      ? 'En stock'
                      : product.stock > 0
                      ? `${product.stock} unidades`
                      : 'Sin stock'}
                  </div>
                </div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-600">${product.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{product.description}</p>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="flex-1 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center justify-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="flex-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center gap-1"
                >
                  <Trash className="h-4 w-4" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
