export const STATE_CODES = {
  "andaman and nicobar islands": "35", "andhra pradesh": "28", "arunachal pradesh": "12",
  "assam": "18", "bihar": "10", "chandigarh": "94", "chhattisgarh": "22",
  "dadra and nagar haveli and daman and diu": "25", "delhi": "97", "goa": "30",
  "gujarat": "24", "haryana": "96", "himachal pradesh": "92", "jammu and kashmir": "91",
  "jharkhand": "20", "karnataka": "29", "kerala": "32", "ladakh": "37",
  "lakshadweep": "31", "madhya pradesh": "23", "maharashtra": "27", "manipur": "14",
  "meghalaya": "17", "mizoram": "15", "nagaland": "13", "odisha": "21",
  "puducherry": "34", "punjab": "93", "rajasthan": "98", "sikkim": "11",
  "tamil nadu": "33", "telangana": "36", "tripura": "16", "uttarakhand": "95",
  "uttar pradesh": "99", "west bengal": "19",
};

const CITY_TO_STATE = {
  "bengaluru": "karnataka", "bangalore": "karnataka", "mysore": "karnataka", "mysuru": "karnataka",
  "hubli": "karnataka", "hubballi": "karnataka", "mangalore": "karnataka", "mangaluru": "karnataka",
  "belgaum": "karnataka", "belagavi": "karnataka", "dharwad": "karnataka", "shimoga": "karnataka",
  "shivamogga": "karnataka", "davangere": "karnataka", "davanagere": "karnataka",
  "tumkur": "karnataka", "tumakuru": "karnataka", "bellary": "karnataka", "ballari": "karnataka",
  "gulbarga": "karnataka", "kalaburagi": "karnataka", "raichur": "karnataka", "bijapur": "karnataka",
  "vijayapura": "karnataka", "udupi": "karnataka", "hassan": "karnataka", "mandya": "karnataka",
  "kodagu": "karnataka", "coorg": "karnataka", "chitradurga": "karnataka", "kolar": "karnataka",
  "chikkamagaluru": "karnataka", "chikmagalur": "karnataka", "koppal": "karnataka",
  "gadag": "karnataka", "haveri": "karnataka", "yadgir": "karnataka", "bagalkot": "karnataka",
  "mumbai": "maharashtra", "pune": "maharashtra", "nagpur": "maharashtra", "thane": "maharashtra",
  "nashik": "maharashtra", "aurangabad": "maharashtra", "solapur": "maharashtra", "kolhapur": "maharashtra",
  "delhi": "delhi", "new delhi": "delhi", "noida": "uttar pradesh", "gurgaon": "haryana",
  "gurugram": "haryana", "faridabad": "haryana", "ghaziabad": "uttar pradesh",
  "chennai": "tamil nadu", "coimbatore": "tamil nadu", "madurai": "tamil nadu", "salem": "tamil nadu",
  "trichy": "tamil nadu", "tiruchirappalli": "tamil nadu", "tiruppur": "tamil nadu",
  "hyderabad": "telangana", "secunderabad": "telangana", "warangal": "telangana",
  "visakhapatnam": "andhra pradesh", "vizag": "andhra pradesh", "vijayawada": "andhra pradesh",
  "tirupati": "andhra pradesh", "guntur": "andhra pradesh", "nellore": "andhra pradesh",
  "kolkata": "west bengal", "howrah": "west bengal", "durgapur": "west bengal",
  "ahmedabad": "gujarat", "surat": "gujarat", "vadodara": "gujarat", "rajkot": "gujarat",
  "lucknow": "uttar pradesh", "kanpur": "uttar pradesh", "agra": "uttar pradesh",
  "varanasi": "uttar pradesh", "allahabad": "uttar pradesh", "prayagraj": "uttar pradesh",
  "meerut": "uttar pradesh", "bareilly": "uttar pradesh",
  "jaipur": "rajasthan", "jodhpur": "rajasthan", "udaipur": "rajasthan", "kota": "rajasthan",
  "patna": "bihar", "gaya": "bihar", "muzaffarpur": "bihar",
  "bhopal": "madhya pradesh", "indore": "madhya pradesh", "jabalpur": "madhya pradesh", "gwalior": "madhya pradesh",
  "raipur": "chhattisgarh", "bilaspur": "chhattisgarh",
  "ranchi": "jharkhand", "jamshedpur": "jharkhand", "dhanbad": "jharkhand",
  "bhubaneswar": "odisha", "cuttack": "odisha",
  "thiruvananthapuram": "kerala", "kochi": "kerala", "kozhikode": "kerala", "ernakulam": "kerala",
  "trivandrum": "kerala", "thrissur": "kerala", "calicut": "kerala",
  "chandigarh": "chandigarh", "ludhiana": "punjab", "amritsar": "punjab", "jalandhar": "punjab",
  "dehradun": "uttarakhand", "haridwar": "uttarakhand",
  "panaji": "goa", "margao": "goa", "vasco da gama": "goa",
  "guwahati": "assam", "silchar": "assam", "dibrugarh": "assam",
  "imphal": "manipur", "shillong": "meghalaya", "aizawl": "mizoram", "agartala": "tripura",
  "kohima": "nagaland", "itanagar": "arunachal pradesh", "gangtok": "sikkim",
  "port blair": "andaman and nicobar islands", "pondicherry": "puducherry",
  "jammu": "jammu and kashmir", "srinagar": "jammu and kashmir", "leh": "ladakh",
};

