export type Locale = "en" | "rw";

export const translations = {
  en: {
    // Nav
    appName: "HingaPlus",
    navHome: "Home",
    navWeather: "Weather",
    navPlanner: "Planner",
    navAlerts: "Alerts",
    weather: "Weather",
    alerts: "Alerts",
    crops: "Crops",
    planner: "Planner",

    // Greeting
    greetMorning: "Good morning",
    greetAfternoon: "Good afternoon",
    greetEvening: "Good evening",
    greetName: "Selena",
    farmOverview: "Here's your farm overview for today.",

    // Offline
    offlineNotice: "Showing cached data — you appear to be offline.",
    retry: "Retry",

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
    windSpeed: "Wind Speed",
    feelsLike: "Feels Like",
    loading: "Loading weather data...",
    loadingWeather: "Loading weather…",
    fetchingWeather: "Fetching live weather…",
    tryAgain: "Try again",
    currentWeather: "Current Weather",
    forecastTitle: "3-Day Forecast",
    error: "Failed to load data. Please try again.",

    // Conditions
    condSunny: "Sunny",
    condRainy: "Rainy",
    condCloudy: "Cloudy",
    condPartlyCloudy: "Partly Cloudy",

    // Alerts
    rainAlert: "🌧️ Rain expected — delay harvesting.",
    heatAlert: "☀️ High heat — water crops early morning.",
    coldAlert: "🌡️ Cold snap — protect seedlings tonight.",
    noAlerts: "No active weather alerts.",
    clearAll: "Clear All",
    allCleared: "All alerts cleared",
    viewDetails: "View Details",
    showLess: "Show Less",
    dismiss: "Dismiss",
    badgeWarning: "Warning",
    badgeDanger: "Danger",
    badgeInfo: "Info",

    // Crops / Planner
    plant: "Plant",
    harvest: "Harvest",
    soilPrep: "Soil Preparation",
    goodDay: "Good day for farming activities.",
    avoidField: "Avoid field work today.",
    cropPlanner: "Crop Planner",
    thisWeek: "This Week",
    good: "Good",
    risky: "Risky",
    plantOn: "Plant on",
    plannerTip: "Tip: Risky crops may face adverse weather. Consider delaying or providing additional irrigation.",

    // Quick Actions
    quickActions: "Quick Actions",
    checkWeather: "Check Weather",
    checkWeatherDesc: "Current & forecast",
    planFarming: "Plan Farming",
    planFarmingDesc: "Crop schedule",
    viewAlerts: "View Alerts",

    // UI
    lastUpdated: "Last updated",
    refresh: "Refresh",
    language: "Language",
    footerText: "Hinga+ · Smart Farming Assistant",
    switchLang: "🇷🇼 Kinyarwanda",
  },

  rw: {
    // Nav
    appName: "HingaPlus",
    navHome: "Ahabanza",
    navWeather: "Ikirere",
    navPlanner: "Gahunda",
    navAlerts: "Imenyesha",
    weather: "Ikirere",
    alerts: "Imenyesha",
    crops: "Imyaka",
    planner: "Gahunda",

    // Greeting
    greetMorning: "Mwaramutse",
    greetAfternoon: "Mwiriwe",
    greetEvening: "Mwiriwe",
    greetName: "Selena",
    farmOverview: "Reba uko umurima wawe uhagaze uyu munsi.",

    // Offline
    offlineNotice: "Wareba amakuru abitswe — birasa nk'aho utari ku murongo.",
    retry: "Ongera ugerageze",

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
    windSpeed: "Imbaraga z'Umuyaga",
    feelsLike: "Bisa Naho",
    loading: "Gutegereza amakuru y'ikirere...",
    loadingWeather: "Gutegereza amakuru y'ikirere…",
    fetchingWeather: "Shakisha amakuru y'ikirere…",
    tryAgain: "Ongera ugerageze",
    currentWeather: "Ikirere Ubu",
    forecastTitle: "Iteganyabihe ry'Iminsi 3",
    error: "Amakuru ntiyabonetse. Ongera ugerageze.",

    // Conditions
    condSunny: "Izuba",
    condRainy: "Imvura",
    condCloudy: "Igicu",
    condPartlyCloudy: "Igicu Gike",

    // Alerts
    rainAlert: "🌧️ Imvura irateganyijwe — Subika isarura.",
    heatAlert: "☀️ Ubushyuhe bukabije — uhira imyaka mu gitondo.",
    coldAlert: "🌡️ Ubukonje — kurinda imbuto nijoro.",
    noAlerts: "Nta makuru y'ikirere agezweho.",
    clearAll: "Siba Byose",
    allCleared: "Amamenyesha yose yasibwe",
    viewDetails: "Reba Birambuye",
    showLess: "Gabanya",
    dismiss: "Siba",
    badgeWarning: "Iburira",
    badgeDanger: "Inzira y'Akaga",
    badgeInfo: "Amakuru",

    // Crops / Planner
    plant: "Guhinga",
    harvest: "Gusarura",
    soilPrep: "Gutunganya Ubutaka",
    goodDay: "Umunsi mwiza wo guhinga.",
    avoidField: "Irinde guhinga uyu munsi.",
    cropPlanner: "Gahunda y'Imyaka",
    thisWeek: "Iki Cyumweru",
    good: "Byiza",
    risky: "Biragora",
    plantOn: "Hinga ku",
    plannerTip: "Inama: Imyaka imwe n'imwe irashobora kwangizwa n'ikirere kibi. Tekereza gusubika cyangwa kuhira bihagije.",

    // Quick Actions
    quickActions: "Ibikorwa by'Ingenzi",
    checkWeather: "Reba Ikirere",
    checkWeatherDesc: "Ubu & ejo",
    planFarming: "Teganya Guhinga",
    planFarmingDesc: "Gahunda y'imyaka",
    viewAlerts: "Reba Imenyesha",

    // UI
    lastUpdated: "Ivugururwa rya nyuma",
    refresh: "Vugurura",
    language: "Ururimi",
    footerText: "Hinga+ · Umufasha wawe mu buhinzi",
    switchLang: "🇬🇧 English",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
