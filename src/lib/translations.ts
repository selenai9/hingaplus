export type Locale = "en" | "rw";

export const translations = {
  en: {
    // Nav
    appName: "HingaPlus",
    weather: "Weather",
    alerts: "Alerts",
    crops: "Crops",
    planner: "Planner",

    // Locations
    selectLocation: "Select Location",
    ndora: "Ndora (Gisagara)",
    muhanda: "Muhanda (Ngororero)",
    mvundwa: "Mvundwa (Karongi)",

    // Weather
    temperature: "Temperature",
    rainfall: "Rainfall",
    conditions: "Conditions",
    humidity: "Humidity",
    wind: "Wind Speed",
    feelsLike: "Feels Like",
    loading: "Loading weather data...",
    error: "Failed to load data. Please try again.",

    // Alerts
    rainAlert: "🌧️ Rain expected — delay harvesting.",
    heatAlert: "☀️ High heat — water crops early morning.",
    coldAlert: "🌡️ Cold snap — protect seedlings tonight.",
    noAlerts: "No active weather alerts.",

    // Crops / Planner
    plant: "Plant",
    harvest: "Harvest",
    soilPrep: "Soil Preparation",
    goodDay: "Good day for farming activities.",
    avoidField: "Avoid field work today.",

    // UI
    lastUpdated: "Last updated",
    refresh: "Refresh",
    language: "Language",
  },
  rw: {
    // Nav
    appName: "HingaPlus",
    weather: "Ikirere",
    alerts: "Imenyesha",
    crops: "Imyaka",
    planner: "Gahunda",

    // Locations
    selectLocation: "Hitamo Ahantu",
    ndora: "Ndora (Gisagara)",
    muhanda: "Muhanda (Ngororero)",
    mvundwa: "Mvundwa (Karongi)",

    // Weather
    temperature: "Ubushyuhe",
    rainfall: "Imvura",
    conditions: "Ibihe",
    humidity: "Ubuhehere",
    wind: "Umuyaga",
    feelsLike: "Bisa Naho",
    loading: "Gutegereza amakuru y'ikirere...",
    error: "Amakuru ntiyabonetse. Ongera ugerageze.",

    // Alerts
    rainAlert: "🌧️ Imvura irateganyijwe — Subika isarura.",
    heatAlert: "☀️ Ubushyuhe bukabije —uhira imyaka mu gitondo.",
    coldAlert: "🌡️ Ubukonje — kurinda imbuto nijoro.",
    noAlerts: "Nta makuru y'ikirere agezweho.",

    // Crops / Planner
    plant: "Guhinga",
    harvest: "Gusarura",
    soilPrep: "Gutunganya Ubutaka",
    goodDay: "Umunsi mwiza wo guhinga.",
    avoidField: "Irinde guhinga uyu munsi.",

    // UI
    lastUpdated: "Ivugururwa rya nyuma",
    refresh: "Vugurura",
    language: "Ururimi",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
