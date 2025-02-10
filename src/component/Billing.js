"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Trash2, Printer, ArrowLeft, Check } from "lucide-react"


const products = [
  
    {
      "id": 1,
      "name": "Galvanized Steel Pipe",
      "price": 49.99,
      "category": "Pipes",
      "sku": "HP-001",
      "image": "https://i.pinimg.com/736x/72/9d/3d/729d3d0372bb4e1146a34ba87aa92b0b.jpg",
      "description": "Durable galvanized steel pipe for plumbing and construction."
    },
    {
      "id": 2,
      "name": "PVC Pipe 2-inch",
      "price": 19.99,
      "category": "Pipes",
      "sku": "HP-002",
      "image": "https://i.pinimg.com/736x/17/98/00/1798009d22a3bb54479889e78a446ad5.jpg",
      "description": "Lightweight and corrosion-resistant PVC pipe."
    },
    {
      "id": 3,
      "name": "Copper Pipe 1/2-inch",
      "price": 29.99,
      "category": "Pipes",
      "sku": "HP-003",
      "image": "https://i.pinimg.com/736x/11/09/73/1109738c38e91d8f87a38018f671826e.jpg",
      "description": "High-quality copper pipe for water and gas systems."
    },
    {
      "id": 4,
      "name": "Pipe Wrench 18-inch",
      "price": 24.99,
      "category": "Tools",
      "sku": "HT-004",
      "image": "https://i.pinimg.com/736x/3b/8d/72/3b8d7207e505a80215f62e3a73c60e77.jpg",
      "description": "Heavy-duty pipe wrench for gripping and turning pipes."
    },
    {
      "id": 5,
      "name": "Teflon Tape (Plumber’s Tape)",
      "price": 2.99,
      "category": "Accessories",
      "sku": "HA-005",
      "image": "https://i.pinimg.com/736x/c4/db/1c/c4db1cf3037f4c445163103a74575447.jpg",
      "description": "Sealing tape for leak-proof pipe fittings."
    }
  
  
]

