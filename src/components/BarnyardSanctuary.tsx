import React from 'react';
import { TrackedAnimal } from '../types';
import { CheckCircle2, Trash2, RotateCcw } from 'lucide-react';

interface BarnyardSanctuaryProps {
  animals: TrackedAnimal[];
  onUnfeedAnimal?: (id: string) => void;
  onDeleteAnimal?: (id: string) => void;
}

export const BarnyardSanctuary: React.FC<BarnyardSanctuaryProps> = ({
  animals,
  onUnfeedAnimal,
  onDeleteAnimal,
}) => {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Recently';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="flex flex-col w-full pb-12 gap-4 max-w-md mx-auto">
      {/* Full Tummies Banner - Identical style and size to Wishlist banner */}
      <div className="flex items-center justify-between bg-[#fff1eb] px-4 py-2.5 rounded-2xl shadow-xs border border-[#351000]/5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm select-none flex-shrink-0">🤤</span>
          <p className="text-xs font-bold text-[#351000] truncate">
            {animals.length === 0
              ? 'Full Tummies: Every animal we feed or pet'
              : animals.length === 1
                ? 'one kitty we have fed or pet'
                : `${animals.length} kitties we have fed or pet`}
          </p>
        </div>
        <span className="text-sm select-none flex-shrink-0">🤤</span>
      </div>

      {/* Residents Grid */}
      {animals.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center shadow-card border border-[#351000]/5 my-2">
          <span className="text-5xl">🌾</span>
          <h3 className="font-extrabold text-base text-[#351000] mt-3">The Sanctuary Awaits!</h3>
          <p className="text-xs text-[#3e4a3d] mt-1 max-w-xs mx-auto leading-relaxed">
            Add an animal to our Wishlist, then feed or pet them to christen them and earn their resident plaque here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3" id="residentGrid">
          {animals.map((animal) => (
            <div
              key={animal.id}
              className="relative bg-white rounded-3xl p-3 flex flex-col justify-between shadow-[0_4px_16px_-2px_rgba(53,16,0,0.06)] hover:shadow-md transition-all border border-[#78350f]/15 group"
            >
              {/* Large Emoji Frame */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-tr from-[#ffeae1] to-[#fff1eb] mb-2 shadow-xs flex items-center justify-center border border-[#78350f]/10 p-1">
                <span className="text-7xl sm:text-8xl drop-shadow-md select-none transform transition-transform duration-300 group-hover:scale-110 leading-none">
                  {animal.emoji}
                </span>

                {/* Delete Button - Exactly same place as Wishlist */}
                {onDeleteAnimal && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteAnimal(animal.id);
                    }}
                    title="Remove buddy"
                    className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-rose-600 shadow-xs flex items-center justify-center active:scale-90 transition-all border border-[#351000]/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Feeding Stamp Tag */}
                <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-bold text-[#006b2c] flex items-center gap-1 shadow-xs">
                  <CheckCircle2 className="w-3 h-3 text-[#006b2c] fill-[#006b2c]" />
                  <span>{formatDate(animal.fedAt)}</span>
                </div>
              </div>

              {/* Title & Info */}
              <div className="flex flex-col flex-1 min-w-0">
                <h2 className="font-extrabold text-sm text-[#351000] truncate leading-tight">
                  {animal.fullTitle || `${animal.givenName || 'Buddy'} the ${animal.speciesName}`}
                </h2>
                
                <p className="text-[11px] text-[#3e4a3d] truncate mt-0.5 font-medium">
                  {animal.location ? `📍 ${animal.location}` : 'Sanctuary Resident'}
                </p>

                {/* Wooden Action/Snack Tag */}
                <div className="mt-2 bg-[#ffe2d6] px-2 py-1 rounded-full flex items-center justify-center gap-1 text-[#351000] border border-[#78350f]/10">
                  <span className="text-[11px] font-bold truncate">
                    {animal.snackGiven || 'Fed & Pet 💕'}
                  </span>
                </div>

                {/* Action: Unpet */}
                {onUnfeedAnimal && (
                  <div className="mt-3 pt-1 border-t border-[#351000]/5">
                    <button
                      type="button"
                      onClick={() => onUnfeedAnimal(animal.id)}
                      title="Move back to Wishlist"
                      className="w-full py-1.5 px-2 bg-[#fff1eb] hover:bg-[#ffe2d6] text-[#351000] rounded-full text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all border border-[#351000]/10"
                    >
                      <RotateCcw className="w-3 h-3 text-[#006b2c]" />
                      <span>Unpet 🐾</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
