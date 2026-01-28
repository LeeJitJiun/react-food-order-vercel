import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  X,
  Loader2,
  Trash2,
  Edit,
} from "lucide-react";

interface Product {
  productId: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  categoryId?: string;
}

interface Category {
  categoryId: string;
  name: string;
}

export default function ItemManageView({
  products,
  onRefresh,
}: {
  products: Product[];
  onRefresh: () => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState<Partial<Product>>({});
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/category");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      price: 0,
      stock: 0,
      categoryId: categories[0]?.categoryId || "",
    });
    setIsEditMode(false);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleOpenEdit = (product: Product) => {
    setFormData(product);
    setIsEditMode(true);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      // UPDATED TO SINGULAR URL
      await fetch("/api/product", {
        method: "DELETE",
        body: JSON.stringify({ productId }),
      });
      onRefresh();
    } catch (e) {
      alert("Failed to delete");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const method = isEditMode ? "PUT" : "POST";

      // UPDATED TO SINGULAR URL
      const res = await fetch("/api/product", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Error: ${data.error}`);
      } else {
        setIsModalOpen(false);
        onRefresh();
      }
    } catch (error) {
      alert("Network error. Check console.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-[#3e3a36] dark:text-white">
          Menu Items
        </h2>
        <button
          onClick={handleOpenAdd}
          className="bg-[#3e3a36] dark:bg-white text-white dark:text-[#3e3a36] px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Plus size={18} /> Add Product
        </button>
      </header>

      <div className="bg-gray-50 dark:bg-white/5 rounded-[2.5rem] p-6 min-h-[500px]">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search menu..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-none outline-none focus:ring-2 ring-[#c8a47e]/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => (
            <div
              key={product.productId}
              className="bg-white dark:bg-[#3e3a36] p-4 rounded-3xl flex items-center justify-between group hover:shadow-lg transition-all relative"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl">
                  🍔
                </div>
                <div>
                  <h4 className="font-bold text-lg dark:text-white">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">
                    {product.category}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-8 mr-4">
                <div className="text-right">
                  <p className="font-black text-lg dark:text-white">
                    RM {product.price?.toFixed(2)}
                  </p>
                  <p
                    className={`text-xs font-bold ${product.stock > 10 ? "text-emerald-500" : "text-red-500"}`}
                  >
                    {product.stock} in stock
                  </p>
                </div>
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === product.productId
                          ? null
                          : product.productId,
                      )
                    }
                    className="p-2 hover:bg-gray-50 rounded-full"
                  >
                    <MoreVertical size={20} className="text-gray-400" />
                  </button>
                  {openMenuId === product.productId && (
                    <div className="absolute right-0 top-10 bg-white shadow-xl rounded-xl p-2 z-10 min-w-[150px] flex flex-col gap-1 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.productId)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg w-full text-left"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="text-center p-8 text-gray-400">
              No products found. Add some!
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#2d2a26] w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black dark:text-white">
                {isEditMode ? "Edit Product" : "New Product"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-2">
                  Product Name
                </label>
                <input
                  required
                  className="w-full p-4 bg-gray-50 dark:bg-white/5 rounded-2xl font-bold dark:text-white focus:ring-2 ring-[#c8a47e]"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-2">
                  Category
                </label>
                <select
                  required
                  className="w-full p-4 bg-gray-50 dark:bg-[#3e3a36] rounded-2xl font-bold text-gray-900 dark:text-white focus:ring-2 ring-[#c8a47e]"
                  value={formData.categoryId || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                >
                  {categories.map((cat) => (
                    <option
                      key={cat.categoryId}
                      value={cat.categoryId}
                      className="bg-white dark:bg-[#3e3a36] text-gray-900 dark:text-white"
                    >
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase ml-2">
                    Price (RM)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    className="w-full p-4 bg-gray-50 dark:bg-white/5 rounded-2xl font-bold dark:text-white focus:ring-2 ring-[#c8a47e]"
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase ml-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full p-4 bg-gray-50 dark:bg-white/5 rounded-2xl font-bold dark:text-white focus:ring-2 ring-[#c8a47e]"
                    value={formData.stock || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <button
                disabled={isLoading}
                type="submit"
                className="w-full bg-[#3e3a36] dark:bg-white text-white dark:text-[#3e3a36] py-4 rounded-2xl font-black text-lg hover:scale-[1.02] transition-transform mt-4 flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : isEditMode ? (
                  "Save Changes"
                ) : (
                  "Create Product"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
