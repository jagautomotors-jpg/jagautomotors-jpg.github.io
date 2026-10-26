/* ==========================================================================
   JAG AUTO MOTORS — DEALER INFO + INVENTORY
   This is the only file you need to edit day to day.
   ========================================================================== */

/* Your business details. Replace the placeholder values. */
window.DEALER = {
  name: "Jag Auto Motors Corp.",
  phone: "778-899-9603",
  email: "jagautomotors@gmail.com",
  address: "Unit 202 – 2570 King George Boulevard, Surrey, BC",
  hours: [
    ["Mon – Fri", "10:00 – 7:00"],
    ["Saturday", "10:00 – 6:00"],
    ["Sunday", "10:00 – 5:00"]
  ],
  dealerNo: "D50745" // VSA dealer number
};

/* --------------------------------------------------------------------------
   INVENTORY — one { ... } block per vehicle. Copy a block to add a car.

   body:    "sedan", "suv", "truck", "hatch", "coupe" or "van"
   status:  "available", "pending" or "sold"  (sold cars are hidden)
   photos:  put images in the /images folder and list them, e.g.
            photos: ["images/j1042-front.jpg", "images/j1042-side.jpg"]
            Leave it as [] to show a drawing until you have photos.
   colorHex: paint colour for the drawing (only used when there are no photos)

   The cars below are SAMPLES so you can see the site working.
   -------------------------------------------------------------------------- */
window.SAMPLE_INVENTORY = true; // change to false once these are your real cars

