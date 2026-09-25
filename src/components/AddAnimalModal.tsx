import React, { useState } from 'react';
import { animalCatalog } from '../data/animalCatalog';
import { AnimalCatalogItem, AnimalCategory, TrackedAnimal } from '../types';
import { Search, X, Plus } from 'lucide-react';

interface AddAnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAnimal: (animal: TrackedAnimal) => void;
  currentCount?: number;
  maxCap?: number;
}

export const AddAnimalModal: React.FC<AddAnimalModalProps> = ({
  isOpen,
  onClose,
  onAddAnimal,
  currentCount = 0,
  maxCap = 80,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customName, setCustomName] = useState('');
  const [customEmoji, setCustomEmoji] = useState('🐾');
  const [customSnack, setCustomSnack] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  const isCapReached = currentCount >= maxCap;

  if (!isOpen) return null;

  const filteredCatalog = animalCatalog.filter((item) => {
    return (
      item.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.suggestedSnack.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSelectCatalogItem = (item: AnimalCatalogItem) => {
    if (isCapReached) {
      alert(`Limit reached! Our tracker has a cap of ${maxCap} animals. Please delete an animal first.`);
      return;
    }

    const newAnimal: TrackedAnimal = {
      id: `tracked-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      speciesId: item.id,
      speciesName: item.commonName,
      category: item.category,
      emoji: item.emoji,
      status: 'pending',
      givenName: null,
      fullTitle: null,
      snackGiven: null,
      suggestedSnack: item.suggestedSnack,
      fedAt: null,
      fedBy: null,
      location: '',
      photoUrl: null,
      rating: 3,
      isFavorite: false,
      notes: null,
    };

    onAddAnimal(newAnimal);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCapReached) {
      alert(`Limit reached! Our tracker has a cap of ${maxCap} animals. Please delete an animal first.`);
      return;
    }
    if (!customName.trim()) return;

    const newAnimal: TrackedAnimal = {
      id: `tracked-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      speciesId: `custom-${Date.now()}`,
      speciesName: customName.trim(),
      category: 'Farm' as AnimalCategory,
      emoji: customEmoji.trim() || '🐾',
      status: 'pending',
      givenName: customName.trim(),
      fullTitle: null,
      snackGiven: null,
      suggestedSnack: customSnack.trim() || 'Safe treats',
      fedAt: null,
      fedBy: null,
      location: '',
      photoUrl: null,
      rating: 3,
      isFavorite: false,
      notes: customSnack ? customSnack.trim() : null,
    };

    onAddAnimal(newAnimal);
    setCustomName('');
    setCustomSnack('');
    setShowCustomForm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Drawer */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-slideUp">
        {/* Grabber Handle */}
        <div className="flex justify-center items-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-[#ffdbcc]"></div>
        </div>

        {/* Header */}
        <div className="px-5 pt-2 pb-3 flex items-center justify-between border-b border-[#351000]/5">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <div>
              <h2 className="text-base font-extrabold text-[#351000] leading-tight">
                Add Animal to Wishlist
              </h2>
              <p className="text-[11px] text-[#3e4a3d]">
                Choose an animal we desire to feed or pet ({currentCount}/{maxCap})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#3e4a3d] hover:bg-[#fff1eb] active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Capacity Warning Banner */}
        {isCapReached && (
          <div className="mx-4 mt-2 p-2 rounded-2xl bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-bold text-center">
            ⚠️ Cap reached ({maxCap} animals max). Delete an animal to add more.
          </div>
        )}

        {/* Search Bar */}
        <div className="p-4 pb-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#6e7b6c] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search panda, penguin, sheep, cow, swan..."
              className="w-full bg-[#fff1eb] pl-9 pr-4 py-2.5 rounded-full text-xs font-medium text-[#351000] placeholder:text-[#6e7b6c] outline-none border border-[#351000]/10 focus:border-[#006b2c] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-xs text-[#6e7b6c] hover:text-[#351000]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Animal Catalog Grid (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
          {/* Custom Animal Item - Positioned at the very top with same card styling and ? avatar */}
          <div className="flex flex-col gap-2">
            <div
              onClick={() => setShowCustomForm(!showCustomForm)}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-[#fff8f6] hover:bg-[#ffeae1] border-2 border-dashed border-[#00873a]/30 hover:border-[#00873a] cursor-pointer shadow-xs active:scale-98 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* ? Emoji Avatar Container */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#ffeae1] to-[#fff1eb] shadow-xs flex items-center justify-center flex-shrink-0 border border-[#78350f]/10 text-3xl font-black text-[#00873a] group-hover:scale-110 transition-transform select-none">
                  ?
                </div>

                {/* Details */}
                <div className="flex flex-col min-w-0">
                  <span className="font-extrabold text-sm text-[#351000] truncate">
                    Add Custom Animal
                  </span>
                  <span className="text-[11px] text-[#006b2c] font-bold truncate">
                    SS : Choose our own
                  </span>
                </div>
              </div>

              {/* Add / Toggle Button */}
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-[#00873a] text-white flex items-center justify-center shadow-xs flex-shrink-0 group-hover:bg-[#006b2c] group-active:scale-90 transition-all ml-2"
                title="Add custom animal"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Custom Input Form when expanded */}
            {showCustomForm && (
              <form onSubmit={handleCustomSubmit} className="p-3 bg-[#fff1eb] rounded-2xl flex flex-col gap-2 border border-[#00873a]/20 animate-fadeIn">
                <span className="text-xs font-bold text-[#351000]">Add Our Custom Animal</span>
                <div className="grid grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={customEmoji}
                    onChange={(e) => setCustomEmoji(e.target.value)}
                    placeholder="🐾"
                    className="col-span-1 bg-white p-2 rounded-xl text-center text-xl shadow-xs outline-none border border-[#351000]/10"
                    maxLength={4}
                  />
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Animal name (e.g. Fawn, Seal)"
                    className="col-span-3 bg-white p-2 rounded-xl text-xs font-bold text-[#351000] shadow-xs outline-none border border-[#351000]/10 focus:border-[#00873a]"
                    required
                    autoFocus
                  />
                </div>
                <input
                  type="text"
                  value={customSnack}
                  onChange={(e) => setCustomSnack(e.target.value)}
                  placeholder="SS (e.g. Fish, Berries)"
                  className="bg-white p-2 rounded-xl text-xs text-[#351000] shadow-xs outline-none border border-[#351000]/10 focus:border-[#00873a]"
                />
                <div className="flex gap-2 mt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#00873a] text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 hover:bg-[#006b2c]"
                  >
                    Add to Our Wishlist
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCustomForm(false)}
                    className="py-2 px-3 bg-white text-[#3e4a3d] rounded-xl text-xs font-bold active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Catalog Animals List */}
          {filteredCatalog.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectCatalogItem(item)}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-[#fff8f6] hover:bg-[#ffeae1] border border-[#351000]/5 cursor-pointer shadow-xs active:scale-98 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Large Emoji Avatar */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#ffeae1] to-[#fff1eb] shadow-xs flex items-center justify-center flex-shrink-0 border border-[#78350f]/10 text-3.5xl group-hover:scale-110 transition-transform select-none">
                  <span className="text-3xl sm:text-4xl">{item.emoji}</span>
                </div>

                {/* Details (No habitat/pond/farm pills, no fake location) */}
                <div className="flex flex-col min-w-0">
                  <span className="font-extrabold text-sm text-[#351000] truncate">
                    {item.commonName}
                  </span>

                  <span className="text-[11px] text-[#006b2c] font-bold truncate mt-0.5">
                    SS : {item.suggestedSnack}
                  </span>
                </div>
              </div>

              {/* Add Button */}
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-[#00873a] text-white flex items-center justify-center shadow-xs flex-shrink-0 group-hover:bg-[#006b2c] group-active:scale-90 transition-all ml-2"
                title="Add to wishlist"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
