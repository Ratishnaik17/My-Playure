import { motion } from "framer-motion";

export const SPORTS_CATEGORIES = [
  { name: "All Sports", icon: "🔥" },
  { name: "Cricket", icon: "🏏" },
  { name: "Football", icon: "⚽" },
  { name: "Hockey", icon: "🏑" },
  { name: "Kabaddi", icon: "🤼" },
  { name: "Badminton", icon: "🏸" },
  { name: "Athletics", icon: "🏃" },
  { name: "Basketball", icon: "🏀" },
  { name: "Volleyball", icon: "🏐" },
  { name: "Table Tennis", icon: "🏓" },
  { name: "Chess", icon: "♟️" },
  { name: "Swimming", icon: "🏊" },
  { name: "Cycling", icon: "🚴" },
  { name: "Tennis", icon: "🎾" },
  { name: "Boxing", icon: "🥊" },
  { name: "Wrestling", icon: "🤼‍♂️" },
  { name: "Kho Kho", icon: "🏃‍♂️" },
  { name: "Judo", icon: "🥋" },
  { name: "Archery", icon: "🎯" },
  { name: "Shooting", icon: "🎯" },
  { name: "Golf", icon: "⛳" },
  { name: "Gymnastics", icon: "🤸" },
  { name: "Weightlifting", icon: "🏋️" },
  { name: "Karate", icon: "🥋" },
  { name: "Taekwondo", icon: "🥋" },
];

export default function SportsCategoriesBar({ selectedCategory, onSelectCategory }) {
  return (
    <div className="sticky top-[68px] z-40 bg-[#0B1120]/95 backdrop-blur-md py-3 mb-6 border-b border-gray-800/80 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="max-w-7xl mx-auto overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center gap-2 min-w-max">
          {SPORTS_CATEGORIES.map((sport) => {
            const isSelected = selectedCategory === sport.name;
            return (
              <motion.button
                key={sport.name}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onSelectCategory(sport.name)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 border border-blue-400/30"
                    : "bg-[#1F2937] text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-800"
                }`}
              >
                <span className="text-sm">{sport.icon}</span>
                <span>{sport.name}</span>
                {isSelected && (
                  <motion.div
                    layoutId="activeCategoryDot"
                    className="w-1.5 h-1.5 rounded-full bg-white ml-0.5"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