export const BLOOD_GROUP_CODES = {
  "A+": "11", "A-": "12", "B+": "13", "B-": "14",
  "O+": "15", "O-": "16", "AB+": "17", "AB-": "18",
};

export const COMPONENT_CODES = {
  "Whole Blood": "11",
  "Packed Red Blood Cells": "12",
  "Packed Red Cells": "12",
  "Fresh Frozen Plasma": "13",
  "Single Donor Platelet": "14",
  "Platelets": "14",
  "Platelet Rich Plasma": "16",
  "Cryoprecipitate": "17",
  "Single Donor Plasma": "18",
  "Plasma": "19",
  "Platelet Concentrate": "20",
  "Random Donor Platelets": "23",
  "Sagm Packed Red Blood Cells": "28",
  "Irradiated RBC": "29",
  "Leukoreduced Rbc": "30",
};

function generateToken(params) {
  const filteredParams = params.filter(p => p.name !== "hmode");
  const jsonStr = JSON.stringify(filteredParams);
  const b64 = Buffer.from(jsonStr, "utf8").toString("base64");
  let hex = "";
  for (const ch of b64) {
    hex += "\\u" + ch.charCodeAt(0).toString(16).padStart(4, "0");
  }
  return encodeURI(hex);
}

export function resolveState(location) {
  const lower = location.toLowerCase().trim();
  if (STATE_CODES[lower]) return { stateCode: STATE_CODES[lower], stateName: lower };
  for (const [city, state] of Object.entries(CITY_TO_STATE)) {
    if (lower.includes(city)) return { stateCode: STATE_CODES[state], stateName: state };
  }
  for (const [state, code] of Object.entries(STATE_CODES)) {
    if (lower.includes(state)) return { stateCode: code, stateName: state };
  }
  return null;
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, "").trim();
}

