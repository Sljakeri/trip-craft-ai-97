import React, { useState } from 'react';
import { Plus, Plane, Hotel, Car, Utensils, Ticket, X, CreditCard, Receipt, Calendar, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, Fuel } from 'lucide-react';
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
  dayNumber?: number;
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

interface BudgetAnalysis {
  user_total_budget: number;
  estimated_logistics_cost: number;
  is_feasible: boolean;
  warning_message: string;
}

interface LogisticsSummary {
  transport_mode: string;
  total_transport_cost_estimate: number;
  currency: string;
}

interface FlightDetails {
  one_way_avg_price: number;
  round_trip_avg_price: number;
  suggested_airlines: string[];
}

interface SuggestedHotel {
  name: string;
  cost_per_night: number;
  rating: string;
  coordinates: { lat: number; lon: number };
}

interface AccommodationDay {
  day_number: number;
  date: string;
  suggested_hotels: SuggestedHotel[];
  daily_gas_estimate: number | null;
}

interface ExpensePanelProps {
  currency?: string;
  dailyItinerary?: DayItinerary[];
  currentDayIndex?: number | 'all';
  budgetAnalysis?: BudgetAnalysis;
  logisticsSummary?: LogisticsSummary;
  flightDetails?: FlightDetails | null;
  accommodationPlan?: AccommodationDay[];
  diningManifest?: DiningSpot[];
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

const ExpensePanel: React.FC<ExpensePanelProps> = ({ 
  currency = 'USD', 
  dailyItinerary = [],
  currentDayIndex = 0,
  budgetAnalysis,
  logisticsSummary,
  flightDetails,
  accommodationPlan = [],
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
  const currentAccommodation = accommodationPlan[selectedDayIndex];

  // Filter expenses based on view mode
  const filteredExpenses = viewMode === 'all' 
    ? expenses 
    : expenses.filter(e => e.dayNumber === undefined || e.dayNumber === (selectedDayIndex + 1));

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const dayTotalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Calculate estimated costs from webhook data
  const estimatedTransportCost = logisticsSummary?.total_transport_cost_estimate || 0;
  const estimatedHotelCost = accommodationPlan.reduce((sum, day) => {
    const cheapestHotel = day.suggested_hotels?.[0]?.cost_per_night || 0;
    return sum + cheapestHotel;
  }, 0);
  const estimatedGasCost = accommodationPlan.reduce((sum, day) => sum + (day.daily_gas_estimate || 0), 0);
  const totalEstimatedCost = budgetAnalysis?.estimated_logistics_cost || (estimatedTransportCost + estimatedHotelCost + estimatedGasCost);

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
    const currencyCode = logisticsSummary?.currency || currency;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode === 'EUR' ? 'EUR' : currencyCode === 'GBP' ? 'GBP' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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
    <div className="absolute top-4 right-4 w-[340px] max-h-[85vh] bg-background rounded-xl shadow-2xl flex flex-col z-50 border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border shrink-0">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">Trip Budget</h2>
            <p className="text-xs text-muted-foreground">Estimated costs & expenses</p>
          </div>
          <button 
            onClick={() => setIsVisible(false)} 
            className="text-muted-foreground hover:text-destructive p-1 rounded-full hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Budget Feasibility Alert */}
        {budgetAnalysis && (
          <div className={`p-3 rounded-lg mb-3 ${
            budgetAnalysis.is_feasible 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-amber-50 border border-amber-200'
          }`}>
            <div className="flex items-start gap-2">
              {budgetAnalysis.is_feasible ? (
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`text-xs font-medium ${budgetAnalysis.is_feasible ? 'text-green-800' : 'text-amber-800'}`}>
                  {budgetAnalysis.is_feasible ? 'Budget looks good!' : 'Budget Warning'}
                </p>
                {budgetAnalysis.warning_message && budgetAnalysis.warning_message !== 'None' && (
                  <p className="text-xs text-amber-700 mt-0.5">{budgetAnalysis.warning_message}</p>
                )}
              </div>
            </div>
          </div>
        )}

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
              Overview
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

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Overview Mode - Show all estimates */}
        {viewMode === 'all' && (
          <div className="p-4 space-y-4">
            {/* Transport Costs */}
            {logisticsSummary && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase text-muted-foreground">Transport</span>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">{logisticsSummary.transport_mode}</span>
                    <span className="text-sm font-semibold text-foreground">
                      {formatCurrency(logisticsSummary.total_transport_cost_estimate)}
                    </span>
                  </div>
                  {flightDetails && (
                    <div className="text-xs text-muted-foreground space-y-1 pt-1 border-t border-border">
                      <div className="flex justify-between">
                        <span>Round trip avg:</span>
                        <span>{formatCurrency(flightDetails.round_trip_avg_price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Airlines:</span>
                        <span>{flightDetails.suggested_airlines?.slice(0, 2).join(', ')}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Accommodation Costs */}
            {accommodationPlan.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Hotel className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase text-muted-foreground">Accommodation</span>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  {accommodationPlan.map((day, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Night {day.day_number}</span>
                      <span className="text-foreground">
                        {day.suggested_hotels?.[0] ? (
                          <span title={day.suggested_hotels[0].name}>
                            {formatCurrency(day.suggested_hotels[0].cost_per_night)}
                          </span>
                        ) : '—'}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="text-sm font-medium text-foreground">Total</span>
                    <span className="text-sm font-semibold text-foreground">{formatCurrency(estimatedHotelCost)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Gas Costs (if driving) */}
            {estimatedGasCost > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase text-muted-foreground">Fuel Estimate</span>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-foreground">Total gas</span>
                    <span className="font-semibold text-foreground">{formatCurrency(estimatedGasCost)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Budget Summary */}
            {budgetAnalysis && (
              <div className="bg-primary/5 rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Your Budget</span>
                  <span className="font-medium text-foreground">{formatCurrency(budgetAnalysis.user_total_budget)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Estimated Costs</span>
                  <span className="font-medium text-foreground">{formatCurrency(totalEstimatedCost)}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-border">
                  <span className="font-medium text-foreground">Remaining</span>
                  <span className={`font-bold ${(budgetAnalysis.user_total_budget - totalEstimatedCost) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(budgetAnalysis.user_total_budget - totalEstimatedCost)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Day View - Show day-specific info */}
        {viewMode === 'day' && (
          <div className="p-4 space-y-4">
            {/* Hotel for this day */}
            {currentAccommodation?.suggested_hotels?.[0] && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Hotel className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase text-muted-foreground">Tonight's Stay</span>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-foreground">{currentAccommodation.suggested_hotels[0].name}</p>
                      <p className="text-xs text-muted-foreground">{currentAccommodation.suggested_hotels[0].rating}</p>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {formatCurrency(currentAccommodation.suggested_hotels[0].cost_per_night)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Gas for this day */}
            {currentAccommodation?.daily_gas_estimate && currentAccommodation.daily_gas_estimate > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase text-muted-foreground">Fuel</span>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-foreground">Today's gas estimate</span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(currentAccommodation.daily_gas_estimate)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Day Activities */}
            {currentDay && currentDay.activities.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase text-muted-foreground">Activities</span>
                </div>
                <div className="space-y-1.5">
                  {currentDay.activities.map((activity, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                      <span className="text-sm text-foreground truncate flex-1">{activity.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        activity.is_free 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {activity.is_free ? 'Free' : activity.cost_tier}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Expenses */}
            {filteredExpenses.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase text-muted-foreground">Your Expenses</span>
                </div>
                <div className="space-y-1.5">
                  {filteredExpenses.map(expense => {
                    const Icon = categoryIcons[expense.category];
                    return (
                      <div key={expense.id} className="flex items-center gap-3 bg-muted/50 rounded-lg px-3 py-2 group">
                        <Icon className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-sm text-foreground truncate flex-1">{expense.name}</span>
                        <span className="text-sm font-medium text-foreground">{formatCurrency(expense.amount)}</span>
                        <button
                          onClick={() => handleRemoveExpense(expense.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-opacity"
                        >
                          <X className="w-3 h-3 text-destructive" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
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
                  placeholder="Description"
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

        {/* Total with custom expenses */}
        {expenses.length > 0 && (
          <>
            <div className="flex items-center justify-between py-2 border-t border-dashed border-border">
              <span className="text-sm font-medium text-muted-foreground">Your Bookings</span>
              <span className="text-lg font-bold text-foreground">{formatCurrency(totalAmount)}</span>
            </div>

            <Button
              className="w-full h-11 text-base font-semibold"
              disabled={totalAmount === 0}
              onClick={handlePay}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Pay {formatCurrency(totalAmount)}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpensePanel;
