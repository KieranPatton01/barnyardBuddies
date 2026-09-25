import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TrackedAnimal } from '../types';
import { Dices, MapPin, Calendar, Navigation, X } from 'lucide-react';

interface ChristenModalProps {
  animal: TrackedAnimal | null;
  isOpen: boolean;
  onClose: () => void;
  onChristenSubmit: (
    id: string,
    givenName: string,
    fullTitle: string,
    interactionType: string,
    dateTime: string,
    location: string,
    lat?: number | null,
    lng?: number | null
  ) => void;
}

// Alliterative Name Dictionary for every letter A-Z
const ALLITERATIVE_NAMES: Record<string, string[]> = {
  A: ['Archie', 'Alfie', 'Apollo', 'Apple', 'Acorn', 'Amos', 'Annie', 'Arthur', 'Amber', 'Angus'],
  B: ['Barnaby', 'Buttons', 'Bramble', 'Bella', 'Biscuit', 'Boris', 'Bruno', 'Betsy', 'Buttercup', 'Buster', 'Benny', 'Bailey'],
  C: ['Callum', 'Charlie', 'Clover', 'Clementine', 'Cooper', 'Chester', 'Coco', 'Clyde', 'Cleo', 'Casper', 'Cosmo', 'Clara'],
  D: ['Daisy', 'Donald', 'Dottie', 'Dexter', 'Daphne', 'Duke', 'Dylan', 'Darcy', 'Danny', 'Dusty', 'Dobby', 'Dora'],
  E: ['Eddie', 'Ellie', 'Elmer', 'Echo', 'Evie', 'Elmo', 'Ernie', 'Emerald'],
  F: ['Fergus', 'Freddie', 'Felix', 'Fiona', 'Flora', 'Finbar', 'Faye', 'Frankie', 'Fudge', 'Flash'],
  G: ['Gideon', 'Gary', 'Greta', 'Gus', 'Gracie', 'Gizmo', 'George', 'Gigi', 'Gordon', 'Ginger'],
  H: ['Hamish', 'Henry', 'Holly', 'Hugo', 'Hazel', 'Hope', 'Harvey', 'Hunter', 'Harry', 'Harper', 'Honey'],
  I: ['Iggy', 'Ivy', 'Izzy', 'Iris', 'Indie', 'Isaac', 'Ivan'],
  J: ['Jasper', 'Jack', 'Juno', 'Jasmine', 'Joy', 'Jolene', 'Joey'],
  K: ['Kiki', 'Kip', 'Kobe', 'Koko', 'Katie', 'Kevin', 'Kaiser'],
  L: ['Louie', 'Luna', 'Leo', 'Lulu', 'Liam', 'Layla', 'Lucky', 'Lottie', 'Leo', 'Lavender'],
  M: ['Mochi', 'Milo', 'Marigold', 'Max', 'Maisy', 'Monty', 'Maple', 'Murphy', 'Mimi', 'Mocha'],
  N: ['Nugget', 'Nala', 'Nico', 'Noah', 'Nelly', 'Ned', 'Nutmeg', 'Neo'],
  O: ['Oscar', 'Otis', 'Ollie', 'Otto', 'Olive', 'Oakley', 'Opal', 'Orson', 'Oreo'],
  P: ['Percy', 'Penny', 'Pippa', 'Pippin', 'Poppy', 'Petunia', 'Pecan', 'Pickle', 'Pip', 'Paddy', 'Peanut'],
  Q: ['Quincy', 'Quinn', 'Queen', 'Queenie', 'Quill'],
  R: ['Rosie', 'Rory', 'Ronnie', 'Ruby', 'Riley', 'Rupert', 'Rusty', 'Robin', 'Rocky', 'Ranger'],
  S: ['Sam', 'Shaun', 'Sally', 'Silas', 'Stanley', 'Stella', 'Sophie', 'Sunny', 'Sandy', 'Sprout', 'Scout', 'Simba'],
  T: ['Toby', 'Tilly', 'Theo', 'Tessa', 'Tucker', 'Teddy', 'Toffee', 'Twig', 'Truffle', 'Trixie'],
  U: ['Una', 'Uri', 'Uma', 'Ulani', 'Uno'],
  V: ['Violet', 'Vinny', 'Velvet', 'Vera', 'Victor'],
  W: ['Waffles', 'Winston', 'Willow', 'Woody', 'Winnie', 'Walnut', 'Wesley', 'Wren'],
  X: ['Xander', 'Xavier', 'Xena'],
  Y: ['Yogi', 'Yuki', 'Yoyo', 'Yarrow'],
  Z: ['Ziggy', 'Zelda', 'Zeus', 'Zoe', 'Zack']
};