function parseFacilityHtml(html) {
  const parts = html.split(/<br\s*\/?>/gi);
  const name = stripHtml(parts[0] || "").replace(/^-$/, "").trim();
  let address = "", city = "", district = "", state = "";
  let phone = null, email = null;

  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1];
    const phoneMatch = lastPart.match(/Phone:\s*([^,]+)/i);
    const emailMatch = lastPart.match(/Email:\s*(\S+)/i);
    if (phoneMatch) phone = phoneMatch[1].trim().replace(/^-$/, "") || null;
    if (emailMatch) email = emailMatch[1].trim();

    const fullAddr = stripHtml(parts[1] || "");
    const addrTokens = fullAddr.split(",").map(s => s.trim()).filter(Boolean);

    if (addrTokens.length >= 3) {
      state = addrTokens[addrTokens.length - 1];
      district = addrTokens[addrTokens.length - 2];
      city = addrTokens[addrTokens.length - 3];
      address = addrTokens.slice(0, -3).join(", ");
    } else if (addrTokens.length === 2) {
      state = addrTokens[1];
      city = addrTokens[0];
    } else {
      city = fullAddr;
    }
  }

  if (phone) {
    const phones = phone.split(/[,\/]/).map(p => p.trim()).filter(p => /[\d]{7,}/.test(p));
    phone = phones[0] || null;
  }

  return { name: name || null, address, city, district, state, phone, email };
}

function parseAvailability(html) {
  const isAvailable = html.includes("text-success");
  let units = 0;
  if (isAvailable) {
    const match = html.match(/:(\d+)/);
    if (match) units = parseInt(match[1], 10);
  }
  return { available: isAvailable, units };
}

function parseLastUpdated(text) {
  if (!text || text.includes("<img")) return null;
  const cleaned = stripHtml(text).trim();
  if (!cleaned || cleaned === "-") return null;
  const d = new Date(cleaned.replace(" ", "T") + "+05:30");
  return isNaN(d.getTime()) ? null : d.toISOString();
}