const categories = [...new Set(products.map((p) => p.category))]
 function Billing() {
  const [step, setStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [billItems, setBillItems] = useState([])
  const [formData, setFormData] = useState({
    billNo: "",
    name: "",
    email: "",
    mobile: "",
    address: "",
    gst: "",
  })
  const [showSummary, setShowSummary] = useState(false)
  const [notification, setNotification] = useState(null)

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const addToCart = (product) => {
    const existingItem = billItems.find((item) => item.productId === product.id)
    if (existingItem) {
      setBillItems(
        billItems.map((item) => (item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item)),
      )
    } else {
      setBillItems([
        ...billItems,
        {
          id: Date.now(),
          productId: product.id,
          quantity: 1,
          price: product.price,
        },
      ])
    }
    showNotification(`Added ${product.name} to cart`)
  }

  const removeFromCart = (itemId) => {
    setBillItems(billItems.filter((item) => item.id !== itemId))
    showNotification("Item removed from cart", "error")
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return
    setBillItems(billItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
  }

  const calculateTotal = () => {
    return billItems.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId)
      return total + product.price * item.quantity
    }, 0)
  }

  const handlePrint = () => {
    window.print()
  }

  const isFormValid = () => {
    return Object.values(formData).every((value) => value.trim() !== "") && billItems.length > 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8  mt-14">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Steps */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          {["Select Products", "Customer Details", "Review & Confirm"].map((stepName, index) => (
            <div key={stepName} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step > index + 1 ? "bg-green-500" : step === index + 1 ? "bg-blue-500" : "bg-gray-300"
                } text-white`}
              >
                {step > index + 1 ? <Check size={16} /> : index + 1}
              </div>
              <div className="ml-2 hidden md:block">{stepName}</div>
              {index < 2 && (
                <div className="w-24 h-1 mx-4 hidden md:block bg-gray-200">
                  <div
                    className={`h-full ${step > index + 1 ? "bg-green-500" : "bg-gray-300"}`}
                    style={{ width: step > index + 1 ? "100%" : "0%" }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="mb-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="All">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500">SKU: {product.sku}</span>
                          <span className="font-bold text-lg">₹{product.price}</span>
                        </div>
                        <button
                          onClick={() => addToCart(product)}
                          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Add to Bill
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-bold mb-6">Customer Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Bill No</label>
                    <input
                      type="text"
                      value={formData.billNo}
                      onChange={(e) => setFormData({ ...formData, billNo: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Mobile</label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">GST Number</label>
                    <input
                      type="text"
                      value={formData.gst}
                      onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && !showSummary && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-bold mb-6">Review Order</h2>
                <div className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Customer Information</h3>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <p>
                        <span className="font-medium">Bill No:</span> {formData.billNo}
                      </p>
                      <p>
                        <span className="font-medium">Name:</span> {formData.name}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {formData.email}
                      </p>
                      <p>
                        <span className="font-medium">Mobile:</span> {formData.mobile}
                      </p>
                      <p className="md:col-span-2">
                        <span className="font-medium">Address:</span> {formData.address}
                      </p>
                      <p>
                        <span className="font-medium">GST:</span> {formData.gst}
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Order Summary</h3>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Product</th>
                          <th className="text-left py-2">Quantity</th>
                          <th className="text-right py-2">Price</th>
                          <th className="text-right py-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {billItems.map((item) => {
                          const product = products.find((p) => p.id === item.productId)
                          return (
                            <tr key={item.id} className="border-b">
                              <td className="py-2">{product.name}</td>
                              <td className="py-2">{item.quantity}</td>
                              <td className="py-2 text-right">₹{product.price.toFixed(2)}</td>
                              <td className="py-2 text-right">₹{(product.price * item.quantity).toFixed(2)}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3" className="py-2 text-right font-bold">
                            Total:
                          </td>
                          <td className="py-2 text-right font-bold">₹{calculateTotal().toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Floating Cart/Summary Panel */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">BILL SUMMARY</h3>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{billItems.length} items</div>
              </div>

              <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
                {billItems.map((item) => {
                  const product = products.find((p) => p.id === item.productId)
                  return (
                    <motion.div key={item.id} layout className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={product.image || "https://i.pinimg.com/736x/3e/b5/bd/3eb5bd4b6416cebfcd806281f87c2d2f.jpg"}
                          alt="img"

                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-gray-500">₹{product.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border rounded">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-2">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                {step < 3 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={step === 1 && billItems.length === 0}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSummary(true)}
                    disabled={!isFormValid()}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300"
                  >
                    Generate Bill
                  </button>
                )}
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="w-full border border-blue-500 text-blue-500 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Back
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bill Summary View */}
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-8 print:shadow-none"
          >
            <div className="flex justify-between items-center mb-8 print:hidden">
              <button
                onClick={() => setShowSummary(false)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={20} />
                Back to Review
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                <Printer size={20} />
                Print Bill
              </button>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Pipe Shop</h1>
                <p className="text-gray-500">#{formData.billNo}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h2 className="font-bold mb-2">Bill To:</h2>
                  <div className="space-y-1">
                    <p className="font-medium">{formData.name}</p>
                    <p>{formData.address}</p>
                    <p>Phone: {formData.mobile}</p>
                    <p>Email: {formData.email}</p>
                    {formData.gst && <p>GST: {formData.gst}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="font-bold mb-2">Bill Details:</h2>
                  <div className="space-y-1">
                    <p>Date: {new Date().toLocaleDateString()}</p>
                    <p>Time: {new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>

              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-2">Product Details</th>
                    <th className="text-center py-2">Quantity</th>
                    <th className="text-right py-2">Unit Price</th>
                    <th className="text-right py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {billItems.map((item) => {
                    const product = products.find((p) => p.id === item.productId)
                    return (
                      <tr key={item.id} className="border-b">
                        <td className="py-2">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                          </div>
                        </td>
                        <td className="text-center py-2">{item.quantity}</td>
                        <td className="text-right py-2">₹{product.price.toFixed(2)}</td>
                        <td className="text-right py-2">₹{(product.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="font-bold">
                    <td colSpan="3" className="text-right py-4">
                      Total Amount:
                    </td>
                    <td className="text-right py-4">₹{calculateTotal().toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>

              <div className="border-t pt-8 text-center text-gray-500">
                <p>Thank you for your business!</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Billing
