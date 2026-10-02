import React from 'react';
import { CampusEvent } from '../types';

interface EventDetailModalProps {
  event: CampusEvent | null;
  onClose: () => void;
  onToggleRsvp: (id: string) => void;
  onToggleSave: (id: string) => void;
  onAddToCalendar: (event: CampusEvent) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onToggleRsvp,
  onToggleSave,
  onAddToCalendar,
}) => {
  if (!event) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[430px] bg-white dark:bg-[#131B2E] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Event Media Banner */}
        <div className="relative w-full h-52 bg-slate-900 shrink-0 overflow-hidden">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[64px]">
                {event.iconName || 'celebration'}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close & Bookmark Buttons */}
          <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 flex items-center justify-center transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <button
              onClick={() => onToggleSave(event.id)}
              className={`w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-colors ${
                event.isSaved ? 'text-[#EF4444]' : 'text-white hover:text-[#EF4444]'
              }`}
              type="button"
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={event.isSaved ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                favorite
              </span>
            </button>
          </div>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider mb-1.5">
              {event.categoryLabel}
            </span>
            <h2 className="text-lg font-bold leading-tight">{event.title}</h2>
          </div>
        </div>

        {/* Scrollable details */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-800 dark:text-slate-200">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-xs">
              <span className="material-symbols-outlined text-[18px] text-[#10B981]">event</span>
              <span className="font-semibold">{event.fullDateTime}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <span className="material-symbols-outlined text-[18px] text-[#10B981]">location_on</span>
              <span className="font-semibold">{event.location}</span>
            </div>
            {event.organizer && (
              <div className="flex items-center gap-2.5 text-xs">
                <span className="material-symbols-outlined text-[18px] text-[#10B981]">groups</span>
                <span>Organized by: <strong className="text-slate-900 dark:text-white">{event.organizer}</strong></span>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Attendees</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {event.attendeesCount + (event.rsvpStatus ? 1 : 0)} students going
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <span className="w-7 h-7 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-800">JD</span>
                <span className="w-7 h-7 rounded-full bg-tertiary-container text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-800">SK</span>
                <span className="w-7 h-7 rounded-full bg-[#10B981] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-800">AL</span>
              </div>
              <p className="text-[11px] text-slate-500">Joined by peers from CS, Engineering, and Design</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1.5">
              About This Event
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {event.description}
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => onToggleRsvp(event.id)}
              className={`w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-98 ${
                event.rsvpStatus
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-[#10B981] hover:bg-[#059669] text-white shadow-md shadow-[#10B981]/25'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {event.rsvpStatus ? 'check_circle' : 'how_to_reg'}
              </span>
              <span>{event.rsvpStatus ? "You're Registered & Going!" : 'RSVP Now (Free)'}</span>
            </button>

            <button
              onClick={() => {
                onAddToCalendar(event);
                alert(`Added "${event.title}" to your campus timetable.`);
                onClose();
              }}
              className="w-full h-11 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              <span>Add to Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
