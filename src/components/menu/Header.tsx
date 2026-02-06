import { Clock, MapPin } from "lucide-react";
import { RESTAURANT_CONFIG, DELIVERY_CONFIG } from "@/config/menuConfig";

export function Header() {
  const { name, tagline, schedule } = RESTAURANT_CONFIG;

  return (
    <header className="relative py-8 md:py-12 border-b border-border">
      <div className="container">
        <div className="text-center">
          {/* Restaurant Name */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gold-gradient mb-2">
            {name}
          </h1>
          
          {/* Tagline */}
          <p className="text-muted-foreground text-lg md:text-xl font-light tracking-wide">
            {tagline}
          </p>

          {/* Status & Info */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-6">
            {/* Open/Closed Status */}
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  schedule.isOpen 
                    ? "bg-green-500 animate-pulse" 
                    : "bg-red-500"
                }`}
              />
              <span className={schedule.isOpen ? "text-green-400" : "text-red-400"}>
                {schedule.isOpen ? "Aberto" : "Fechado"}
              </span>
            </div>

            {/* Hours */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {schedule.workingDays} • {schedule.openTime} - {schedule.closeTime}
              </span>
            </div>

            {/* Delivery Time */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{DELIVERY_CONFIG.estimatedTime}</span>
            </div>
          </div>

          {/* Closed Message */}
          {!schedule.isOpen && (
            <div className="mt-6 p-4 rounded-lg bg-red-950/50 border border-red-900/50 max-w-xl mx-auto">
              <p className="text-red-300 text-sm">{schedule.closedMessage}</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}