"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useTrip } from "@/hooks/use-trips"
import { databases, DATABASE_ID, EXPENSES_COLLECTION_ID } from "@/lib/appwrite"
import { ID, Query } from "appwrite"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { 
  Calendar, 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign, 
  Save,
  Loader2,
  TrendingUp,
  TrendingDown,
  Receipt,
  CreditCard,
  Banknote,
  Plane,
  Car,
  Home,
  Utensils,
  ShoppingBag,
  Camera,
  Activity,
  AlertTriangle,
  PieChart,
  BarChart3
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Expense {
  $id: string
  tripId: string
  title: string
  description: string
  amount: number
  category: string
  date: string
  paymentMethod: string
  currency: string
  isShared: boolean
  tags: string[]
  $createdAt: string
  $updatedAt: string
}

const expenseCategories = [
  { id: 'transport', name: 'Transportation', icon: Car, color: 'bg-blue-100 text-blue-800' },
  { id: 'accommodation', name: 'Accommodation', icon: Home, color: 'bg-purple-100 text-purple-800' },
  { id: 'food', name: 'Food & Dining', icon: Utensils, color: 'bg-orange-100 text-orange-800' },
  { id: 'activities', name: 'Activities & Tours', icon: Camera, color: 'bg-green-100 text-green-800' },
  { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: 'bg-pink-100 text-pink-800' },
  { id: 'entertainment', name: 'Entertainment', icon: Activity, color: 'bg-indigo-100 text-indigo-800' },
  { id: 'flights', name: 'Flights', icon: Plane, color: 'bg-sky-100 text-sky-800' },
  { id: 'emergency', name: 'Emergency', icon: AlertTriangle, color: 'bg-red-100 text-red-800' },
  { id: 'other', name: 'Other', icon: Receipt, color: 'bg-gray-100 text-gray-800' },
]

const paymentMethods = [
  { id: 'cash', name: 'Cash', icon: Banknote },
  { id: 'credit_card', name: 'Credit Card', icon: CreditCard },
  { id: 'debit_card', name: 'Debit Card', icon: CreditCard },
  { id: 'digital_wallet', name: 'Digital Wallet', icon: CreditCard },
  { id: 'bank_transfer', name: 'Bank Transfer', icon: CreditCard },
  { id: 'other', name: 'Other', icon: Receipt },
]

export default function TripExpenses() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const tripId = params.id as string
  const { trip, isLoadingTrip } = useTrip(tripId)

  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(true)
  const [isAddingExpense, setIsAddingExpense] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null)

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all")
  const [selectedDateRange, setSelectedDateRange] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const [newExpense, setNewExpense] = useState({
    title: "",
    description: "",
    amount: "",
    category: "transport",
    date: new Date().toISOString().split('T')[0], // Default to today
    paymentMethod: "credit_card",
    currency: "USD",
    isShared: false,
    tags: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Fetch expenses
  useEffect(() => {
    if (tripId) {
      fetchExpenses()
    }
  }, [tripId])

  // Apply filters
  useEffect(() => {
    let filtered = expenses

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        expense =>
          expense.title.toLowerCase().includes(query) ||
          expense.description.toLowerCase().includes(query) ||
          expense.category.toLowerCase().includes(query)
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(expense => expense.category === selectedCategory)
    }

    if (selectedPaymentMethod !== "all") {
      filtered = filtered.filter(expense => expense.paymentMethod === selectedPaymentMethod)
    }

    if (selectedDateRange !== "all") {
      const now = new Date()
      const startDate = new Date()
      
      switch (selectedDateRange) {
        case "today":
          startDate.setHours(0, 0, 0, 0)
          filtered = filtered.filter(expense => 
            new Date(expense.date) >= startDate && new Date(expense.date) < new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
          )
          break
        case "week":
          startDate.setDate(now.getDate() - 7)
          filtered = filtered.filter(expense => new Date(expense.date) >= startDate)
          break
        case "month":
          startDate.setMonth(now.getMonth() - 1)
          filtered = filtered.filter(expense => new Date(expense.date) >= startDate)
          break
      }
    }

    setFilteredExpenses(filtered)
  }, [expenses, searchQuery, selectedCategory, selectedPaymentMethod, selectedDateRange])

  const fetchExpenses = async () => {
    try {
      setIsLoadingExpenses(true)
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        EXPENSES_COLLECTION_ID,
        [
          Query.equal('tripId', tripId),
          Query.orderDesc('date'),
          Query.orderDesc('$createdAt')
        ]
      )
      
      const expensesData = response.documents as unknown as Expense[]
      setExpenses(expensesData)
    } catch (error) {
      console.error("Error fetching expenses:", error)
      toast.error("Failed to load expenses")
    } finally {
      setIsLoadingExpenses(false)
    }
  }

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Based on schema, only tripId is required, but we'll validate essential fields for UX
    if (!newExpense.title || !newExpense.amount) {
      setError("Please fill in title and amount")
      return
    }

    const amount = parseFloat(newExpense.amount)
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setIsSubmitting(true)
    try {
      const expenseData = {
        tripId,
        title: newExpense.title || "",
        description: newExpense.description || "",
        amount,
        category: newExpense.category || "other",
        date: newExpense.date || new Date().toISOString().split('T')[0],
        paymentMethod: newExpense.paymentMethod || "credit_card",
        currency: newExpense.currency || "USD",
        isShared: newExpense.isShared || false,
        tags: newExpense.tags ? newExpense.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      }

      const response = await databases.createDocument(
        DATABASE_ID,
        EXPENSES_COLLECTION_ID,
        ID.unique(),
        expenseData
      )

      const newExpenseData = response as unknown as Expense
      setExpenses(prev => [newExpenseData, ...prev])
      
      setIsAddingExpense(false)
      setNewExpense({
        title: "",
        description: "",
        amount: "",
        category: "transport",
        date: new Date().toISOString().split('T')[0], // Reset to today
        paymentMethod: "credit_card",
        currency: "USD",
        isShared: false,
        tags: "",
      })
      
      toast.success("Expense added successfully!")
    } catch (error: any) {
      console.error("Error adding expense:", error)
      setError("Failed to add expense. Please try again.")
      toast.error("Failed to add expense")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingExpense) return
    
    setError("")
    setIsSubmitting(true)
    
    try {
      const updateData = {
        title: editingExpense.title,
        description: editingExpense.description,
        amount: editingExpense.amount,
        category: editingExpense.category,
        date: editingExpense.date,
        paymentMethod: editingExpense.paymentMethod,
        currency: editingExpense.currency,
        isShared: editingExpense.isShared,
        tags: editingExpense.tags,
      }

      await databases.updateDocument(
        DATABASE_ID,
        EXPENSES_COLLECTION_ID,
        editingExpense.$id,
        updateData
      )

      setExpenses(prev =>
        prev.map(expense =>
          expense.$id === editingExpense.$id
            ? { ...expense, ...updateData }
            : expense
        )
      )
      
      setEditingExpense(null)
      toast.success("Expense updated successfully!")
    } catch (error: any) {
      console.error("Error updating expense:", error)
      toast.error("Failed to update expense")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        EXPENSES_COLLECTION_ID,
        expenseId
      )

      setExpenses(prev => prev.filter(expense => expense.$id !== expenseId))
      setDeletingExpenseId(null)
      toast.success("Expense deleted successfully!")
    } catch (error: any) {
      console.error("Error deleting expense:", error)
      toast.error("Failed to delete expense")
    }
  }

  const calculateStats = () => {
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const averageExpense = expenses.length > 0 ? totalAmount / expenses.length : 0
    
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {} as { [key: string]: number })

    const topCategory = Object.entries(categoryTotals).reduce(
      (max, [category, amount]) => amount > max.amount ? { category, amount } : max,
      { category: "", amount: 0 }
    )

    const thisMonth = new Date()
    thisMonth.setDate(1)
    const thisMonthExpenses = expenses.filter(expense => new Date(expense.date) >= thisMonth)
    const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    lastMonth.setDate(1)
    const lastMonthEnd = new Date(thisMonth.getTime() - 1)
    const lastMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= lastMonth && expenseDate <= lastMonthEnd
    })
    const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    return {
      totalAmount,
      averageExpense,
      expenseCount: expenses.length,
      topCategory,
      thisMonthTotal,
      lastMonthTotal,
      monthlyChange: lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0,
      categoryTotals
    }
  }

  const getCategoryInfo = (categoryId: string) => {
    return expenseCategories.find(cat => cat.id === categoryId) || expenseCategories[expenseCategories.length - 1]
  }

  const getPaymentMethodInfo = (methodId: string) => {
    return paymentMethods.find(method => method.id === methodId) || paymentMethods[paymentMethods.length - 1]
  }

  const groupExpensesByDate = (expenses: Expense[]) => {
    return expenses.reduce((groups, expense) => {
      const date = expense.date
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(expense)
      return groups
    }, {} as { [date: string]: Expense[] })
  }

  if (isLoadingTrip || isLoadingExpenses) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Skeleton className="w-24 h-10 mr-4" />
            <Skeleton className="w-64 h-8" />
          </div>
          <div className="space-y-6">
            <Skeleton className="w-full h-32" />
            <Skeleton className="w-full h-96" />
          </div>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trip Not Found</h1>
          <p className="text-gray-600 mb-4">The trip you're looking for doesn't exist.</p>
          <Link href="/trips">
            <Button>Back to Trips</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Check if user owns this trip
  if (trip.userId !== user?.account?.$id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to view these expenses.</p>
          <Link href="/trips">
            <Button>Back to Trips</Button>
          </Link>
        </div>
      </div>
    )
  }

  const stats = calculateStats()
  const groupedExpenses = groupExpensesByDate(filteredExpenses)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href={`/trips/${tripId}`}>
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Trip
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
              <p className="text-muted-foreground mt-1">{trip.name}</p>
            </div>
          </div>
          <Dialog open={isAddingExpense} onOpenChange={setIsAddingExpense}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>Record a new expense for your trip</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddExpense} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="expense-title">Title *</Label>
                  <Input
                    id="expense-title"
                    placeholder="e.g., Dinner at Restaurant"
                    value={newExpense.title}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expense-description">Description</Label>
                  <Textarea
                    id="expense-description"
                    placeholder="Additional details about this expense..."
                    value={newExpense.description}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expense-amount">Amount *</Label>
                    <Input
                      id="expense-amount"
                      type="number"
                      placeholder="0.00"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-currency">Currency</Label>
                    <Select
                      value={newExpense.currency}
                      onValueChange={(value) => setNewExpense(prev => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                        <SelectItem value="CAD">CAD ($)</SelectItem>
                        <SelectItem value="AUD">AUD ($)</SelectItem>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expense-category">Category *</Label>
                    <Select
                      value={newExpense.category}
                      onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-payment">Payment Method</Label>
                    <Select
                      value={newExpense.paymentMethod}
                      onValueChange={(value) => setNewExpense(prev => ({ ...prev, paymentMethod: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id}>
                            {method.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expense-date">Date *</Label>
                  <Input
                    id="expense-date"
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expense-tags">Tags (comma-separated)</Label>
                  <Input
                    id="expense-tags"
                    placeholder="e.g., business, meal, transport"
                    value={newExpense.tags}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, tags: e.target.value }))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="expense-shared"
                    checked={newExpense.isShared}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, isShared: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="expense-shared">Shared expense</Label>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Add Expense
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsAddingExpense(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                  <p className="text-3xl font-bold">${stats.totalAmount.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expenses Count</p>
                  <p className="text-3xl font-bold">{stats.expenseCount}</p>
                </div>
                <Receipt className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Expense</p>
                  <p className="text-3xl font-bold">${stats.averageExpense.toFixed(2)}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Top Category</p>
                  <p className="text-lg font-bold">{getCategoryInfo(stats.topCategory.category).name}</p>
                  <p className="text-sm text-muted-foreground">${stats.topCategory.amount.toFixed(2)}</p>
                </div>
                <PieChart className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Comparison */}
        {trip.budget && trip.budget > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Budget vs Spending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Budget</span>
                  <span className="font-bold">${trip.budget.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Spent</span>
                  <span className="font-bold">${stats.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Remaining</span>
                  <span className={`font-bold ${trip.budget - stats.totalAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${(trip.budget - stats.totalAmount).toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      (stats.totalAmount / trip.budget) <= 0.8 
                        ? 'bg-gradient-to-r from-green-500 to-green-600' 
                        : (stats.totalAmount / trip.budget) <= 1 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                        : 'bg-gradient-to-r from-red-500 to-red-600'
                    }`}
                    style={{ width: `${Math.min((stats.totalAmount / trip.budget) * 100, 100)}%` }}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {((stats.totalAmount / trip.budget) * 100).toFixed(1)}% of budget used
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Expenses</Label>
                <Input
                  id="search"
                  placeholder="Search by title, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-filter">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-filter">Payment Method</Label>
                <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-filter">Date Range</Label>
                <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Content */}
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="categories">By Category</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-6">
            {Object.keys(groupedExpenses).length === 0 ? (
              <Card className="p-12 text-center">
                <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Expenses Found</h3>
                <p className="text-gray-600 mb-6">
                  {expenses.length === 0
                    ? "Start tracking your trip expenses by adding your first expense."
                    : "No expenses match your current filters."}
                </p>
                <Button onClick={() => setIsAddingExpense(true)} size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Expense
                </Button>
              </Card>
            ) : (
              Object.entries(groupedExpenses)
                .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                .map(([date, dayExpenses]) => (
                  <Card key={date}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center">
                          <Calendar className="w-5 h-5 mr-2" />
                          {new Date(date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </CardTitle>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            ${dayExpenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {dayExpenses.length} expense{dayExpenses.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {dayExpenses.map((expense) => {
                          const categoryInfo = getCategoryInfo(expense.category)
                          const paymentInfo = getPaymentMethodInfo(expense.paymentMethod)
                          const IconComponent = categoryInfo.icon
                          const PaymentIcon = paymentInfo.icon
                          
                          return (
                            <div
                              key={expense.$id}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center flex-1">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white mr-4">
                                  <IconComponent className="w-5 h-5 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium">{expense.title}</h4>
                                    <Badge className={categoryInfo.color}>
                                      {categoryInfo.name}
                                    </Badge>
                                    {expense.isShared && (
                                      <Badge variant="outline" className="text-xs">
                                        Shared
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-muted-foreground space-y-1">
                                    {expense.description && (
                                      <p>{expense.description}</p>
                                    )}
                                    <div className="flex items-center gap-4">
                                      <span className="flex items-center">
                                        <PaymentIcon className="w-3 h-3 mr-1" />
                                        {paymentInfo.name}
                                      </span>
                                      <span>{expense.currency}</span>
                                      {expense.tags && expense.tags.length > 0 && (
                                        <div className="flex gap-1">
                                          {expense.tags.map((tag, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                              {tag}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 ml-4">
                                <div className="text-right">
                                  <div className="text-lg font-bold">
                                    ${expense.amount.toFixed(2)}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {expense.currency}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingExpense(expense)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDeletingExpenseId(expense.$id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expenseCategories.map((category) => {
                const categoryExpenses = expenses.filter(exp => exp.category === category.id)
                const categoryTotal = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0)
                const IconComponent = category.icon
                
                if (categoryExpenses.length === 0) return null
                
                return (
                  <Card key={category.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <IconComponent className="w-5 h-5 mr-2" />
                        {category.name}
                      </CardTitle>
                      <CardDescription>
                        {categoryExpenses.length} expense{categoryExpenses.length !== 1 ? 's' : ''} • ${categoryTotal.toFixed(2)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {categoryExpenses.slice(0, 3).map((expense) => (
                          <div key={expense.$id} className="flex justify-between items-center">
                            <span className="text-sm truncate">{expense.title}</span>
                            <span className="text-sm font-medium">${expense.amount.toFixed(2)}</span>
                          </div>
                        ))}
                        {categoryExpenses.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{categoryExpenses.length - 3} more
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>This Month</span>
                      <span className="font-bold">${stats.thisMonthTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Last Month</span>
                      <span className="font-bold">${stats.lastMonthTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Change</span>
                      <span className={`font-bold flex items-center ${stats.monthlyChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {stats.monthlyChange >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        {Math.abs(stats.monthlyChange).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.categoryTotals)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([categoryId, amount]) => {
                        const categoryInfo = getCategoryInfo(categoryId)
                        const percentage = (amount / stats.totalAmount) * 100
                        
                        return (
                          <div key={categoryId} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">{categoryInfo.name}</span>
                              <span className="text-sm">${amount.toFixed(2)} ({percentage.toFixed(1)}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-orange-500 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Expense Dialog */}
      <Dialog open={editingExpense !== null} onOpenChange={() => setEditingExpense(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>Update the details for this expense</DialogDescription>
          </DialogHeader>
          {editingExpense && (
            <form onSubmit={handleUpdateExpense} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="edit-expense-title">Title *</Label>
                <Input
                  id="edit-expense-title"
                  value={editingExpense.title}
                  onChange={(e) => setEditingExpense({...editingExpense, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-expense-description">Description</Label>
                <Textarea
                  id="edit-expense-description"
                  value={editingExpense.description}
                  onChange={(e) => setEditingExpense({...editingExpense, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-expense-amount">Amount *</Label>
                  <Input
                    id="edit-expense-amount"
                    type="number"
                    value={editingExpense.amount}
                    onChange={(e) => setEditingExpense({...editingExpense, amount: parseFloat(e.target.value) || 0})}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-expense-currency">Currency</Label>
                  <Select
                    value={editingExpense.currency}
                    onValueChange={(value) => setEditingExpense({...editingExpense, currency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                      <SelectItem value="CAD">CAD ($)</SelectItem>
                      <SelectItem value="AUD">AUD ($)</SelectItem>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-expense-category">Category *</Label>
                  <Select
                    value={editingExpense.category}
                    onValueChange={(value) => setEditingExpense({...editingExpense, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-expense-payment">Payment Method</Label>
                  <Select
                    value={editingExpense.paymentMethod}
                    onValueChange={(value) => setEditingExpense({...editingExpense, paymentMethod: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          {method.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-expense-date">Date *</Label>
                <Input
                  id="edit-expense-date"
                  type="date"
                  value={editingExpense.date}
                  onChange={(e) => setEditingExpense({...editingExpense, date: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-expense-tags">Tags (comma-separated)</Label>
                <Input
                  id="edit-expense-tags"
                  value={editingExpense.tags ? editingExpense.tags.join(', ') : ''}
                  onChange={(e) => setEditingExpense({
                    ...editingExpense, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-expense-shared"
                  checked={editingExpense.isShared}
                  onChange={(e) => setEditingExpense({...editingExpense, isShared: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="edit-expense-shared">Shared expense</Label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Expense
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditingExpense(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Expense Confirmation */}
      <AlertDialog open={deletingExpenseId !== null} onOpenChange={() => setDeletingExpenseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingExpenseId && handleDeleteExpense(deletingExpenseId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Expense
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
