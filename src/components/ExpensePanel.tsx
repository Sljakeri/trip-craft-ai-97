import React, { useState } from 'react';
import { Plus, Plane, Hotel, Car, Utensils, Ticket, X, CreditCard, Receipt, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
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
  dayNumber?: number; // Optional: which day it belongs to
}

interface DiningSpot {
  name: string;
  type: string;
  coordinates: { lat: number; lon: number };
}

interface Activity {
  name: string;
  type: string;
  description: string;
  cost_tier: string;
  is_free: boolean;
  coordinates: { lat: number; lon: number };
  estimated_crowd_scores: {
    "08:00": number;
    "12:00": number;
    "16:00": number;
    "20:00": number;
  };
  nearby_context?: {
    dining_spots: DiningSpot[];
  };
}

interface DayItinerary {
  day_number: number;
  date: string;
  activities: Activity[];
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
  dailyItinerary?: DayItinerary[];
  currentDayIndex?: number | 'all';
}

const ExpensePanel: React.FC<ExpensePanelProps> = ({ 
  currency = 'USD', 
  dailyItinerary = [],
  currentDayIndex = 0 
}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [viewMode, setViewMode] = useState<'all' | 'day'>(currentDayIndex === 'all' ? 'all' : 'day');
  const [selectedDayIndex, setSelectedDayIndex] = useState(typeof currentDayIndex === 'number' ? currentDayIndex : 0);
  const [newExpense, setNewExpense] = useState({
    category: 'flight' as Expense['category'],
    name: '',
    amount: '',
  });

  const days = dailyItinerary || [];
  const currentDay = days[selectedDayIndex];

  // Filter expenses based on view mode
  const filteredExpenses = viewMode === 'all' 
    ? expenses 
    : expenses.filter(e => e.dayNumber === undefined || e.dayNumber === (selectedDayIndex + 1));

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const dayTotalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleAddExpense = () => {
    if (!newExpense.name || !newExpense.amount) return;
    
    const expense: Expense = {
      id: Date.now().toString(),
      category: newExpense.category,
      name: newExpense.name,
      amount: parseFloat(newExpense.amount),
      dayNumber: viewMode === 'day' ? selectedDayIndex + 1 : undefined,
    };
    
    setExpenses(prev => [...prev, expense]);
    setNewExpense({ category: 'flight', name: '', amount: '' });
    setIsAdding(false);
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const handlePay = () => {
    alert(`Payment of ${currency} ${totalAmount.toFixed(2)} initiated!`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'EUR' ? 'EUR' : currency === 'GBP' ? 'GBP' : 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Minimized trigger button
  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="absolute top-4 right-4 z-50 bg-background text-foreground p-3 rounded-full shadow-lg hover:bg-muted transition-all border border-border"
      >
        <Receipt className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="absolute top-4 right-4 w-[320px] max-h-[85vh] bg-background rounded-xl shadow-2xl flex flex-col z-50 border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border shrink-0">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">Trip Expenses</h2>
            <p className="text-xs text-muted-foreground">Pre-trip payments & bookings</p>
          </div>
          <button 
            onClick={() => setIsVisible(false)} 
            className="text-muted-foreground hover:text-destructive p-1 rounded-full hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Toggle */}
        {days.length > 0 && (
          <div className="flex bg-muted p-1 rounded-lg mb-3">
            <button
              onClick={() => setViewMode('day')}
              className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all ${
                viewMode === 'day' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              By Day
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all ${
                viewMode === 'all' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Expenses
            </button>
          </div>
        )}

        {/* Day Navigator (when in day view) */}
        {viewMode === 'day' && days.length > 0 && (
          <div className="flex items-center justify-between bg-muted px-3 py-2 rounded-lg">
            <button 
              onClick={() => setSelectedDayIndex(prev => Math.max(0, prev - 1))}
              disabled={selectedDayIndex === 0}
              className="p-1 rounded hover:bg-background disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-center">
              <span className="text-xs font-bold text-foreground">Day {selectedDayIndex + 1}</span>
              {currentDay && (
                <span className="text-[10px] text-muted-foreground block">{formatDate(currentDay.date)}</span>
              )}
            </div>
            <button 
              onClick={() => setSelectedDayIndex(prev => Math.min(days.length - 1, prev + 1))}
              disabled={selectedDayIndex === days.length - 1}
              className="p-1 rounded hover:bg-background disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Day Activities Summary (when in day view) */}
      {viewMode === 'day' && currentDay && currentDay.activities.length > 0 && (
        <div className="px-4 py-2 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Today's Activities</span>
          </div>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {currentDay.activities.map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1">
                <span className="text-foreground truncate flex-1">{activity.name}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${
                  activity.is_free 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {activity.is_free ? 'Free' : activity.cost_tier}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expenses List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredExpenses.length === 0 && !isAdding ? (
          <div className="text-center py-6 text-muted-foreground">
            <Ticket className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No expenses {viewMode === 'day' ? 'for this day' : 'added yet'}</p>
            <p className="text-xs">Add your bookings below</p>
          </div>
        ) : (
          filteredExpenses.map(expense => {
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
                  <p className="text-xs text-muted-foreground">
                    {categoryLabels[expense.category]}
                    {expense.dayNumber && <span className="ml-1 opacity-70">• Day {expense.dayNumber}</span>}
                  </p>
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
            Add Expense {viewMode === 'day' && days.length > 0 ? `(Day ${selectedDayIndex + 1})` : ''}
          </Button>
        )}

        {/* Day Total (when in day view) */}
        {viewMode === 'day' && days.length > 0 && (
          <div className="flex items-center justify-between py-1 text-sm">
            <span className="text-muted-foreground">Day {selectedDayIndex + 1} Total</span>
            <span className="font-semibold text-foreground">{formatCurrency(dayTotalAmount)}</span>
          </div>
        )}

        {/* Grand Total */}
        <div className="flex items-center justify-between py-2 border-t border-dashed border-border">
          <span className="text-sm font-medium text-muted-foreground">Grand Total</span>
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