function getMatchingLetter(speciesName: string): string {
  const words = speciesName.trim().split(/\s+/);
  // Match the primary noun (e.g. "Cow" in "Highland Cow", "Duck" in "Mallard Duck")
  const primaryWord = words[words.length - 1];
  const char = primaryWord.charAt(0).toUpperCase();
  if (ALLITERATIVE_NAMES[char]) return char;
  return speciesName.charAt(0).toUpperCase();
}

function getRandomAlliterativeName(speciesName: string): string {
  const letter = getMatchingLetter(speciesName);
  const names = ALLITERATIVE_NAMES[letter] || ALLITERATIVE_NAMES['C'];
  return names[Math.floor(Math.random() * names.length)];
}

const fetchGeneralArea = async (lat: number, lng: number): Promise<string> => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (!res.ok) return 'Local Area';
    const data = await res.json();
    const addr = data.address || {};
    return (
      addr.park ||
      addr.nature_reserve ||
      addr.suburb ||
      addr.neighbourhood ||
      addr.village ||
      addr.town ||
      addr.city ||
      addr.municipality ||
      addr.county ||
      (data.display_name ? data.display_name.split(',')[0].trim() : 'Local Area')
    );
  } catch (err) {
    return 'Local Area';
  }
};

export const ChristenModal: React.FC<ChristenModalProps> = ({
  animal,
  isOpen,
  onClose,
  onChristenSubmit,
}) => {
  const [givenName, setGivenName] = useState('');
  const [interactionType, setInteractionType] = useState<'Fed' | 'Pet' | 'Both'>('Fed');
  const [dateTime, setDateTime] = useState('');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState<number | null>(51.5074);
  const [longitude, setLongitude] = useState<number | null>(-0.1278);
  const [isLocating, setIsLocating] = useState(false);
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    if (isOpen && animal) {
      setGivenName(animal.givenName || '');
      
      // Default to current local date & time
      const now = new Date();
      const localISO = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setDateTime(localISO);

      setLocationName(animal.location || 'Local Area');

      // Attempt automatic geolocation and reverse geocode
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            setLatitude(lat);
            setLongitude(lng);

            // Fetch general area name
            const area = await fetchGeneralArea(lat, lng);
            setLocationName(area);
          },
          () => {
            setLatitude(51.5074);
            setLongitude(-0.1278);
          },
          { timeout: 5000 }
        );
      }

      // Celebratory confetti burst!
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4ADE80', '#16A34A', '#FDE047', '#BB0112', '#FEF08A'],
        });
      } catch (err) {
        console.warn('Confetti effect failed', err);
      }
    }
  }, [isOpen, animal]);

  if (!isOpen || !animal) return null;

  // Handle alliterative name rolling (e.g. Callum the Cow)
  const handleRollName = () => {
    setIsRolling(true);
    const random = getRandomAlliterativeName(animal.speciesName);
    setGivenName(random);
    setTimeout(() => setIsRolling(false), 200);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);

        const area = await fetchGeneralArea(lat, lng);
        setLocationName(area);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const fullTitlePreview = givenName.trim()
    ? `${givenName.trim()} the ${animal.speciesName}`
    : `(Name) the ${animal.speciesName}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalGiven = givenName.trim() || getRandomAlliterativeName(animal.speciesName);
    const finalTitle = `${finalGiven} the ${animal.speciesName}`;
    const actionLabel = interactionType === 'Both' ? 'Fed & Pet 💕' : (interactionType === 'Pet' ? 'Pet with love 🐾' : 'Fed safe snacks 🥕');
    
    try {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
      });
    } catch {}

    onChristenSubmit(
      animal.id,
      finalGiven,
      finalTitle,
      actionLabel,
      dateTime,
      locationName.trim() || 'Local Area',
      latitude,
      longitude
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-slideUp">
        {/* Grabber Handle */}
        <div className="flex justify-center items-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-[#ffdbcc]"></div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full text-[#3e4a3d] hover:bg-[#fff1eb] active:scale-95 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-5 pb-6 pt-3 flex flex-col gap-4">
          {/* Hero Animal Portrait */}
          <div className="relative flex flex-col items-center justify-center my-1">
            <div className="absolute w-32 h-32 rounded-full bg-[#ffe24c]/40 blur-lg animate-pulse" />
            
            <div className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-[#6d5e00] to-[#ffe24c] shadow-md flex items-center justify-center">
              <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-tr from-[#ffeae1] to-[#fff1eb] flex items-center justify-center relative">
                <span className="text-7xl select-none">{animal.emoji}</span>
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center">
            <h2 className="text-xl font-extrabold text-[#351000] tracking-tight">
              We met a {animal.speciesName}!
            </h2>
            <p className="text-xs text-[#3e4a3d] mt-0.5 font-medium">
              Let's give them an official christened name:
            </p>
          </div>

          {/* Alliterative Name Input Box with Randomizer Button */}
          <div className="bg-[#fff1eb] p-2.5 rounded-2xl shadow-xs border border-[#351000]/5">
            <div className="flex items-center gap-2">
              <span className="text-lg pl-1">🏷️</span>
              <div className="flex-1 flex items-center min-w-0">
                <input
                  type="text"
                  value={givenName}
                  onChange={(e) => setGivenName(e.target.value)}
                  placeholder={`e.g. ${getRandomAlliterativeName(animal.speciesName)}`}
                  autoFocus
                  className={`w-36 bg-white text-center font-bold text-sm text-[#351000] py-2 px-2.5 rounded-xl shadow-inner outline-none border border-[#351000]/10 focus:border-[#006b2c] truncate transition-transform ${
                    isRolling ? 'scale-105' : ''
                  }`}
                  maxLength={22}
                />
                <span className="text-xs font-bold text-[#351000] ml-2 truncate">
                  the {animal.speciesName}
                </span>
              </div>

              {/* Alliterative Randomize Dice Action */}
              <button
                type="button"
                onClick={handleRollName}
                title={`Roll name starting with '${getMatchingLetter(animal.speciesName)}'`}
                className="flex items-center gap-1 py-1.5 px-3 rounded-full bg-[#ffe24c] hover:bg-[#e2c62d] text-[#211b00] active:scale-95 transition-all shadow-xs flex-shrink-0 font-bold text-xs"
              >
                <span>Roll</span>
                <Dices className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Live Alliterative Christened Title Preview */}
            <div className="mt-2 text-center text-xs font-bold text-[#006b2c] bg-white/70 py-1.5 px-2 rounded-lg">
              Full Title: <span className="underline decoration-wavy decoration-[#4ade80]">{fullTitlePreview}</span>
            </div>
          </div>

          {/* Pet or Fed Option */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-[#351000]">
              What did we do with this buddy?
            </span>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#fff1eb] rounded-2xl border border-[#351000]/5">
              {(['Fed', 'Pet', 'Both'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setInteractionType(type)}
                  className={`py-2 px-2 rounded-xl text-xs font-extrabold transition-all active:scale-95 flex items-center justify-center gap-1 ${
                    interactionType === type
                      ? 'bg-[#00873a] text-white shadow-xs'
                      : 'text-[#351000] hover:bg-white/80'
                  }`}
                >
                  {type === 'Fed' && <span>Fed 🥕</span>}
                  {type === 'Pet' && <span>Pet 🐾</span>}
                  {type === 'Both' && <span>Both! 💕</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Current Date, Time & General Area Location with OpenStreetMap */}
          <div className="p-3 rounded-2xl bg-[#fff1eb] flex flex-col gap-2.5 border border-[#351000]/5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#351000] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#006b2c]" />
                Date &amp; Time
              </span>
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="bg-white text-xs font-bold text-[#351000] px-2.5 py-1 rounded-xl border border-[#351000]/10 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#351000] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#006b2c]" />
                  General Area Spotted
                </span>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isLocating}
                  className="text-[11px] font-bold text-[#006b2c] hover:underline flex items-center gap-1"
                >
                  <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Detecting Area...' : 'Detect Area'}</span>
                </button>
              </div>

              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Richmond Park, Cotswolds, Local Area"
                className="w-full bg-white px-3 py-1.5 rounded-xl text-xs font-medium text-[#351000] border border-[#351000]/10 outline-none focus:border-[#006b2c]"
              />
            </div>

            {/* Embedded OpenStreetMap (100% Free, NO API KEY Required) */}
            {latitude !== null && longitude !== null && (
              <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-[#351000]/10 shadow-xs mt-1">
                <iframe
                  title="Spotted Location Map"
                  loading="lazy"
                  className="absolute top-0 left-0 w-full h-[calc(100%+45px)] border-0 select-none pointer-events-none"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.006}%2C${latitude - 0.003}%2C${longitude + 0.006}%2C${latitude + 0.003}&layer=mapnik&marker=${latitude}%2C${longitude}`}
                />
                {/* CSS Trick: Bottom cover bar to ensure 0% copyright text can ever be seen */}
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-r from-[#ffeae1] via-[#fff1eb] to-[#ffeae1] border-t border-[#351000]/10 flex items-center justify-center pointer-events-none z-10">
                  <span className="text-[10px] font-bold text-[#006b2c] flex items-center gap-1">
                    <span>🐾</span>
                    <span>Spotted Location Map</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Welcome to Full Tummies Submit CTA */}
          <div className="pt-1">
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full py-3.5 rounded-full bg-[#00873a] text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-[0_6px_16px_rgba(0,135,58,0.3)] hover:bg-[#006b2c] active:scale-95 transition-all"
            >
              <span>Welcome to Full Tummies!</span>
              <span className="text-xl">🤤</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