window.INVENTORY = [
  { stock: "J-1001", year: 2021, make: "Toyota", model: "RAV4", trim: "XLE AWD",
    price: 34995, km: 48200, body: "suv", color: "Silver Sky", colorHex: "#A9B0B4",
    transmission: "Automatic", drivetrain: "AWD", fuel: "Gasoline", engine: "2.5L 4-cyl",
    status: "available", photos: [],
    highlights: ["One owner", "BC vehicle, no accidents declared", "Heated seats, sunroof"] },

  { stock: "J-1002", year: 2019, make: "Honda", model: "Civic", trim: "EX Sedan",
    price: 22495, km: 62100, body: "sedan", color: "Aegean Blue", colorHex: "#2F5C8A",
    transmission: "CVT", drivetrain: "FWD", fuel: "Gasoline", engine: "2.0L 4-cyl",
    status: "available", photos: [],
    highlights: ["Apple CarPlay / Android Auto", "Lane watch camera", "Fresh oil service"] },

  { stock: "J-1003", year: 2020, make: "Ford", model: "F-150", trim: "XLT SuperCrew 4x4",
    price: 41900, km: 71500, body: "truck", color: "Oxford White", colorHex: "#E9EAE6",
    transmission: "Automatic", drivetrain: "4x4", fuel: "Gasoline", engine: "2.7L EcoBoost V6",
    status: "available", photos: [],
    highlights: ["Tow package", "Spray-in bed liner", "Remote start"] },

  { stock: "J-1004", year: 2018, make: "Mazda", model: "CX-5", trim: "GS AWD",
    price: 21995, km: 88000, body: "suv", color: "Soul Red", colorHex: "#A3202A",
    transmission: "Automatic", drivetrain: "AWD", fuel: "Gasoline", engine: "2.5L 4-cyl",
    status: "available", photos: [],
    highlights: ["Blind spot monitoring", "Power liftgate", "Winter tires included"] },

  { stock: "J-1005", year: 2022, make: "Hyundai", model: "Elantra", trim: "Preferred",
    price: 23750, km: 29400, body: "sedan", color: "Fluid Metal", colorHex: "#6E7378",
    transmission: "IVT", drivetrain: "FWD", fuel: "Gasoline", engine: "2.0L 4-cyl",
    status: "available", photos: [],
    highlights: ["Balance of factory warranty", "Heated steering wheel", "Low kilometres"] },

  { stock: "J-1006", year: 2017, make: "Jaguar", model: "F-PACE", trim: "35t Prestige AWD",
    price: 26900, km: 96300, body: "suv", color: "British Racing Green", colorHex: "#1F4433",
    transmission: "Automatic", drivetrain: "AWD", fuel: "Gasoline", engine: "3.0L supercharged V6",
    status: "pending", photos: [],
    highlights: ["Leather, panoramic roof", "Meridian sound", "Full service records"] },

  { stock: "J-1007", year: 2020, make: "Tesla", model: "Model 3", trim: "Standard Range Plus",
    price: 31500, km: 54000, body: "sedan", color: "Pearl White", colorHex: "#EDEDEA",
    transmission: "Single-speed", drivetrain: "RWD", fuel: "Electric", engine: "Electric motor",
    status: "available", photos: [],
    highlights: ["Autopilot", "Glass roof", "Battery health report available"] },

  { stock: "J-1008", year: 2016, make: "Toyota", model: "Tacoma", trim: "TRD Off-Road 4x4",
    price: 33995, km: 118000, body: "truck", color: "Black", colorHex: "#1D1F21",
    transmission: "Automatic", drivetrain: "4x4", fuel: "Gasoline", engine: "3.5L V6",
    status: "available", photos: [],
    highlights: ["Locking rear differential", "Crawl control", "Tonneau cover"] },

  { stock: "J-1009", year: 2019, make: "Volkswagen", model: "Golf GTI", trim: "Autobahn",
    price: 25400, km: 57800, body: "hatch", color: "Indium Grey", colorHex: "#55595D",
    transmission: "6-speed manual", drivetrain: "FWD", fuel: "Gasoline", engine: "2.0L turbo 4-cyl",
    status: "available", photos: [],
    highlights: ["Manual transmission", "Adaptive cruise", "Fender audio"] },

  { stock: "J-1010", year: 2021, make: "Kia", model: "Sportage", trim: "LX AWD",
    price: 24995, km: 41000, body: "suv", color: "Snow White Pearl", colorHex: "#E6E6E2",
    transmission: "Automatic", drivetrain: "AWD", fuel: "Gasoline", engine: "2.4L 4-cyl",
    status: "available", photos: [],
    highlights: ["Heated seats", "Rear camera", "Bluetooth"] },

  { stock: "J-1011", year: 2018, make: "BMW", model: "430i", trim: "xDrive Coupe",
    price: 29800, km: 74200, body: "coupe", color: "Black Sapphire", colorHex: "#16181C",
    transmission: "Automatic", drivetrain: "AWD", fuel: "Gasoline", engine: "2.0L turbo 4-cyl",
    status: "available", photos: [],
    highlights: ["M Sport package", "Navigation", "Harman Kardon audio"] },

  { stock: "J-1012", year: 2015, make: "Honda", model: "CR-V", trim: "EX-L AWD",
    price: 15995, km: 142000, body: "suv", color: "Modern Steel", colorHex: "#5B6168",
    transmission: "CVT", drivetrain: "AWD", fuel: "Gasoline", engine: "2.4L 4-cyl",
    status: "available", photos: [],
    highlights: ["Leather seats", "Timing service done", "Great first SUV"] },

  { stock: "J-1013", year: 2023, make: "Toyota", model: "Corolla", trim: "LE",
    price: 26495, km: 18900, body: "sedan", color: "Celestite Grey", colorHex: "#7F8B92",
    transmission: "CVT", drivetrain: "FWD", fuel: "Gasoline", engine: "2.0L 4-cyl",
    status: "available", photos: [],
    highlights: ["Under 20,000 km", "Toyota Safety Sense 3.0", "Balance of warranty"] },

  { stock: "J-1014", year: 2019, make: "Chevrolet", model: "Silverado 1500", trim: "LT Crew Cab 4WD",
    price: 36900, km: 89500, body: "truck", color: "Red Hot", colorHex: "#B3262B",
    transmission: "Automatic", drivetrain: "4x4", fuel: "Gasoline", engine: "5.3L V8",
    status: "available", photos: [],
    highlights: ["Trailering package", "Heated seats and wheel", "20\" wheels"] }
];
