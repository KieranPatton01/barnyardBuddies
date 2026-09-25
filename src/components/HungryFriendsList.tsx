import React from 'react';
import { TrackedAnimal } from '../types';
import { animalCatalog } from '../data/animalCatalog';
import { Plus, Sparkles, Trash2 } from 'lucide-react';

interface HungryFriendsListProps {
  animals: TrackedAnimal[];
  onFeedAnimal: (animal: TrackedAnimal) => void;
  onOpenAddModal: () => void;
  onDeleteAnimal: (id: string) => void;
}

// Ensure clean concise food name is shown, never a sentence or old funFact
const getAnimalSnack = (animal: TrackedAnimal): string => {
  // If animal has a valid short snack (no sentence exclamation marks)
  if (animal.suggestedSnack && !animal.suggestedSnack.includes('!') && animal.suggestedSnack.length <= 25) {
    return animal.suggestedSnack;
  }
  // Lookup in official UK & Zoo catalog
  const match = animalCatalog.find(
    (c) =>
      c.id === animal.speciesId ||
      c.commonName.toLowerCase() === animal.speciesName.toLowerCase()
  );
  if (match) {
    return match.suggestedSnack;
  }
  // If notes was a short custom snack, not a fun fact sentence
  if (animal.notes && !animal.notes.includes('!') && animal.notes.length <= 25) {
    return animal.notes;
  }
  return 'Carrots 🥕';
};

export const HungryFriendsList: React.FC<HungryFriendsListProps> = ({
  animals,
  onFeedAnimal,
  onOpenAddModal,
  onDeleteAnimal,
}) => {
  return (
    <div className="flex flex-col w-full pb-20 gap-4 max-w-md mx-auto">
      {/* Wishlist Explanation Banner */}
      <div className="flex items-center justify-between bg-[#fff1eb] px-4 py-2.5 rounded-2xl shadow-xs border border-[#351000]/5">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-4 h-4 text-[#006b2c] flex-shrink-0" />
          <p className="text-xs font-bold text-[#351000] truncate">
            {animals.length === 0 
              ? 'Wishlist: Animals we desire to feed or pet' 
              : `${animals.length} ${animals.length === 1 ? 'animal' : 'animals'} on our feed & pet wishlist`}
          </p>
        </div>
        <Sparkles className="w-4 h-4 text-[#006b2c] flex-shrink-0" />
      </div>

      {/* Empty State */}
      {animals.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center shadow-card flex flex-col items-center gap-3 my-2 border border-[#351000]/5">
          <div className="w-20 h-20 rounded-full bg-[#f0fdf4] flex items-center justify-center text-4xl shadow-inner">
            🌟
          </div>
          <h3 className="font-black text-lg text-[#351000]">Our Wishlist is Empty</h3>
          <p className="text-xs text-[#3e4a3d] max-w-xs leading-relaxed">
            This is our space to add all the wild and farm animals we desire to feed or pet in real life!
          </p>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="mt-2 py-3 px-6 bg-[#00873a] text-white rounded-full font-bold text-sm shadow-[0_4px_14px_rgba(0,135,58,0.3)] flex items-center gap-2 active:scale-95 transition-all hover:bg-[#006b2c]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Animal to Wishlist</span>
          </button>
        </div>
      ) : (
        /* 2-Column Responsive Card Grid */
        <div className="grid grid-cols-2 gap-3" id="cards-container">
          {animals.map((animal) => (
            <div
              key={animal.id}
              className="flex flex-col bg-white rounded-3xl p-3 shadow-[0_6px_18px_-4px_rgba(53,16,0,0.06)] relative overflow-hidden transition-all border border-[#351000]/5 group"
            >
              {/* Large Emoji Media Disc Container */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-2.5 shadow-sm bg-gradient-to-tr from-[#ffeae1] to-[#fff1eb] flex items-center justify-center border border-[#78350f]/10 p-1">
                <span className="text-7xl sm:text-8xl drop-shadow-md select-none transform transition-transform duration-300 group-hover:scale-110 leading-none">
                  {animal.emoji}
                </span>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteAnimal(animal.id);
                  }}
                  title="Remove from wishlist"
                  className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-rose-600 shadow-xs flex items-center justify-center active:scale-90 transition-all border border-[#351000]/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

              </div>

              {/* Information */}
              <div className="flex flex-col min-w-0 flex-1">
                <h3 className="font-extrabold text-base text-[#351000] truncate">
                  {animal.givenName || animal.speciesName}
                </h3>

                {/* ss : snack name Pill */}
                <div className="w-full mt-2 mb-3">
                  <div className="w-full bg-[#ffe2d6] text-[#351000] px-2 py-1 rounded-full text-center border border-[#78350f]/5 shadow-2xs">
                    <span className="text-[11px] font-bold block truncate">
                      SS : {getAnimalSnack(animal)}
                    </span>
                  </div>
                </div>

                {/* Action CTA Button */}
                <button
                  type="button"
                  onClick={() => onFeedAnimal(animal)}
                  className="mt-auto w-full py-2.5 px-2 bg-[#00873a] text-white rounded-full font-bold text-xs shadow-[0_4px_12px_rgba(0,135,58,0.25)] flex items-center justify-center gap-1.5 active:scale-95 transition-all hover:bg-[#006b2c]"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-200" />
                  <span>Feed or Pet!</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Action Button (FAB) positioned neatly at the bottom right */}
      <div className="fixed bottom-6 right-5 sm:right-[calc(50%-180px)] z-30 flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenAddModal}
          aria-label="Add animal to wishlist"
          title="Add animal to wishlist"
          className="w-14 h-14 rounded-full bg-[#00873a] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(0,135,58,0.35)] active:scale-90 transition-all focus:outline-none hover:bg-[#006b2c]"
        >
          <Plus className="w-7 h-7 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
