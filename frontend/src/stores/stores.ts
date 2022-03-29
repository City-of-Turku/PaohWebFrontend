import React from 'react';
import RecommendationStore from './recommendations-store';
import SettingsStore from './settings-store';

export const stores = Object.freeze({
  recommendationsStore: new RecommendationStore(),
  settingsStore: new SettingsStore(),
});

export const storesContext = React.createContext(stores);
export const StoresProvider = storesContext.Provider;
