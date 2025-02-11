import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Save, Package, DollarSign, BarChart2 } from 'lucide-react';

function Product() {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [
      {
        id: 1,
        name: 'Premium Headphones',
        price: 199.99,
        quantity: 50,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        category: 'Electronics'
      },
      {
        id: 2,
        name: 'Smart Watch',
        price: 299.99,
        quantity: 30,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        category: 'Accessories'
      }
    ];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    image: '',
    category: ''
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { ...formData, id: p.id } : p
      ));
      showNotification('Product updated successfully!');
    } else {
      const newProduct = { ...formData, id: Date.now() };
      setProducts([...products, newProduct]);
      showNotification('Product added successfully!');
    }
    handleCloseModal();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowAddModal(true);
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
      showNotification('Product deleted successfully!', 'error');
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingProduct(null);
    setFormData({ name: '', price: '', quantity: '', image: '', category: '' });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = products.reduce((acc, product) => acc + (product.price * product.quantity), 0);
  const totalProducts = products.length;
  const totalStock = products.reduce((acc, product) => acc + product.quantity, 0);

  return (
    <div className="max-w-[1400px] mx-auto p-4">
      {notification && (
        <div className={`fixed top-4 right-4 p-3 rounded-lg shadow-lg z-50 ${
          notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
        } text-white text-sm animate-fade-in-down`}>
          <p className="flex items-center gap-2">
            {notification.type === 'success' ? <Save className="w-4 h-4" /> : <X className="w-4 h-4" />}
            {notification.message}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-6 mt-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Products</h1>
          <p className="text-sm text-slate-500">Manage your product catalog</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Products</p>
              <p className="text-xl font-semibold text-slate-800">{totalProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <BarChart2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Stock</p>
              <p className="text-xl font-semibold text-slate-800">{totalStock}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Value</p>
              <p className="text-xl font-semibold text-slate-800">${totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="group relative bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-slate-800 text-sm truncate">{product.name}</h3>
                <div className="flex items-center justify-between mt-2 mb-3">
                  <span className="text-lg font-semibold text-indigo-600">${product.price}</span>
                  <span className="text-xs font-medium text-slate-500">Stock: {product.quantity}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 rounded border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="Product name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 rounded border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="Category"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 rounded border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 rounded border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 rounded border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingProduct ? 'Update' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Product;