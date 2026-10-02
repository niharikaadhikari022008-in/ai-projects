import React, { useState } from 'react';
import { CampusEvent } from '../types';

interface EventsScreenProps {
  events: CampusEvent[];
  onToggleRsvp: (id: string) => void;
  onToggleSave: (id: string) => void;
  onSelectEvent: (event: CampusEvent) => void;
  onOpenQuickAdd: () => void;
}

export const EventsScreen: React.FC<EventsScreenProps> = ({
  events,
  onToggleRsvp,
  onToggleSave,
  onSelectEvent,
  onOpenQuickAdd,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Events');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Filter events
  const filteredEvents = events.filter((evt) => {
    const matchesCategory =
      selectedCategory === 'All Events' || evt.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSaved = !showSavedOnly || evt.isSaved;
    return matchesCategory && matchesQuery && matchesSaved;
  });

  const featuredEvent = events.find((e) => e.isFeatured) || events[0];
  const weekEvents = filteredEvents.filter((e) => !e.isFeatured);

  return (
    <main className="flex-1 w-full max-w-[430px] mx-auto pt-12 pb-28 px-4 flex flex-col space-y-6">
      <div className="flex flex-col w-full space-y-5">
        {/* Top App Navigation / Header Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              <span className="text-[11px] text-[#6c7a71] dark:text-slate-400 tracking-wider uppercase font-semibold">
                Discover &amp; Connect
              </span>
            </div>
            <h1 className="text-[22px] font-bold text-[#131b2e] dark:text-white tracking-tight mt-0.5">
              Campus Events
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Filter saved events"
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
                showSavedOnly
                  ? 'bg-[#10B981] text-white'
                  : 'bg-[#f2f3ff] dark:bg-slate-800 text-[#131b2e] dark:text-white hover:bg-[#eaedff]'
              }`}
              type="button"
              title={showSavedOnly ? 'Show all events' : 'Show saved events'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {showSavedOnly ? 'bookmark' : 'save_as'}
              </span>
            </button>
            <button
              aria-label="Filter events"
              onClick={onOpenQuickAdd}
              className="w-10 h-10 rounded-full bg-[#f2f3ff] dark:bg-slate-800 hover:bg-[#eaedff] dark:hover:bg-slate-700 active:scale-95 text-[#131b2e] dark:text-white flex items-center justify-center transition-all shadow-sm"
              type="button"
              title="Publish campus event"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
            </button>
          </div>
        </div>

        {/* Interactive Search Input */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6c7a71]">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-11 bg-white dark:bg-slate-800 rounded-full text-sm text-[#131b2e] dark:text-white placeholder:text-[#6c7a71]/70 focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all"
            placeholder="Search clubs, workshops, parties..."
            type="search"
          />
          <button
            aria-label="Voice search or filter"
            onClick={() => {
              if (!searchQuery) {
                setSearchQuery('AI');
              } else {
                setSearchQuery('');
              }
            }}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6c7a71] hover:text-[#131b2e] dark:hover:text-white transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[19px]">mic</span>
          </button>
        </div>

        {/* Filter Chips (Horizontal Scrollable Stream) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 py-0.5">
          <button
            onClick={() => setSelectedCategory('All Events')}
            className={`shrink-0 h-8 px-4 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform ${
              selectedCategory === 'All Events'
                ? 'bg-[#131b2e] text-white dark:bg-white dark:text-slate-900'
                : 'bg-[#e2e7ff] text-[#131b2e] dark:bg-slate-800 dark:text-slate-300'
            }`}
            type="button"
          >
            <span>All Events</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
          </button>

          <button
            onClick={() => setSelectedCategory('Clubs')}
            className={`shrink-0 h-8 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1 active:scale-95 transition-transform ${
              selectedCategory === 'Clubs'
                ? 'bg-[#4648d4] text-white'
                : 'bg-[#e2e7ff] text-[#4648d4] dark:bg-indigo-950/60 dark:text-indigo-300 hover:bg-[#dae2fd]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[15px]">groups</span>
            <span>Clubs</span>
          </button>

          <button
            onClick={() => setSelectedCategory('Academic')}
            className={`shrink-0 h-8 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1 active:scale-95 transition-transform ${
              selectedCategory === 'Academic'
                ? 'bg-[#006c49] text-white'
                : 'bg-[#e2e7ff] text-[#006c49] dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-[#dae2fd]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[15px]">school</span>
            <span>Academic</span>
          </button>

          <button
            onClick={() => setSelectedCategory('Career')}
            className={`shrink-0 h-8 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1 active:scale-95 transition-transform ${
              selectedCategory === 'Career'
                ? 'bg-[#e29100] text-white'
                : 'bg-[#e2e7ff] text-[#e29100] dark:bg-amber-950/60 dark:text-amber-300 hover:bg-[#dae2fd]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[15px]">work</span>
            <span>Career</span>
          </button>

          <button
            onClick={() => setSelectedCategory('Social & Parties')}
            className={`shrink-0 h-8 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1 active:scale-95 transition-transform ${
              selectedCategory === 'Social & Parties'
                ? 'bg-[#ba1a1a] text-white'
                : 'bg-[#e2e7ff] text-[#ba1a1a] dark:bg-rose-950/60 dark:text-rose-300 hover:bg-[#dae2fd]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[15px]">nightlife</span>
            <span>Social &amp; Parties</span>
          </button>
        </div>

        {/* Featured Event Hero Card */}
        {featuredEvent && (!showSavedOnly || featuredEvent.isSaved) && (
          <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(15,23,42,0.08)] group transition-all">
            {/* Hero Image Layer */}
            <div
              className="w-full h-72 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 cursor-pointer"
              onClick={() => onSelectEvent(featuredEvent)}
              style={{
                backgroundImage: `url('${featuredEvent.imageUrl}')`,
              }}
            ></div>

            {/* Multi-stage Scrim for Rich Visual Depth */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#131b2e] via-[#131b2e]/40 to-black/25 pointer-events-none"
            ></div>

            {/* Floating Top Row (Badge + Bookmark) */}
            <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide">
                <span
                  className="material-symbols-outlined text-[#ffddb8] text-[15px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  local_fire_department
                </span>
                <span>Featured Flagship</span>
              </div>
              <button
                aria-label="Bookmark Hackathon"
                onClick={() => onToggleSave(featuredEvent.id)}
                className={`w-9 h-9 rounded-full bg-black/45 backdrop-blur-md hover:bg-black/60 active:scale-90 flex items-center justify-center transition-all ${
                  featuredEvent.isSaved ? 'text-[#EF4444]' : 'text-white'
                }`}
                type="button"
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={featuredEvent.isSaved ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  favorite
                </span>
              </button>
            </div>

            {/* Floating Bottom Hero Details & Primary RSVP Call-to-Action */}
            <div className="absolute bottom-0 inset-x-0 p-4.5 z-10 flex flex-col space-y-2.5">
              <div
                className="space-y-1 cursor-pointer"
                onClick={() => onSelectEvent(featuredEvent)}
              >
                <h2 className="text-lg font-bold text-white leading-tight tracking-tight">
                  {featuredEvent.title}
                </h2>
                <div className="flex items-center gap-1.5 text-slate-200 text-xs">
                  <span className="material-symbols-outlined text-[16px] text-[#4edea3] shrink-0">
                    event_available
                  </span>
                  <span className="truncate">{featuredEvent.fullDateTime}</span>
                </div>
              </div>

              {/* Action & Social Proof Row */}
              <div className="pt-1 flex items-center justify-between gap-3">
                {/* Hackers Avatar Stack */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2 overflow-hidden">
                    <span className="inline-block w-6 h-6 rounded-full bg-[#4648d4] text-white text-[10px] flex items-center justify-center font-bold shadow-sm ring-1 ring-white/30">
                      JD
                    </span>
                    <span className="inline-block w-6 h-6 rounded-full bg-[#e29100] text-white text-[10px] flex items-center justify-center font-bold shadow-sm ring-1 ring-white/30">
                      SK
                    </span>
                    <span className="inline-block w-6 h-6 rounded-full bg-[#006c49] text-white text-[10px] flex items-center justify-center font-bold shadow-sm ring-1 ring-white/30">
                      AL
                    </span>
                  </div>
                  <span className="text-xs text-white font-medium">
                    {featuredEvent.attendeesCount + (featuredEvent.rsvpStatus ? 1 : 0)}+ Going
                  </span>
                </div>

                {/* RSVP Button */}
                <button
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight shadow-[0_4px_12px_rgba(16,185,129,0.35)] active:scale-95 transition-all flex items-center gap-1.5 ${
                    featuredEvent.rsvpStatus
                      ? 'bg-white text-[#006c49]'
                      : 'bg-[#10B981] hover:bg-[#059669] text-white'
                  }`}
                  onClick={() => onToggleRsvp(featuredEvent.id)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {featuredEvent.rsvpStatus ? 'check_circle' : 'how_to_reg'}
                  </span>
                  <span>{featuredEvent.rsvpStatus ? "You're Going!" : 'RSVP Now'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section Header: Happening This Week */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#131b2e] dark:text-white">
              Happening This Week
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-[#e2e7ff] dark:bg-slate-700 text-[#3c4a42] dark:text-slate-300 text-[11px] font-semibold">
              {weekEvents.length}
            </span>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All Events');
              setShowSavedOnly(false);
            }}
            className="text-xs font-bold text-[#006c49] dark:text-[#4edea3] hover:underline flex items-center gap-0.5 transition-colors"
            type="button"
          >
            <span>See all</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* Event List: Interactive Cards */}
        <div className="flex flex-col space-y-3">
          {weekEvents.map((evt) => (
            <div
              key={evt.id}
              className="w-full bg-white dark:bg-[#131B2E] rounded-2xl p-3 flex gap-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.04)] hover:shadow-md transition-all border border-slate-100 dark:border-slate-800"
            >
              {/* Thumbnail */}
              <div
                onClick={() => onSelectEvent(evt)}
                className="relative shrink-0 w-22 h-22 rounded-xl overflow-hidden bg-[#eaedff] dark:bg-slate-800 cursor-pointer"
              >
                {evt.imageUrl ? (
                  <img
                    alt={evt.title}
                    className="w-full h-full object-cover"
                    src={evt.imageUrl}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-[#e2e7ff] dark:bg-slate-700 flex flex-col items-center justify-center p-2 text-center">
                    <span className="material-symbols-outlined text-[28px] text-[#006c49] dark:text-[#4edea3]">
                      {evt.iconName || 'palette'}
                    </span>
                    <span className="text-[10px] font-bold text-[#131b2e] dark:text-white mt-1">
                      {evt.dateTag}
                    </span>
                  </div>
                )}
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                  {evt.dateTag}
                </span>
              </div>

              {/* Card Body */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#e2e7ff] dark:bg-slate-800 text-[#4648d4] dark:text-indigo-300 text-[11px] font-semibold truncate">
                      {evt.categoryLabel}
                    </span>
                    <button
                      aria-label="Save event"
                      onClick={() => onToggleSave(evt.id)}
                      className={`transition-colors ${
                        evt.isSaved ? 'text-[#ba1a1a]' : 'text-[#6c7a71] hover:text-[#ba1a1a]'
                      }`}
                      type="button"
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        style={evt.isSaved ? { fontVariationSettings: "'FILL' 1" } : {}}
                      >
                        favorite
                      </span>
                    </button>
                  </div>
                  <h4
                    onClick={() => onSelectEvent(evt)}
                    className="text-xs font-bold text-[#131b2e] dark:text-white truncate leading-snug cursor-pointer hover:text-[#10B981]"
                  >
                    {evt.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[#3c4a42] dark:text-slate-400 text-xs">
                    <span className="material-symbols-outlined text-[14px] text-[#6c7a71] shrink-0">
                      schedule
                    </span>
                    <span className="truncate">{evt.fullDateTime}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5">
                    <div className="flex -space-x-1.5">
                      {evt.attendeesAvatars?.map((av, idx) => (
                        <span
                          key={idx}
                          className="inline-block w-5 h-5 rounded-full bg-[#6063ee] text-white text-[9px] flex items-center justify-center font-bold"
                        >
                          {av}
                        </span>
                      ))}
                    </div>
                    <span className="text-[11px] text-[#6c7a71] dark:text-slate-400 font-medium">
                      {evt.attendeesCount + (evt.rsvpStatus ? 1 : 0)} going
                    </span>
                  </div>

                  <button
                    className={`h-8 px-3 rounded-full text-xs font-bold transition-all active:scale-95 flex items-center gap-1 ${
                      evt.rsvpStatus
                        ? 'bg-[#10B981] text-white'
                        : 'bg-[#f2f3ff] dark:bg-slate-800 hover:bg-[#10B981] hover:text-white text-[#006c49] dark:text-[#4edea3]'
                    }`}
                    onClick={() => onToggleRsvp(evt.id)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {evt.rsvpStatus ? 'check' : 'add'}
                    </span>
                    <span>{evt.rsvpStatus ? 'Going' : 'RSVP'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Student Tip / Engagement Micro-Banner */}
        <div className="w-full rounded-2xl bg-[#eaedff] dark:bg-slate-800/80 p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 text-[#006c49] dark:text-[#4edea3] flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">notifications_active</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#131b2e] dark:text-white">
              Club Leader or Event Organizer?
            </p>
            <p className="text-[11px] text-[#6c7a71] dark:text-slate-400 truncate">
              Tap '+' to publish your campus gathering
            </p>
          </div>
          <button
            onClick={onOpenQuickAdd}
            className="px-3 py-1.5 rounded-full bg-[#10B981] text-white text-xs font-bold shadow-xs active:scale-95 transition-transform"
          >
            Publish
          </button>
        </div>
      </div>
    </main>
  );
};
