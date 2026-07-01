import { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import { useAppStore } from '../../store';
import { getDishes } from '../../data';
import { Dish } from '../../types';
import { useToast } from '../ui/Toast';
import { getCinematicConfigForDish } from '../../features/cinematic/lib/cinematicConfig';
import CinematicDishExperience from '../../features/cinematic/components/CinematicDishExperience';

export default function CinematicView() {
  const { 
    selectedDishSlug, 
    setView, 
    addToCart, 
    openCustomizer
  } = useAppStore();
  const { showToast } = useToast();

  const [dish, setDish] = useState<Dish | null>(null);

  useEffect(() => {
    if (selectedDishSlug) {
      const foundDish = getDishes().find(d => d.slug === selectedDishSlug);
      if (foundDish) {
        setDish(foundDish);
      }
    }
  }, [selectedDishSlug]);

  if (!dish) {
    return (
      <div className="max-w-md mx-auto text-center py-20 animate-fade-in">
        <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-950 dark:text-white mt-4">Dish not found</h3>
        <button
          onClick={() => setView('menu')}
          className="mt-4 px-4 py-2 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  const cinematicData = getCinematicConfigForDish(dish.slug);

  const handleAddToCart = () => {
    if ((dish.variants && dish.variants.length > 0) || (dish.addons && dish.addons.length > 0)) {
      openCustomizer(dish);
    } else {
      addToCart(dish, undefined, [], 1);
      showToast(`Added ${dish.name} to cart`, 'success');
    }
  };

  if (cinematicData) {
    return (
      <CinematicDishExperience
        dish={dish}
        config={{...cinematicData.config, forceCinematicPage: true}}
        frameSet={cinematicData.frameSet}
        onBack={() => {
          setView('dish');
        }}
        handleAddToCart={handleAddToCart}
        grandTotal={dish.price}
      />
    );
  }

  // If we shouldn't be here, back to dish
  setView('dish');
  return null;
}
