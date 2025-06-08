import { useState } from 'react';
import { format, addDays, parseISO } from 'date-fns';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-datepicker/dist/react-datepicker.css';

interface DateNavigatorProps {
  /**
   * The currently selected date in ISO format (e.g., "2023-04-15T00:00:00.000Z")
   */
  value: string;
  /**
   * Callback function to update the selected date
   */
  onChange: (isoDateString: string) => void;
}

export const DateNavigator = ({ value, onChange }: DateNavigatorProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const currentDate = value ? parseISO(value) : new Date();

  const changeDate = (days: number) => {
    const newDate = addDays(currentDate, days);
    updateDate(newDate);
  };

  const updateDate = (date: Date) => {
    onChange(date.toISOString());
  };

  return (
    <div className="flex items-center justify-center space-x-4 p-4">
      <motion.button
        onClick={() => changeDate(-1)}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Previous day"
      >
        <FiChevronLeft className="w-6 h-6 text-gray-600" />
      </motion.button>
      
      <div className="relative">
        <motion.button
          onClick={() => setShowDatePicker(!showDatePicker)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <div className="flex items-center space-x-2">
            <FiCalendar className="text-blue-500 flex-shrink-0" />
            <motion.span
              key={value}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="font-medium whitespace-nowrap"
            >
              {format(currentDate, 'EEEE, MMMM d, yyyy')}
            </motion.span>
          </div>
        </motion.button>
        
        <AnimatePresence>
          {showDatePicker && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15, ease: 'easeInOut' }}
              className="absolute z-10 mt-2"
            >
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden w-fit">
                <div className="px-3 py-2 border-b flex justify-between items-center bg-gray-50">
                  <span className="text-sm font-medium text-gray-700">Select Date</span>
                  <motion.button
                    onClick={() => {
                      const today = new Date();
                      updateDate(today);
                      setShowDatePicker(false);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    Today
                  </motion.button>
                </div>
                <DatePicker
                  selected={currentDate}
                  onChange={(date: Date | null) => {
                    if (date) {
                      updateDate(date);
                      setShowDatePicker(false);
                    }
                  }}
                  inline
                  className="[&_.react-datepicker__month-container]:border-0 [&_.react-datepicker]:border-0 [&_.react-datepicker]:p-0"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <motion.button
        onClick={() => changeDate(1)}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Next day"
      >
        <FiChevronRight className="w-6 h-6 text-gray-600" />
      </motion.button>
    </div>
  );
};

export default DateNavigator;
