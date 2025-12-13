import React, { useState } from 'react';
import { Plus, Plane, Hotel, Car, Utensils, Ticket, X, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Expense {
  id: string;
  category: 'flight' | 'hotel' | 'transport' | 'food' | 'activity';
  name: string;
  amount: number;
}

const categoryIcons = {
  flight: Plane,
  hotel: Hotel,
  transport: Car,
  food: Utensils,
  activity: Ticket,
};

const categoryLabels = {
  flight: 'Flight',
  hotel: 'Hotel',
  transport: 'Transport',
  food: 'Food & Dining',
  activity: 'Activity',
};

interface ExpensePanelProps {
  currency?: string;
}

const ExpensePanel: React.FC<ExpensePanelProps> = ({ currency = 'USD' }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: 'flight' as Expense['category'],
    name: '',
    amount: '',
  });

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleAddExpense = () => {
    if (!newExpense.name || !newExpense.amount) return;
    
    const expense: Expense = {
      id: Date.now().toString(),
      category: newExpense.category,
      name: newExpense.name,
      amount: parseFloat(newExpense.amount),
    };
    
    setExpenses(prev => [...prev, expense]);
    setNewExpense({ category: 'flight', name: '', amount: '' });
    setIsAdding(false);
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const handlePay = () => {
    // Placeholder for payment functionality
    alert(`Payment of ${currency} ${totalAmount.toFixed(2)} initiated!`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'EUR' ? 'EUR' : currency === 'GBP' ? 'GBP' : 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="absolute top-4 right-4 w-[300px] max-h-[85vh] bg-background rounded-xl shadow-2xl flex flex-col z-50 border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border shrink-0">
        <h2 className="text-lg font-bold text-foreground">Trip Expenses</h2>
        <p className="text-xs text-muted-foreground">Pre-trip payments & bookings</p>
      </div>

      {/* Expenses List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {expenses.length === 0 && !isAdding ? (
          <div className="text-center py-8 text-muted-foreground">
            <Ticket className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No expenses added yet</p>
            <p className="text-xs">Add your bookings below</p>
          </div>
        ) : (
          expenses.map(expense => {
            const Icon = categoryIcons[expense.category];
            return (
              <div
                key={expense.id}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg group"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{expense.name}</p>
                  <p className="text-xs text-muted-foreground">{categoryLabels[expense.category]}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {formatCurrency(expense.amount)}
                  </span>
                  <button
                    onClick={() => handleRemoveExpense(expense.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-opacity"
                  >
                    <X className="w-3 h-3 text-destructive" />
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Add Expense Form */}
        {isAdding && (
          <div className="p-3 bg-muted/50 rounded-lg space-y-3 border border-border">
            <Select
              value={newExpense.category}
              onValueChange={(value: Expense['category']) => 
                setNewExpense(prev => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flight">✈️ Flight</SelectItem>
                <SelectItem value="hotel">🏨 Hotel</SelectItem>
                <SelectItem value="transport">🚗 Transport</SelectItem>
                <SelectItem value="food">🍽️ Food & Dining</SelectItem>
                <SelectItem value="activity">🎫 Activity</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              placeholder="Description (e.g., Round trip to Paris)"
              value={newExpense.name}
              onChange={e => setNewExpense(prev => ({ ...prev, name: e.target.value }))}
              className="h-9"
            />
            
            <Input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={e => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
              className="h-9"
            />
            
            <div className="flex gap-2">
              <Button size="sm" className="flex-1" onClick={handleAddExpense}>
                Add
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border shrink-0 space-y-3">
        {!isAdding && (
          <Button
            variant="outline"
            className="w-full h-9 text-sm"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        )}

        {/* Total */}
        <div className="flex items-center justify-between py-2 border-t border-dashed border-border">
          <span className="text-sm font-medium text-muted-foreground">Total</span>
          <span className="text-xl font-bold text-foreground">{formatCurrency(totalAmount)}</span>
        </div>

        {/* Pay Button */}
        <Button
          className="w-full h-11 text-base font-semibold"
          disabled={totalAmount === 0}
          onClick={handlePay}
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Pay {formatCurrency(totalAmount)}
        </Button>
      </div>
    </div>
  );
};

export default ExpensePanel;
