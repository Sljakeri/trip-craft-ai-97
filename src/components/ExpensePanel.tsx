import React, { useState, useMemo } from 'react';
import { Plus, Plane, Hotel, Car, Utensils, Ticket, X, CreditCard, Receipt, Calendar, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, Fuel, ShoppingBag } from 'lucide-react';
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

const ExpensePanel: React.FC<ExpensePanelProps> = ({ 
  currency = 'USD', 
  dailyItinerary = [],
  currentDayIndex = 0,
  budgetAnalysis,
  logisticsSummary,
  flightDetails,
  accommodationPlan = [],
}) => {
  const [customExpenses, setCustomExpenses] = useState<Expense[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(typeof currentDayIndex === 'number' ? currentDayIndex : 0);
  const [newExpense, setNewExpense] = useState({
    category: 'food' as Expense['category'],
    name: '',
    amount: '',
  });

  const days = dailyItinerary || [];
  const currentDay = days[selectedDayIndex];
  const currentAccommodation = accommodationPlan[selectedDayIndex];
  const activeCurrency = logisticsSummary?.currency || currency;

  // Calculate all costs from webhook data
  const costs = useMemo(() => {
    const transportCost = logisticsSummary?.total_transport_cost_estimate || 0;
    const hotelCost = accommodationPlan.reduce((sum, day) => {
      const cheapestHotel = day.suggested_hotels?.[0]?.cost_per_night || 0;
      return sum + cheapestHotel;
    }, 0);
    const gasCost = accommodationPlan.reduce((sum, day) => sum + (day.daily_gas_estimate || 0), 0);
    const customExpenseTotal = customExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const estimated = budgetAnalysis?.estimated_logistics_cost || (transportCost + hotelCost);
    const subtotal = transportCost + hotelCost + gasCost + customExpenseTotal;
    const serviceFee = subtotal * 0.05;
    const grandTotal = subtotal + serviceFee;

    return {
      transport: transportCost,
      hotel: hotelCost,
      gas: gasCost,
      custom: customExpenseTotal,
      estimated,
      subtotal,
      serviceFee,
      grandTotal,
      remaining: (budgetAnalysis?.user_total_budget || 0) - grandTotal,
    };
  }, [logisticsSummary, accommodationPlan, customExpenses, budgetAnalysis]);

  const handleAddExpense = () => {
    if (!newExpense.name || !newExpense.amount) return;
    
    const expense: Expense = {
      id: Date.now().toString(),
      category: newExpense.category,
      name: newExpense.name,
      amount: parseFloat(newExpense.amount),
      dayNumber: selectedDayIndex + 1,
    };
    
    setCustomExpenses(prev => [...prev, expense]);
    setNewExpense({ category: 'food', name: '', amount: '' });
    setIsAdding(false);
  };

  const handleRemoveExpense = (id: string) => {
    setCustomExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const handleCheckout = () => {
    alert(`Checkout initiated for ${formatCurrency(costs.grandTotal)}. This would redirect to a payment provider.`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: activeCurrency === 'EUR' ? 'EUR' : activeCurrency === 'GBP' ? 'GBP' : 'USD',
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
    <div className="absolute top-4 right-4 w-[360px] max-h-[90vh] bg-background rounded-xl shadow-2xl flex flex-col z-50 border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border shrink-0 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Trip Budget
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Estimated costs & booking</p>
          </div>
          <button 
            onClick={() => setIsVisible(false)} 
            className="text-muted-foreground hover:text-destructive p-1 rounded-full hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Budget Feasibility Banner */}
      {budgetAnalysis && (
        <div className={`px-4 py-3 ${
          budgetAnalysis.is_feasible 
            ? 'bg-green-50 border-b border-green-100' 
            : 'bg-amber-50 border-b border-amber-100'
        }`}>
          <div className="flex items-center gap-3">
            {budgetAnalysis.is_feasible ? (
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            )}
            <div className="flex-1">
              <p className={`text-sm font-semibold ${budgetAnalysis.is_feasible ? 'text-green-800' : 'text-amber-800'}`}>
                {budgetAnalysis.is_feasible ? 'Budget is sufficient!' : 'Budget Warning'}
              </p>
              {budgetAnalysis.warning_message && budgetAnalysis.warning_message !== 'None' && (
                <p className="text-xs text-amber-700 mt-0.5">{budgetAnalysis.warning_message}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Your Budget</p>
              <p className={`text-sm font-bold ${budgetAnalysis.is_feasible ? 'text-green-700' : 'text-amber-700'}`}>
                {formatCurrency(budgetAnalysis.user_total_budget)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Transport Section */}
        {logisticsSummary && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {logisticsSummary.transport_mode === 'Plane' ? (
                  <Plane className="w-4 h-4 text-primary" />
                ) : (
                  <Car className="w-4 h-4 text-primary" />
                )}
                <span className="text-sm font-bold text-foreground">Transportation</span>
              </div>
              <span className="text-sm font-bold text-primary">{formatCurrency(costs.transport)}</span>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Mode</span>
                <span className="font-medium text-foreground">{logisticsSummary.transport_mode}</span>
              </div>

              {/* Flight Details */}
              {flightDetails && (
                <>
                  <div className="border-t border-border pt-2 mt-2 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">One-way avg</span>
                      <span className="text-foreground">{formatCurrency(flightDetails.one_way_avg_price)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Round-trip avg</span>
                      <span className="font-medium text-foreground">{formatCurrency(flightDetails.round_trip_avg_price)}</span>
                    </div>
                    {flightDetails.suggested_airlines && flightDetails.suggested_airlines.length > 0 && (
                      <div className="flex justify-between items-start text-xs pt-1">
                        <span className="text-muted-foreground">Suggested airlines</span>
                        <span className="text-foreground text-right max-w-[150px]">
                          {flightDetails.suggested_airlines.slice(0, 3).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Accommodation Section */}
        {accommodationPlan.length > 0 && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Hotel className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-foreground">Accommodation</span>
              </div>
              <span className="text-sm font-bold text-primary">{formatCurrency(costs.hotel)}</span>
            </div>

            {/* Day Navigator */}
            <div className="flex items-center justify-between bg-muted px-3 py-2 rounded-lg mb-3">
              <button 
                onClick={() => setSelectedDayIndex(prev => Math.max(0, prev - 1))}
                disabled={selectedDayIndex === 0}
                className="p-1 rounded hover:bg-background disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-center">
                <span className="text-xs font-bold text-foreground">Night {selectedDayIndex + 1}</span>
                {currentAccommodation && (
                  <span className="text-[10px] text-muted-foreground block">{formatDate(currentAccommodation.date)}</span>
                )}
              </div>
              <button 
                onClick={() => setSelectedDayIndex(prev => Math.min(accommodationPlan.length - 1, prev + 1))}
                disabled={selectedDayIndex === accommodationPlan.length - 1}
                className="p-1 rounded hover:bg-background disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Hotels for selected day */}
            {currentAccommodation?.suggested_hotels && currentAccommodation.suggested_hotels.length > 0 && (
              <div className="space-y-2">
                {currentAccommodation.suggested_hotels.map((hotel, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border ${idx === 0 ? 'bg-primary/5 border-primary/20' : 'bg-muted/50 border-transparent'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{hotel.name}</p>
                        <p className="text-xs text-muted-foreground">{hotel.rating}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-foreground">{formatCurrency(hotel.cost_per_night)}</span>
                        <span className="text-[10px] text-muted-foreground block">/night</span>
                      </div>
                    </div>
                    {idx === 0 && (
                      <span className="inline-block mt-2 text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">
                        Recommended
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Gas estimate for this day */}
            {currentAccommodation?.daily_gas_estimate && currentAccommodation.daily_gas_estimate > 0 && (
              <div className="mt-3 p-2 bg-amber-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-amber-600" />
                  <span className="text-xs text-amber-800">Day's fuel estimate</span>
                </div>
                <span className="text-xs font-bold text-amber-700">
                  {formatCurrency(currentAccommodation.daily_gas_estimate)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Total Gas (if driving) */}
        {costs.gas > 0 && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Fuel className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-bold text-foreground">Total Fuel Cost</span>
              </div>
              <span className="text-sm font-bold text-amber-600">{formatCurrency(costs.gas)}</span>
            </div>
          </div>
        )}

        {/* Custom Expenses Section */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-foreground">Your Expenses</span>
            </div>
            {customExpenses.length > 0 && (
              <span className="text-sm font-medium text-muted-foreground">{formatCurrency(costs.custom)}</span>
            )}
          </div>

          {customExpenses.length === 0 && !isAdding ? (
            <div className="text-center py-4 text-muted-foreground border-2 border-dashed border-border rounded-lg">
              <Ticket className="w-6 h-6 mx-auto mb-2 opacity-30" />
              <p className="text-xs">Add your own expenses</p>
            </div>
          ) : (
            <div className="space-y-2 mb-3">
              {customExpenses.map(expense => {
                const Icon = categoryIcons[expense.category];
                return (
                  <div key={expense.id} className="flex items-center gap-3 bg-muted/50 rounded-lg px-3 py-2 group">
                    <Icon className="w-4 h-4 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-foreground truncate block">{expense.name}</span>
                      <span className="text-[10px] text-muted-foreground">Day {expense.dayNumber}</span>
                    </div>
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
          )}

          {/* Add Expense Form */}
          {isAdding ? (
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
                  <SelectItem value="food">🍽️ Food & Dining</SelectItem>
                  <SelectItem value="activity">🎫 Activity</SelectItem>
                  <SelectItem value="transport">🚗 Transport</SelectItem>
                  <SelectItem value="hotel">🏨 Hotel</SelectItem>
                  <SelectItem value="flight">✈️ Flight</SelectItem>
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
          ) : (
            <Button
              variant="outline"
              className="w-full h-9 text-sm mt-2"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          )}
        </div>
      </div>

      {/* Footer - Totals & Checkout */}
      <div className="p-4 border-t border-border shrink-0 bg-muted/30">
        {/* Cost Breakdown */}
        <div className="space-y-2 mb-4">
          {costs.transport > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Transport</span>
              <span className="text-foreground">{formatCurrency(costs.transport)}</span>
            </div>
          )}
          {costs.hotel > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Accommodation</span>
              <span className="text-foreground">{formatCurrency(costs.hotel)}</span>
            </div>
          )}
          {costs.gas > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fuel</span>
              <span className="text-foreground">{formatCurrency(costs.gas)}</span>
            </div>
          )}
          {costs.custom > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Your Expenses</span>
              <span className="text-foreground">{formatCurrency(costs.custom)}</span>
            </div>
          )}
        </div>

        {/* Subtotal */}
        <div className="flex items-center justify-between pt-3 border-t border-dashed border-border">
          <span className="text-sm text-muted-foreground">Subtotal</span>
          <span className="text-sm font-medium text-foreground">{formatCurrency(costs.subtotal)}</span>
        </div>

        {/* Service Fee */}
        <div className="flex items-center justify-between py-1">
          <span className="text-sm text-muted-foreground">Service fee (5%)</span>
          <span className="text-sm font-medium text-foreground">{formatCurrency(costs.serviceFee)}</span>
        </div>

        {/* Grand Total */}
        <div className="flex items-center justify-between py-3 border-t border-dashed border-border mb-3">
          <span className="text-sm font-bold text-foreground">Grand Total</span>
          <span className="text-2xl font-bold text-primary">{formatCurrency(costs.grandTotal)}</span>
        </div>

        {/* Remaining Budget */}
        {budgetAnalysis && (
          <div className="flex items-center justify-between text-sm mb-4">
            <span className="text-muted-foreground">Remaining Budget</span>
            <span className={`font-bold ${costs.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {costs.remaining >= 0 ? '+' : ''}{formatCurrency(costs.remaining)}
            </span>
          </div>
        )}

        {/* Checkout Button */}
        <Button
          className="w-full h-12 text-base font-bold"
          disabled={costs.grandTotal === 0}
          onClick={handleCheckout}
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Book Now • {formatCurrency(costs.grandTotal)}
        </Button>
      </div>
    </div>
  );
};

export default ExpensePanel;
