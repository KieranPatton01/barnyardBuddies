import React, { useState, useEffect } from 'react';
import { TrackedAnimal, ActiveTab } from './types';
import { 
  subscribeToTrackedAnimals, 
  addTrackedAnimal, 
  updateTrackedAnimal, 
  deleteTrackedAnimal,
} from './services/firebase';
import { Header } from './components/Header';
import { SegmentedTabs } from './components/SegmentedTabs';
import { HungryFriendsList } from './components/HungryFriendsList';
import { BarnyardSanctuary } from './components/BarnyardSanctuary';
import { ChristenModal } from './components/ChristenModal';
import { AddAnimalModal } from './components/AddAnimalModal';

export const TOTAL_ANIMAL_CAP = 80;

export const App: React.FC = () => {
  const [animals, setAnimals] = useState<TrackedAnimal[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('hungry');
  const [isFeedModalOpen, setIsFeedModalOpen] = useState(false);
  const [selectedAnimalToFeed, setSelectedAnimalToFeed] = useState<TrackedAnimal | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Subscribe to real-time animals list (Firestore or LocalStorage fallback)
  useEffect(() => {
    const unsubscribe = subscribeToTrackedAnimals((list) => {
      setAnimals(list);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const hungryAnimals = animals.filter((a) => a.status === 'pending');
  const fedAnimals = animals.filter((a) => a.status === 'fed');

  // Trigger Feed & Christen Flow from Wishlist
  const handleStartFeeding = (animal: TrackedAnimal) => {
    setSelectedAnimalToFeed(animal);
    setIsFeedModalOpen(true);
  };

  // Complete Christening with interaction, date/time & location
  const handleChristenSubmit = async (
    id: string,
    givenName: string,
    fullTitle: string,
    interactionType: string,
    dateTime: string,
    location: string,
    lat?: number | null,
    lng?: number | null
  ) => {
    setIsFeedModalOpen(false);
    setSelectedAnimalToFeed(null);

    await updateTrackedAnimal(id, {
      status: 'fed',
      givenName,
      fullTitle,
      snackGiven: interactionType,
      fedAt: dateTime ? new Date(dateTime).toISOString() : new Date().toISOString(),
      location,
      latitude: lat || null,
      longitude: lng || null,
    });

    // Smoothly flip over to Full Tummies tab to admire newly christened buddy
    setTimeout(() => {
      setActiveTab('barnyard');
    }, 300);
  };

  // Add new animal to wishlist (with cap limit)
  const handleAddAnimal = async (newAnimal: TrackedAnimal) => {
    if (animals.length >= TOTAL_ANIMAL_CAP) {
      alert(`Limit reached! Our tracker has a cap of ${TOTAL_ANIMAL_CAP} animals. Please delete an animal before adding more.`);
      return;
    }
    await addTrackedAnimal(newAnimal);
    setActiveTab('hungry');
  };

  // Move fed buddy back to wishlist
  const handleUnfeedAnimal = async (id: string) => {
    await updateTrackedAnimal(id, {
      status: 'pending',
    });
  };

  // Delete animal
  const handleDeleteAnimal = async (id: string) => {
    if (window.confirm('Remove this animal from our tracker?')) {
      await deleteTrackedAnimal(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] flex flex-col font-sans antialiased text-[#351000] selection:bg-[#4ADE80] selection:text-[#002109]">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        fedCount={fedAnimals.length}
        pendingCount={hungryAnimals.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-3 pb-10 flex flex-col">
        {/* Segmented View Switcher */}
        <div className="mb-4">
          <SegmentedTabs
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
            pendingCount={hungryAnimals.length}
            fedCount={fedAnimals.length}
          />
        </div>

        {/* Tab Views */}
        {activeTab === 'hungry' ? (
          <HungryFriendsList
            animals={hungryAnimals}
            onFeedAnimal={handleStartFeeding}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onDeleteAnimal={handleDeleteAnimal}
          />
        ) : (
          <BarnyardSanctuary
            animals={fedAnimals}
            onUnfeedAnimal={handleUnfeedAnimal}
            onDeleteAnimal={handleDeleteAnimal}
          />
        )}
      </main>

      {/* Feed & Christen Modal */}
      <ChristenModal
        animal={selectedAnimalToFeed}
        isOpen={isFeedModalOpen}
        onClose={() => {
          setIsFeedModalOpen(false);
          setSelectedAnimalToFeed(null);
        }}
        onChristenSubmit={handleChristenSubmit}
      />

      {/* Add Animal Drawer */}
      <AddAnimalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddAnimal={handleAddAnimal}
        currentCount={animals.length}
        maxCap={TOTAL_ANIMAL_CAP}
      />

      {/* Tiny transparent build number in bottom left corner */}
      <div className="fixed bottom-2 left-3 z-30 pointer-events-none select-none text-[10px] font-mono text-[#351000]/25 tracking-wider">
        v2.0.4
      </div>
    </div>
  );
};

export default App;
