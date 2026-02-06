import { CATEGORIES } from "@/config/menuConfig";

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="py-6 border-b border-border">
      <div className="container">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`
                px-5 py-2.5 rounded-full text-sm font-medium
                transition-all duration-300
                ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground gold-glow"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }
              `}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}