export async function searchEraktkosh({ bloodGroup, component, location, emit }) {
  const stateInfo = resolveState(location);
  if (!stateInfo) {
    throw new Error(`Could not determine state for location: "${location}". Try including the state name.`);
  }

  const bgCode = BLOOD_GROUP_CODES[bloodGroup];
  if (!bgCode) throw new Error(`Unknown blood group: ${bloodGroup}`);

  let compCode = COMPONENT_CODES[component];
  if (!compCode) {
    const lower = component.toLowerCase();
    for (const [name, code] of Object.entries(COMPONENT_CODES)) {
      if (name.toLowerCase().includes(lower) || lower.includes(name.toLowerCase())) {
        compCode = code;
        break;
      }
    }
  }
  if (!compCode) compCode = "11";

  const componentCodesToSearch = [compCode];
  if (compCode === "12") componentCodesToSearch.push("28");

  emit?.({ type: "progress", text: `Querying eRaktKosh for ${bloodGroup} in ${stateInfo.stateName}...` });

  const allListings = [];

  for (const cc of componentCodesToSearch) {
    const params = [
      { name: "stateCode", value: stateInfo.stateCode },
      { name: "districtCode", value: "-1" },
      { name: "bloodGroup", value: bgCode },
      { name: "bloodComponent", value: cc },
      { name: "lang", value: "English" },
    ];

    const token = generateToken(params);
    const queryString = `hmode=GETNEARBYSTOCKDETAILS&stateCode=${stateInfo.stateCode}&districtCode=-1&bloodGroup=${bgCode}&bloodComponent=${cc}&lang=English&abfhttf=${token}`;
    const url = `https://eraktkosh.mohfw.gov.in/BLDAHIMS/bloodbank/stockAvailability.cnt?${queryString}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    try {
      const pageRes = await fetch("https://eraktkosh.mohfw.gov.in/BLDAHIMS/bloodbank/stockAvailability.cnt", {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
        signal: controller.signal,
      });

      const cookies = pageRes.headers.getSetCookie?.() || [];
      const cookieString = cookies.map(c => c.split(";")[0]).join("; ");

      emit?.({ type: "progress", text: `Fetching blood stock data from eRaktKosh...` });

      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "X-Requested-With": "XMLHttpRequest",
          "Referer": "https://eraktkosh.mohfw.gov.in/BLDAHIMS/bloodbank/stockAvailability.cnt",
          "Accept": "application/json, text/javascript, */*; q=0.01",
          ...(cookieString ? { "Cookie": cookieString } : {}),
        },
        signal: controller.signal,
      });

      if (!res.ok) {
        emit?.({ type: "progress", text: `eRaktKosh returned status ${res.status}` });
        continue;
      }

      let rawText = await res.text();
      clearTimeout(timeout);
      rawText = rawText.replace(/[\x00-\x1f]/g, (ch) => {
        if (ch === '\n') return '\\n';
        if (ch === '\r') return '\\r';
        if (ch === '\t') return '\\t';
        return '';
      });
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        emit?.({ type: "progress", text: "Failed to parse eRaktKosh response" });
        continue;
      }

      if (!data?.data || !Array.isArray(data.data)) {
        emit?.({ type: "progress", text: "No data returned from eRaktKosh" });
        continue;
      }

      emit?.({ type: "progress", text: `Processing ${data.data.length} blood bank records...` });

      for (const row of data.data) {
        if (!Array.isArray(row) || row.length < 5) continue;

        const facility = parseFacilityHtml(row[1] || "");
        const bankType = stripHtml(row[2] || "");
        const availability = parseAvailability(row[3] || "");
        const lastUpdated = parseLastUpdated(row[4]);
        const category = stripHtml(row[5] || "");

        if (!facility.name) continue;

        let componentName = component;
        for (const [name, code] of Object.entries(COMPONENT_CODES)) {
          if (code === cc) { componentName = name; break; }
        }

        const now = new Date().toISOString();
        const ageHours = lastUpdated ? (Date.now() - Date.parse(lastUpdated)) / 3600000 : null;
        const freshness = ageHours == null ? "unknown" : ageHours <= 1 ? "live" : ageHours <= 24 ? "recent" : ageHours <= 72 ? "aging" : "stale";

        allListings.push({
          facilityName: facility.name,
          bloodGroup,
          component: componentName,
          unitsAvailable: availability.units,
          available: availability.available,
          city: facility.city || facility.district || location,
          district: facility.district || "",
          address: facility.address || "",
          phone: facility.phone,
          email: facility.email,
          bankType: bankType || "Unknown",
          category: category || "Blood Bank",
          lastUpdated,
          lastUpdatedText: lastUpdated ? new Date(lastUpdated).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : null,
          freshness,
          status: availability.available ? "available" : "not_available",
          sourceUrl: "https://eraktkosh.mohfw.gov.in/BLDAHIMS/bloodbank/stockAvailability.cnt",
          sourceName: "eRaktKosh (National Blood Stock)",
          observedAt: now,
        });
      }
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === "AbortError") {
        emit?.({ type: "progress", text: "eRaktKosh request timed out" });
      } else {
        emit?.({ type: "progress", text: `eRaktKosh error: ${err.message}` });
      }
    }
  }

  return allListings;
}

export function filterAndRank(listings, { location, units, bloodGroup }) {
  const locationLower = location.toLowerCase();

  const scored = listings.map(listing => {
    let score = 0;
    if (listing.available) score += 10000;
    if (listing.available && listing.unitsAvailable >= units) score += 5000;

    const cityLower = (listing.city + " " + listing.district + " " + listing.address).toLowerCase();
    if (cityLower.includes(locationLower.split(",")[0].trim().split(" ")[0])) score += 2000;

    if (listing.freshness === "live") score += 500;
    else if (listing.freshness === "recent") score += 300;
    else if (listing.freshness === "aging") score += 100;
    else if (listing.freshness === "stale") score += 10;

    if (listing.bankType === "Govt.") score += 50;
    else if (listing.bankType === "Red Cross") score += 40;

    return { ...listing, _score: score };
  });

  scored.sort((a, b) => b._score - a._score);
  return scored.map(({ _score, ...rest }) => rest);
}
