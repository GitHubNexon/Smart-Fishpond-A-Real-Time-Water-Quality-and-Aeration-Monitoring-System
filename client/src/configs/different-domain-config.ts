// // src/configs/different-domain-config.ts

// let apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

// if (!apiBaseUrl || apiBaseUrl === "") {
//   switch (process.env.NODE_ENV) {
//     case "development":
//       apiBaseUrl = "http://localhost:3005/api";
//       break;
//     case "production":
//       // throw new Error("NEXT_PUBLIC_API_URL is not set in production!");
//       apiBaseUrl = "/api";
//     default:
//       apiBaseUrl = "http://localhost:3005/api";
//   }
// }

// export const API_BASE_URL = apiBaseUrl;


// src/configs/different-domain-config.ts

let apiBaseUrl: string;

if (process.env.NODE_ENV === "production") {
  // Always use relative API in prod so it goes through Next.js rewrite
  apiBaseUrl = "/backend";
} else {
  // In dev, call backend directly
  apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/api";
}

export const API_BASE_URL = apiBaseUrl;
