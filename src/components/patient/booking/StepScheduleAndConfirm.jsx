import React, { useMemo } from 'react';
import { CalendarCheck, Check, Loader2 } from 'lucide-react';
import dayjs from 'dayjs';

// All possible OPD time slots
const ALL_TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM",
  "03:00 PM", "04:00 PM", "05:00 PM",
];

// Parse a slot string like "09:00 AM" into a comparable Date for today
function slotToDate(slot, dateStr) {
  const [time, meridiem] = slot.split(' ');
  let [hours, minutes]   = time.split(':').map(Number);
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  const d = new Date(`${dateStr}T00:00:00`);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

export function StepSchedule({ formData, setFormData, setStep }) {
  // Min date = today in YYYY-MM-DD
  const todayStr = dayjs().format('YYYY-MM-DD');

  // Filter slots: if selected date is today, only show slots > now
  const availableSlots = useMemo(() => {
    if (!formData.bookingDate) return ALL_TIME_SLOTS;
    const isToday = formData.bookingDate === todayStr;
    if (!isToday) return ALL_TIME_SLOTS;

    const now = new Date();
    // Add 30-min buffer so they can't book something starting in 5 minutes
    const cutoff = new Date(now.getTime() + 30 * 60 * 1000);
    return ALL_TIME_SLOTS.filter(
      slot => slotToDate(slot, formData.bookingDate) > cutoff
    );
  }, [formData.bookingDate, todayStr]);

  // If the previously selected slot is no longer available, clear it
  const handleDateChange = (e) => {
    const newDate    = e.target.value;
    const isToday    = newDate === todayStr;
    const now        = new Date();
    const cutoff     = new Date(now.getTime() + 30 * 60 * 1000);
    const slotStillValid =
      formData.timeSlot &&
      (!isToday || slotToDate(formData.timeSlot, newDate) > cutoff);

    setFormData({
      ...formData,
      bookingDate: newDate,
      timeSlot:    slotStillValid ? formData.timeSlot : null,
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-3xl font-black mb-2 dark:text-white">Schedule Slot</h2>
      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-8">
        Select Date and Time
      </p>

      {/* Date picker — min set to today */}
      <div className="mb-8">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
          Date
        </label>
        <input
          type="date"
          min={todayStr}
          className="w-full max-w-sm px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 outline-none focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white"
          value={formData.bookingDate}
          onChange={handleDateChange}
        />
      </div>

      {/* Time slots — only shown once date is picked */}
      {formData.bookingDate && (
        <div className="animate-in fade-in duration-300">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
            Available Time Slots
          </label>

          {availableSlots.length === 0 ? (
            // All slots have passed for today — prompt to pick another date
            <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
              <p className="text-slate-500 font-bold text-sm mb-2">
                No more slots available for today.
              </p>
              <p className="text-slate-400 text-xs">
                Please select a future date.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {ALL_TIME_SLOTS.map(time => {
                const isAvailable = availableSlots.includes(time);
                const isSelected  = formData.timeSlot === time;
                return (
                  <button
                    key={time}
                    disabled={!isAvailable}
                    onClick={() => isAvailable && setFormData({ ...formData, timeSlot: time })}
                    className={`py-4 rounded-xl text-sm font-bold transition-all border
                      ${isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30'
                        : isAvailable
                          ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400'
                          : 'bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-700/50 text-slate-300 dark:text-slate-600 cursor-not-allowed line-through'
                      }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <button
        disabled={!formData.bookingDate || !formData.timeSlot}
        onClick={() => setStep(5)}
        className="w-full mt-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-2xl font-black uppercase tracking-widest disabled:opacity-30 transition-all"
      >
        Continue to Confirmation
      </button>
    </div>
  );
}

export function StepConfirm({ formData, submitBooking, submitting }) {
  return (
    <div className="animate-in zoom-in-95 duration-500 text-center max-w-md mx-auto py-8">
      <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <CalendarCheck size={40} />
      </div>
      <h2 className="text-3xl font-black mb-8 dark:text-white">Review & Confirm</h2>

      <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-6 text-left space-y-4 mb-10 border border-slate-100 dark:border-slate-700">
        <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hospital</span>
          <span className="font-bold dark:text-white">{formData.hospital_name}</span>
        </div>
        <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</span>
          <span className="font-bold dark:text-white">{formData.department}</span>
        </div>
        <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor</span>
          <span className="font-bold dark:text-white">
            {formData.doctor_name ? `Dr. ${formData.doctor_name}` : 'Auto-assigned'}
          </span>
        </div>
        <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</span>
          <span className={`font-black text-xs uppercase tracking-widest ${
            formData.isEmergency ? 'text-red-500' : 'text-slate-600 dark:text-slate-300'
          }`}>
            {formData.isEmergency ? '🚨 Emergency' : 'Standard OPD'}
          </span>
        </div>
        <div className="flex justify-between pt-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule</span>
          <span className="font-black text-blue-600">
            {dayjs(formData.bookingDate).format('MMM D, YYYY')} at {formData.timeSlot}
          </span>
        </div>
      </div>

      <button
        onClick={submitBooking}
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center justify-center"
      >
        {submitting
          ? <Loader2 className="animate-spin" size={24} />
          : <><Check className="mr-2" strokeWidth={3} /> Confirm Booking</>
        }
      </button>
    </div>
  );
}