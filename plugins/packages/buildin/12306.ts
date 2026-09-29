/* METADATA
{
    "name": "12306_ticket",

    "display_name": {
        "zh": "12306 Extension",
        "en": "12306 Extension"
    },
    "description": { "zh": "Query China Railway 12306 train ticket information, including availability, transfer routes, and stop stations.", "en": "Query China Railway 12306 train ticket information, including availability, transfer routes, and stop stations." },
    "enabledByDefault": true,
    "category": "Life",
    "tools": [
        {
            "name": "get_current_date",
            "description": { "zh": "Get the current date in the Shanghai timezone (Asia/Shanghai, UTC+8). Returns format 'yyyy-MM-dd'. Mainly used to resolve relative dates (e.g. \"tomorrow\", \"next Wednesday\") and provide correct date input for other APIs.", "en": "Get the current date in the Shanghai timezone (Asia/Shanghai, UTC+8). Returns format 'yyyy-MM-dd'. Mainly used to resolve relative dates (e.g. \"tomorrow\", \"next Wednesday\") and provide correct date input for other APIs." },
            "parameters": []
        },
        {
            "name": "get_stations_code_in_city",
            "description": { "zh": "Given a Chinese city name, list **all** train stations in that city and their corresponding `station_code`.", "en": "Given a Chinese city name, list **all** train stations in that city and their corresponding `station_code`." },
            "parameters": [
                { "name": "city", "description": { "zh": "Chinese city name, e.g. '北京', '上海'.", "en": "Chinese city name, e.g. '北京', '上海'." }, "type": "string", "required": true }
            ]
        },
        {
            "name": "get_station_code_of_citys",
            "description": { "zh": "Get the representative `station_code` for a Chinese city name. Use this when the user provides a **city name** as origin/destination and you need a `station_code`.", "en": "Get the representative `station_code` for a Chinese city name. Use this when the user provides a **city name** as origin/destination and you need a `station_code`." },
            "parameters": [
                { "name": "citys", "description": { "zh": "City to query, e.g. '北京'. For multiple cities, separate with |, e.g. '北京|上海'.", "en": "City to query, e.g. '北京'. For multiple cities, separate with |, e.g. '北京|上海'." }, "type": "string", "required": true }
            ]
        },
        {
            "name": "get_station_code_by_names",
            "description": { "zh": "Given a specific Chinese station name, return its `station_code` and station name. Use this when the user provides a **specific station name** for origin/destination.", "en": "Given a specific Chinese station name, return its `station_code` and station name. Use this when the user provides a **specific station name** for origin/destination." },
            "parameters": [
                { "name": "station_names", "description": { "zh": "Specific Chinese station names, e.g. '北京南', '上海虹桥'. For multiple stations, separate with |, e.g. '北京南|上海虹桥'.", "en": "Specific Chinese station names, e.g. '北京南', '上海虹桥'. For multiple stations, separate with |, e.g. '北京南|上海虹桥'." }, "type": "string", "required": true }
            ]
        },
        {
            "name": "get_station_by_telecode",
            "description": { "zh": "Query station details by `station_telecode`, including name, pinyin, city, etc. Mainly for getting more complete station data when `telecode` is known, or for special queries/debugging.", "en": "Query station details by `station_telecode`, including name, pinyin, city, etc. Mainly for getting more complete station data when `telecode` is known, or for special queries/debugging." },
            "parameters": [
                { "name": "station_telecode", "description": { "zh": "Station `station_telecode` (3-letter code).", "en": "Station `station_telecode` (3-letter code)." }, "type": "string", "required": true }
            ]
        },
        {
            "name": "get_tickets",
            "description": { "zh": "Query 12306 ticket availability.", "en": "Query 12306 ticket availability." },
            "parameters": [
                { "name": "date", "description": { "zh": "Query date in 'yyyy-MM-dd'. If the user gives a relative date (e.g. \"tomorrow\"), call `get_current_date` first and compute the target date.", "en": "Query date in 'yyyy-MM-dd'. If the user gives a relative date (e.g. \"tomorrow\"), call `get_current_date` first and compute the target date." }, "type": "string", "required": true },
                { "name": "from_station", "description": { "zh": "Origin `station_code`. Must be obtained via `get_station_code_by_names` or `get_station_code_of_citys` (do NOT pass Chinese names directly).", "en": "Origin `station_code`. Must be obtained via `get_station_code_by_names` or `get_station_code_of_citys` (do NOT pass Chinese names directly)." }, "type": "string", "required": true },
                { "name": "to_station", "description": { "zh": "Destination `station_code`. Must be obtained via `get_station_code_by_names` or `get_station_code_of_citys` (do NOT pass Chinese names directly).", "en": "Destination `station_code`. Must be obtained via `get_station_code_by_names` or `get_station_code_of_citys` (do NOT pass Chinese names directly)." }, "type": "string", "required": true },
                { "name": "train_filter_flags", "description": { "zh": "Train filter flags. Default empty (no filter). Can combine multiple flags. Example: for high-speed rail, use 'G'. Options: [G(High-speed/Intercity),D(EMU),Z(Direct express),T(Express),K(Fast),O(Other),F(Fuxing),S(Smart EMU)].", "en": "Train filter flags. Default empty (no filter). Can combine multiple flags. Example: for high-speed rail, use 'G'. Options: [G(High-speed/Intercity),D(EMU),Z(Direct express),T(Express),K(Fast),O(Other),F(Fuxing),S(Smart EMU)]." }, "type": "string", "required": false },
                { "name": "sort_flag", "description": { "zh": "Sort mode. Default empty (no sorting). Only one mode is supported. Options: [startTime (earliest departure), arriveTime (earliest arrival), duration (shortest duration)].", "en": "Sort mode. Default empty (no sorting). Only one mode is supported. Options: [startTime (earliest departure), arriveTime (earliest arrival), duration (shortest duration)]." }, "type": "string", "required": false },
                { "name": "sort_reverse", "description": { "zh": "Reverse sort order (default: false). Only effective when sort_flag is set.", "en": "Reverse sort order (default: false). Only effective when sort_flag is set." }, "type": "boolean", "required": false },
                { "name": "limited_num", "description": { "zh": "Limit number of returned results (default: 0, no limit).", "en": "Limit number of returned results (default: 0, no limit)." }, "type": "number", "required": false }
            ]
        },
        {
            "name": "get_interline_tickets",
            "description": { "zh": "Query 12306 transfer (interline) ticket availability. Currently only supports the first 10 results.", "en": "Query 12306 transfer (interline) ticket availability. Currently only supports the first 10 results." },
            "parameters": [
                { "name": "date", "description": { "zh": "Query date in 'yyyy-MM-dd'. If the user gives a relative date, call `get_current_date` first and compute the target date.", "en": "Query date in 'yyyy-MM-dd'. If the user gives a relative date, call `get_current_date` first and compute the target date." }, "type": "string", "required": true },
                { "name": "from_station", "description": { "zh": "Origin `station_code`. Must be obtained via station-code lookup APIs (do NOT pass Chinese names directly).", "en": "Origin `station_code`. Must be obtained via station-code lookup APIs (do NOT pass Chinese names directly)." }, "type": "string", "required": true },
                { "name": "to_station", "description": { "zh": "Destination `station_code`. Must be obtained via station-code lookup APIs (do NOT pass Chinese names directly).", "en": "Destination `station_code`. Must be obtained via station-code lookup APIs (do NOT pass Chinese names directly)." }, "type": "string", "required": true },
                { "name": "middle_station", "description": { "zh": "Optional transfer station `station_code`. Must be obtained via station-code lookup APIs (do NOT pass Chinese names directly).", "en": "Optional transfer station `station_code`. Must be obtained via station-code lookup APIs (do NOT pass Chinese names directly)." }, "type": "string", "required": false },
                { "name": "show_wz", "description": { "zh": "Whether to include no-seat (无座) tickets (default: false).", "en": "Whether to include no-seat (无座) tickets (default: false)." }, "type": "boolean", "required": false },
                { "name": "train_filter_flags", "description": { "zh": "Train filter flags. Default empty. Combine multiple flags from: [G(High-speed/Intercity),D(EMU),Z(Direct express),T(Express),K(Fast),O(Other),F(Fuxing),S(Smart EMU)].", "en": "Train filter flags. Default empty. Combine multiple flags from: [G(High-speed/Intercity),D(EMU),Z(Direct express),T(Express),K(Fast),O(Other),F(Fuxing),S(Smart EMU)]." }, "type": "string", "required": false },
                { "name": "sort_flag", "description": { "zh": "Sort mode. Default empty. Options: startTime / arriveTime / duration.", "en": "Sort mode. Default empty. Options: startTime / arriveTime / duration." }, "type": "string", "required": false },
                { "name": "sort_reverse", "description": { "zh": "Reverse sort order (default: false). Only effective when sort_flag is set.", "en": "Reverse sort order (default: false). Only effective when sort_flag is set." }, "type": "boolean", "required": false },
                { "name": "limited_num", "description": { "zh": "Limit number of returned results (default: 10).", "en": "Limit number of returned results (default: 10)." }, "type": "number", "required": false }
            ]
        },
        {
            "name": "get_train_route_stations",
            "description": { "zh": "Query detailed stop information for a specific train within a segment, including stations, arrival/departure times, and stop duration. Use when the user asks for stops of a specific train.", "en": "Query detailed stop information for a specific train within a segment, including stations, arrival/departure times, and stop duration. Use when the user asks for stops of a specific train." },
            "parameters": [
                { "name": "train_no", "description": { "zh": "Actual train number `train_no`, e.g. '240000G10336' (not 'G1033'). Usually obtained from `get_tickets` results or provided by the user.", "en": "Actual train number `train_no`, e.g. '240000G10336' (not 'G1033'). Usually obtained from `get_tickets` results or provided by the user." }, "type": "string", "required": true },
                { "name": "from_station_telecode", "description": { "zh": "`station_telecode` (3-letter code) of the **origin station**. Usually from `telecode` fields in `get_tickets`, or obtained via station code lookup.", "en": "`station_telecode` (3-letter code) of the **origin station**. Usually from `telecode` fields in `get_tickets`, or obtained via station code lookup." }, "type": "string", "required": true },
                { "name": "to_station_telecode", "description": { "zh": "`station_telecode` (3-letter code) of the **destination station**. Usually from `telecode` fields in `get_tickets`, or obtained via station code lookup.", "en": "`station_telecode` (3-letter code) of the **destination station**. Usually from `telecode` fields in `get_tickets`, or obtained via station code lookup." }, "type": "string", "required": true },
                { "name": "depart_date", "description": { "zh": "Departure date from the origin station (format: yyyy-MM-dd). If the user provides a relative date, resolve it via `get_current_date`.", "en": "Departure date from the origin station (format: yyyy-MM-dd). If the user provides a relative date, resolve it via `get_current_date`." }, "type": "string", "required": true }
            ]
        }
    ]
}*/

// #region Type definitions
type TicketData = {
    secret_Sstr: string;
    button_text_info: string;
    train_no: string;
    station_train_code: string;
    start_station_telecode: string;
    end_station_telecode: string;
    from_station_telecode: string;
    to_station_telecode: string;
    start_time: string;
    arrive_time: string;
    lishi: string;
    canWebBuy: string;
    yp_info: string;
    start_train_date: string;
    train_seat_feature: string;
    location_code: string;
    from_station_no: string;
    to_station_no: string;
    is_support_card: string;
    controlled_train_flag: string;
    gg_num: string;
    gr_num: string;
    qt_num: string;
    rw_num: string;
    rz_num: string;
    tz_num: string;
    wz_num: string;
    yb_num: string;
    yw_num: string;
    yz_num: string;
    ze_num: string;
    zy_num: string;
    swz_num: string;
    srrb_num: string;
    yp_ex: string;
    seat_types: string;
    exchange_train_flag: string;
    houbu_train_flag: string;
    houbu_seat_limit: string;
    yp_info_new: string;
    '40': string;
    '41': string;
    '42': string;
    '43': string;
    '44': string;
    '45': string;
    dw_flag: string;
    '47': string;
    stopcheckTime: string;
    country_flag: string;
    local_arrive_time: string;
    local_start_time: string;
    '52': string;
    bed_level_info: string;
    seat_discount_info: string;
    sale_time: string;
    '56': string;
};

const TicketDataKeys: (keyof TicketData)[] = [
    'secret_Sstr', 'button_text_info', 'train_no', 'station_train_code', 'start_station_telecode',
    'end_station_telecode', 'from_station_telecode', 'to_station_telecode', 'start_time', 'arrive_time',
    'lishi', 'canWebBuy', 'yp_info', 'start_train_date', 'train_seat_feature',
    'location_code', 'from_station_no', 'to_station_no', 'is_support_card', 'controlled_train_flag',
    'gg_num', 'gr_num', 'qt_num', 'rw_num', 'rz_num',
    'tz_num', 'wz_num', 'yb_num', 'yw_num', 'yz_num',
    'ze_num', 'zy_num', 'swz_num', 'srrb_num', 'yp_ex',
    'seat_types', 'exchange_train_flag', 'houbu_train_flag', 'houbu_seat_limit', 'yp_info_new',
    '40', '41', '42', '43', '44',
    '45', 'dw_flag', '47', 'stopcheckTime', 'country_flag',
    'local_arrive_time', 'local_start_time', '52', 'bed_level_info', 'seat_discount_info',
    'sale_time', '56',
];

type TicketInfo = {
    train_no: string;
    start_train_code: string;
    start_date: string;
    start_time: string;
    arrive_date: string;
    arrive_time: string;
    lishi: string;
    from_station: string;
    to_station: string;
    from_station_telecode: string;
    to_station_telecode: string;
    prices: Price[];
    dw_flag: string[];
};

type StationData = {
    station_id: string;
    station_name: string;
    station_code: string;
    station_pinyin: string;
    station_short: string;
    station_index: string;
    code: string;
    city: string;
    r1: string;
    r2: string;
};

const StationDataKeys: (keyof StationData)[] = [
    'station_id', 'station_name', 'station_code', 'station_pinyin', 'station_short',
    'station_index', 'code', 'city', 'r1', 'r2',
];

interface Price {
    seat_name: string;
    short: string;
    seat_type_code: string;
    num: string;
    price: number;
    discount: number | undefined;
}

type RouteStationData = {
    arrive_time: string;
    station_name: string;
    isChina: string;
    start_time: string;
    stopover_time: string;
    station_no: string;
    country_code: string;
    country_name: string;
    isEnabled: boolean;
    train_class_name?: string;
    service_type?: string;
    end_station_name?: string;
    start_station_name?: string;
    station_train_code?: string;
};

type RouteStationInfo = {
    arrive_time: string;
    station_name: string;
    stopover_time: string;
    station_no: number;
};

type InterlineData = {
    all_lishi: string;
    all_lishi_minutes: number;
    arrive_date: string;
    arrive_time: string;
    end_station_code: string;
    end_station_name: string;
    first_train_no: string;
    from_station_code: string;
    from_station_name: string;
    fullList: InterlineTicketData[];
    isHeatTrain: string;
    isOutStation: string;
    lCWaitTime: string;
    lishi_flag: string;
    middle_date: string;
    middle_station_code: string;
    middle_station_name: string;
    same_station: string;
    same_train: string;
    score: number;
    score_str: string;
    scretstr: string;
    second_train_no: string;
    start_time: string;
    train_count: number;
    train_date: string; // Departure time
    use_time: string;
    wait_time: string;
    wait_time_minutes: number;
};

type InterlineInfo = {
    lishi: string;
    start_time: string;
    start_date: string;
    middle_date: string;
    arrive_date: string;
    arrive_time: string;
    from_station_code: string;
    from_station_name: string;
    middle_station_code: string;
    middle_station_name: string;
    end_station_code: string;
    end_station_name: string;
    start_train_code: string; // Used for filtering
    first_train_no: string;
    second_train_no: string;
    train_count: number;
    ticketList: TicketInfo[];
    same_station: boolean;
    same_train: boolean;
    wait_time: string;
};

type InterlineTicketData = {
    arrive_time: string;
    bed_level_info: string;
    controlled_train_flag: string;
    country_flag: string;
    day_difference: string;
    dw_flag: string;
    end_station_name: string;
    end_station_telecode: string;
    from_station_name: string;
    from_station_no: string;
    from_station_telecode: string;
    gg_num: string;
    gr_num: string;
    is_support_card: string;
    lishi: string;
    local_arrive_time: string;
    local_start_time: string;
    qt_num: string;
    rw_num: string;
    rz_num: string;
    seat_discount_info: string;
    seat_types: string;
    srrb_num: string;
    start_station_name: string;
    start_station_telecode: string;
    start_time: string;
    start_train_date: string;
    station_train_code: string;
    swz_num: string;
    to_station_name: string;
    to_station_no: string;
    to_station_telecode: string;
    train_no: string;
    train_seat_feature: string;
    trms_train_flag: string;
    tz_num: string;
    wz_num: string;
    yb_num: string;
    yp_info: string;
    yw_num: string;
    yz_num: string;
    ze_num: string;
    zy_num: string;
};

// #endregion

const ticket12306 = (function () {

    const API_BASE = 'https://kyfw.12306.cn';
    const WEB_URL = 'https://www.12306.cn/index/';
    const LCQUERY_INIT_URL = 'https://kyfw.12306.cn/otn/lcQuery/init';

    let LCQUERY_PATH: string | undefined = undefined;
    const MISSING_STATIONS: StationData[] = [
        { station_id: '@cdd', station_name: '成  都东', station_code: 'WEI', station_pinyin: 'chengdudong', station_short: 'cdd', station_index: '', code: '1707', city: '成都', r1: '', r2: '' },
    ];

    let STATIONS: Record<string, StationData> | undefined = undefined;
    let CITY_STATIONS: Record<string, { station_code: string; station_name: string }[]> | undefined = undefined;
    let CITY_CODES: Record<string, { station_code: string; station_name: string }> | undefined = undefined;
    let NAME_STATIONS: Record<string, { station_code: string; station_name: string }> | undefined = undefined;

    const SEAT_SHORT_TYPES = { swz: 'Business Class', tz: 'Premium Class', zy: 'First Class', ze: 'Second Class', gr: 'Deluxe Soft Sleeper', srrb: 'EMU Sleeper', rw: 'Soft Sleeper', yw: 'Hard Sleeper', rz: 'Soft Seat', yz: 'Hard Seat', wz: 'No Seat', qt: 'Other', gg: '', yb: '' };
    const SEAT_TYPES = {
        '9': { name: 'Business Class', short: 'swz' }, P: { name: 'Premium Class', short: 'tz' }, M: { name: 'First Class', short: 'zy' }, D: { name: 'Premium First Class', short: 'zy' }, O: { name: 'Second Class', short: 'ze' }, S: { name: 'Second Class Compartment', short: 'ze' }, '6': { name: 'Deluxe Soft Sleeper', short: 'gr' }, A: { name: 'Deluxe EMU Sleeper', short: 'gr' }, '4': { name: 'Soft Sleeper', short: 'rw' }, I: { name: 'First-class Sleeper', short: 'rw' }, F: { name: 'EMU Sleeper', short: 'rw' }, '3': { name: 'Hard Sleeper', short: 'yw' }, J: { name: 'Second-class Sleeper', short: 'yw' }, '2': { name: 'Soft Seat', short: 'rz' }, '1': { name: 'Hard Seat', short: 'yz' }, W: { name: 'No Seat', short: 'wz' }, WZ: { name: 'No Seat', short: 'wz' }, H: { name: 'Other', short: 'qt' },
    };
    const DW_FLAGS = ['智能动车组', '复兴号', '静音车厢', '温馨动卧', '动感号', '支持选铺', '老年优惠'];

    const client = OkHttp.newClient();
    let initPromise: Promise<void> | undefined = undefined;

    // #region Helper functions
    function formatDate(date: Date): string {
        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = date.getUTCDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function parseDate(dateStr: string): Date { // yyyyMMdd
        const year = parseInt(dateStr.substring(0, 4), 10);
        const month = parseInt(dateStr.substring(4, 6), 10) - 1;
        const day = parseInt(dateStr.substring(6, 8), 10);
        return new Date(Date.UTC(year, month, day));
    }

    function getCurrentShanghaiDate(): Date {
        const now = new Date();
        return new Date(now.getTime() + 8 * 60 * 60 * 1000);
    }

    function checkDate(dateStr: string): boolean { // yyyy-MM-dd
        const todayInShanghai = getCurrentShanghaiDate();
        todayInShanghai.setUTCHours(0, 0, 0, 0);

        const parts = dateStr.split('-').map(p => parseInt(p, 10));
        const inputDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));

        return inputDate.getTime() >= todayInShanghai.getTime();
    }

    function parseCookies(cookies: string[]): Record<string, string> {
        const cookieRecord: Record<string, string> = {};
        if (!cookies) return cookieRecord;
        cookies.forEach((cookie) => {
            const keyValuePart = cookie.split(';')[0];
            const [key, value] = keyValuePart.split('=');
            if (key && value) {
                cookieRecord[key.trim()] = value.trim();
            }
        });
        return cookieRecord;
    }

    function formatCookies(cookies: Record<string, string>): string {
        return Object.entries(cookies).map(([key, value]) => `${key}=${value}`).join('; ');
    }

    async function getCookie(): Promise<Record<string, string> | undefined> {
        const url = `${API_BASE}/otn/leftTicket/init`;
        try {
            const response = await client.newRequest().url(url).build().execute();
            const cookieHeader = response.headers && (response.headers['set-cookie'] || response.headers['Set-Cookie']);
            if (cookieHeader) {
                const parsed = parseCookies(Array.isArray(cookieHeader) ? cookieHeader : [cookieHeader]);
                if (Object.keys(parsed).length > 0) {
                    return parsed;
                }
            }
            // If no cookies are in the header, assume the client is stateful.
            // Return an empty object to signal success and rely on the client's cookie jar.
            return {};
        } catch (error) {
            console.error('Error getting 12306 cookie:', error);
            return undefined;
        }
    }

    async function make12306Request<T>(url: string, params: Record<string, string> = {}, headers: Record<string, string> = {}): Promise<T | undefined> {
        const queryString = Object.entries(params).map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('&');
        const fullUrl = queryString ? `${url}?${queryString}` : url;
        try {
            const finalHeaders = { ...headers };
            // If the cookie string is empty, remove it to let the client use its cookie jar.
            if (finalHeaders['Cookie'] === '') {
                delete finalHeaders['Cookie'];
            }
            const request = client.newRequest().url(fullUrl).method('GET').headers(finalHeaders);
            const response = await request.build().execute();
            if (!response.isSuccessful()) {
                throw new Error(`HTTP error! status: ${response.statusCode}`);
            }
            return JSON.parse(response.content);
        } catch (error) {
            console.error(`Error making 12306 request to ${fullUrl}:`, error);
            return undefined;
        }
    }

    async function make12306RequestHtml(url: string): Promise<string | undefined> {
        try {
            const request = client.newRequest().url(url).method('GET');
            const response = await request.build().execute();
            if (!response.isSuccessful()) {
                throw new Error(`HTTP error! status: ${response.statusCode}`);
            }
            return response.content;
        } catch (error) {
            console.error(`Error fetching HTML from ${url}:`, error);
            return undefined;
        }
    }

    function parseTicketsData(rawData: string[]): TicketData[] {
        const result: TicketData[] = [];
        for (const item of rawData) {
            const values = item.split('|');
            const entry: Partial<TicketData> = {};
            TicketDataKeys.forEach((key, index) => {
                entry[key] = values[index];
            });
            result.push(entry as TicketData);
        }
        return result;
    }

    function extractPrices(yp_info: string, seat_discount_info: string, ticketData: TicketData | InterlineTicketData): Price[] {
        const PRICE_STR_LENGTH = 10;
        const DISCOUNT_STR_LENGTH = 5;
        const prices: Price[] = [];
        const discounts: { [key: string]: number } = {};
        for (let i = 0; i < seat_discount_info.length / DISCOUNT_STR_LENGTH; i++) {
            const discount_str = seat_discount_info.slice(i * DISCOUNT_STR_LENGTH, (i + 1) * DISCOUNT_STR_LENGTH);
            discounts[discount_str[0]] = parseInt(discount_str.slice(1), 10);
        }

        for (let i = 0; i < yp_info.length / PRICE_STR_LENGTH; i++) {
            const price_str = yp_info.slice(i * PRICE_STR_LENGTH, (i + 1) * PRICE_STR_LENGTH);
            var seat_type_code;
            if (parseInt(price_str.slice(6, 10), 10) >= 3000) {
                seat_type_code = 'W'; // means no seat
            } else if (!Object.keys(SEAT_TYPES).includes(price_str[0])) {
                seat_type_code = 'H'; // other seat type
            } else {
                seat_type_code = price_str[0];
            }
            const seat_type = SEAT_TYPES[seat_type_code as keyof typeof SEAT_TYPES];
            const price = parseInt(price_str.slice(1, 6), 10) / 10;
            const discount = seat_type_code in discounts ? discounts[seat_type_code] : undefined;
            prices.push({
                seat_name: seat_type.name,
                short: seat_type.short,
                seat_type_code,
                num: ticketData[`${seat_type.short}_num` as keyof (TicketData | InterlineTicketData)],
                price,
                discount,
            });
        }
        return prices;
    }

    function extractDWFlags(dw_flag_str: string): string[] {
        const dwFlagList = dw_flag_str.split('#');
        let result: string[] = [];
        if ('5' == dwFlagList[0]) { result.push(DW_FLAGS[0]); }
        if (dwFlagList.length > 1 && '1' == dwFlagList[1]) { result.push(DW_FLAGS[1]); }
        if (dwFlagList.length > 2) {
            if ('Q' == dwFlagList[2].substring(0, 1)) { result.push(DW_FLAGS[2]); }
            else if ('R' == dwFlagList[2].substring(0, 1)) { result.push(DW_FLAGS[3]); }
        }
        if (dwFlagList.length > 5 && 'D' == dwFlagList[5]) { result.push(DW_FLAGS[4]); }
        if (dwFlagList.length > 6 && 'z' != dwFlagList[6]) { result.push(DW_FLAGS[5]); }
        if (dwFlagList.length > 7 && 'z' != dwFlagList[7]) { result.push(DW_FLAGS[6]); }
        return result;
    }

    function parseTicketsInfo(ticketsData: TicketData[], map: Record<string, string>): TicketInfo[] {
        const result: TicketInfo[] = [];
        for (const ticket of ticketsData) {
            const prices = extractPrices(ticket.yp_info_new, ticket.seat_discount_info, ticket);
            const dw_flag = extractDWFlags(ticket.dw_flag);
            const startDate = parseDate(ticket.start_train_date);
            const [startHours, startMinutes] = ticket.start_time.split(':').map(Number);
            const [durationHours, durationMinutes] = ticket.lishi.split(':').map(Number);

            const arriveDate = new Date(startDate);
            arriveDate.setUTCHours(arriveDate.getUTCHours() + startHours + durationHours, arriveDate.getUTCMinutes() + startMinutes + durationMinutes);

            result.push({
                train_no: ticket.train_no,
                start_date: formatDate(startDate),
                arrive_date: formatDate(arriveDate),
                start_train_code: ticket.station_train_code,
                start_time: ticket.start_time,
                arrive_time: ticket.arrive_time,
                lishi: ticket.lishi,
                from_station: map[ticket.from_station_telecode],
                to_station: map[ticket.to_station_telecode],
                from_station_telecode: ticket.from_station_telecode,
                to_station_telecode: ticket.to_station_telecode,
                prices: prices,
                dw_flag: dw_flag,
            });
        }
        return result;
    }

    function formatTicketStatus(num: string): string {
        if (num.match(/^\d+$/)) {
            const count = parseInt(num);
            return count === 0 ? 'No tickets' : `${count} tickets remaining`;
        }
        switch (num) {
            case '有': case '充足': return 'Tickets available';
            case '无': case '--': case '': return 'No tickets';
            case '候补': return 'No tickets, waitlist required';
            default: return `${num} tickets`;
        }
    }

    function formatTicketsInfo(ticketsInfo: TicketInfo[]): string {
        if (ticketsInfo.length === 0) return 'No matching train information found';
        let result = 'Train | Departure station -> Arrival station | Departure time -> Arrival time | Duration\n';
        ticketsInfo.forEach((ticketInfo) => {
            let infoStr = `${ticketInfo.start_train_code}(actual train_no: ${ticketInfo.train_no}) ${ticketInfo.from_station}(telecode: ${ticketInfo.from_station_telecode}) -> ${ticketInfo.to_station}(telecode: ${ticketInfo.to_station_telecode}) ${ticketInfo.start_time} -> ${ticketInfo.arrive_time} Duration: ${ticketInfo.lishi}`;
            ticketInfo.prices.forEach((price) => {
                infoStr += `\n- ${price.seat_name}: ${formatTicketStatus(price.num)} ${price.price} CNY`;
            });
            result += `${infoStr}\n`;
        });
        return result;
    }

    const TRAIN_FILTERS = {
        G: (t: TicketInfo | InterlineInfo) => t.start_train_code.startsWith('G') || t.start_train_code.startsWith('C'),
        D: (t: TicketInfo | InterlineInfo) => t.start_train_code.startsWith('D'),
        Z: (t: TicketInfo | InterlineInfo) => t.start_train_code.startsWith('Z'),
        T: (t: TicketInfo | InterlineInfo) => t.start_train_code.startsWith('T'),
        K: (t: TicketInfo | InterlineInfo) => t.start_train_code.startsWith('K'),
        O: (t: TicketInfo | InterlineInfo) => !/^[GDZTK]/.test(t.start_train_code),
        F: (t: TicketInfo | InterlineInfo) => 'dw_flag' in t ? t.dw_flag.includes('复兴号') : t.ticketList[0].dw_flag.includes('复兴号'),
        S: (t: TicketInfo | InterlineInfo) => 'dw_flag' in t ? t.dw_flag.includes('智能动车组') : t.ticketList[0].dw_flag.includes('智能动车组'),
    };

    const TIME_COMPARETOR = {
        startTime: (a: TicketInfo | InterlineInfo, b: TicketInfo | InterlineInfo) => new Date(`${a.start_date} ${a.start_time}`).getTime() - new Date(`${b.start_date} ${b.start_time}`).getTime(),
        arriveTime: (a: TicketInfo | InterlineInfo, b: TicketInfo | InterlineInfo) => new Date(`${a.arrive_date} ${a.arrive_time}`).getTime() - new Date(`${b.arrive_date} ${b.arrive_time}`).getTime(),
        duration: (a: TicketInfo | InterlineInfo, b: TicketInfo | InterlineInfo) => {
            const [hA, mA] = a.lishi.split(':').map(Number);
            const [hB, mB] = b.lishi.split(':').map(Number);
            return (hA * 60 + mA) - (hB * 60 + mB);
        },
    };

    function filterTicketsInfo<T extends TicketInfo | InterlineInfo>(ticketsInfo: T[], trainFilterFlags: string, sortFlag: string = '', sortReverse: boolean = false, limitedNum: number = 0): T[] {
        let result = trainFilterFlags ? ticketsInfo.filter(t => [...trainFilterFlags].some(flag => TRAIN_FILTERS[flag as keyof typeof TRAIN_FILTERS](t))) : ticketsInfo;
        if (Object.keys(TIME_COMPARETOR).includes(sortFlag)) {
            result.sort(TIME_COMPARETOR[sortFlag as keyof typeof TIME_COMPARETOR]);
            if (sortReverse) result.reverse();
        }
        return limitedNum > 0 ? result.slice(0, limitedNum) : result;
    }

    function parseRouteStationsInfo(routeStationsData: RouteStationData[]): RouteStationInfo[] {
        return routeStationsData.map((routeStationData, index) => ({
            arrive_time: index === 0 ? routeStationData.start_time : routeStationData.arrive_time,
            station_name: routeStationData.station_name,
            stopover_time: routeStationData.stopover_time,
            station_no: parseInt(routeStationData.station_no),
        }));
    }

    function parseInterlinesTicketInfo(interlineTicketsData: InterlineTicketData[]): TicketInfo[] {
        return interlineTicketsData.map(ticket => {
            const prices = extractPrices(ticket.yp_info, ticket.seat_discount_info, ticket);
            const startDate = parseDate(ticket.start_train_date);
            const [startHours, startMinutes] = ticket.start_time.split(':').map(Number);
            const [durationHours, durationMinutes] = ticket.lishi.split(':').map(Number);

            const arriveDate = new Date(startDate);
            arriveDate.setUTCHours(arriveDate.getUTCHours() + startHours + durationHours, arriveDate.getUTCMinutes() + startMinutes + durationMinutes);

            return {
                train_no: ticket.train_no,
                start_train_code: ticket.station_train_code,
                start_date: formatDate(startDate),
                arrive_date: formatDate(arriveDate),
                start_time: ticket.start_time,
                arrive_time: ticket.arrive_time,
                lishi: ticket.lishi,
                from_station: ticket.from_station_name,
                to_station: ticket.to_station_name,
                from_station_telecode: ticket.from_station_telecode,
                to_station_telecode: ticket.to_station_telecode,
                prices: prices,
                dw_flag: extractDWFlags(ticket.dw_flag),
            };
        });
    }

    function extractLishi(all_lishi: string): string {
        const match = all_lishi.match(/(?:(\d+)小时)?(\d+)分钟/);
        if (!match) return '00:00';
        const hours = (match[1] || '0').padStart(2, '0');
        const minutes = (match[2] || '0').padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function parseInterlinesInfo(interlineData: InterlineData[]): InterlineInfo[] {
        return interlineData.map(ticket => ({
            lishi: extractLishi(ticket.all_lishi),
            start_time: ticket.start_time,
            start_date: ticket.train_date,
            middle_date: ticket.middle_date,
            arrive_date: ticket.arrive_date,
            arrive_time: ticket.arrive_time,
            from_station_code: ticket.from_station_code,
            from_station_name: ticket.from_station_name,
            middle_station_code: ticket.middle_station_code,
            middle_station_name: ticket.middle_station_name,
            end_station_code: ticket.end_station_code,
            end_station_name: ticket.end_station_name,
            start_train_code: ticket.fullList[0].station_train_code,
            first_train_no: ticket.first_train_no,
            second_train_no: ticket.second_train_no,
            train_count: ticket.train_count,
            ticketList: parseInterlinesTicketInfo(ticket.fullList),
            same_station: ticket.same_station == '0',
            same_train: ticket.same_train == 'Y',
            wait_time: ticket.wait_time,
        }));
    }

    function formatInterlinesInfo(interlinesInfo: InterlineInfo[]): string {
        if (interlinesInfo.length === 0) return 'No matching transfer train information found';
        let result = 'Departure time -> Arrival time | Departure station -> Transfer station -> Arrival station | Transfer flag | Transfer wait time | Total duration\n\n';
        interlinesInfo.forEach((info) => {
            result += `${info.start_date} ${info.start_time} -> ${info.arrive_date} ${info.arrive_time} | `;
            result += `${info.from_station_name} -> ${info.middle_station_name} -> ${info.end_station_name} | `;
            result += `${info.same_train ? 'Same-train transfer' : info.same_station ? 'Same-station transfer' : 'Cross-station transfer'} | ${info.wait_time} | ${info.lishi}\n\n`;
            result += '\t' + formatTicketsInfo(info.ticketList).replace(/\n/g, '\n\t') + '\n';
        });
        return result;
    }

    function parseStationsData(rawData: string): Record<string, StationData> {
        const result: Record<string, StationData> = {};
        const dataArray = rawData.split('|');
        for (let i = 0; i < dataArray.length; i += 10) {
            const group = dataArray.slice(i, i + 10);
            if (group.length < 10) continue;
            let station: Partial<StationData> = {};
            StationDataKeys.forEach((key, index) => {
                station[key] = group[index];
            });
            if (station.station_code) {
                result[station.station_code!] = station as StationData;
            }
        }
        return result;
    }

    async function getStationsInternal(): Promise<Record<string, StationData>> {
        const stationNameJSUrl = "https://kyfw.12306.cn/otn/resources/js/framework/station_name.js";
        const stationNameJS = await make12306RequestHtml(stationNameJSUrl);
        if (!stationNameJS) throw new Error('Error: get station name js file content failed.');

        const rawDataMatch = stationNameJS.match(/var station_names\s*=\s*'(.*?)';/);
        if (!rawDataMatch) throw new Error('Error: could not find station data in JS file.');

        const rawData = rawDataMatch[1];
        const stationsData = parseStationsData(rawData);

        for (const station of MISSING_STATIONS) {
            if (!stationsData[station.station_code]) {
                stationsData[station.station_code] = station;
            }
        }
        return stationsData;
    }

    async function getLCQueryPath(): Promise<string> {
        const html = await make12306RequestHtml(LCQUERY_INIT_URL);
        if (html == undefined) throw new Error('Error: get 12306 web page for LCQuery path failed.');
        const match = html.match(/var lc_search_url = '(.+?)'/);
        if (match == undefined) throw new Error('Error: get LCQuery path failed.');
        return match[1];
    }

    async function init() {
        if (initPromise) return initPromise;
        initPromise = (async () => {
            if (STATIONS) return;
            try {
                STATIONS = await getStationsInternal();
                LCQUERY_PATH = await getLCQueryPath();

                CITY_STATIONS = {};
                for (const station of Object.values(STATIONS)) {
                    const city = station.city;
                    if (!CITY_STATIONS[city]) CITY_STATIONS[city] = [];
                    CITY_STATIONS[city].push({ station_code: station.station_code, station_name: station.station_name });
                }

                CITY_CODES = {};
                for (const [city, stations] of Object.entries(CITY_STATIONS)) {
                    for (const station of stations) {
                        if (station.station_name == city) {
                            CITY_CODES[city] = station;
                            break;
                        }
                    }
                }

                NAME_STATIONS = {};
                for (const station of Object.values(STATIONS)) {
                    NAME_STATIONS[station.station_name] = { station_code: station.station_code, station_name: station.station_name };
                }
            } catch (e) {
                initPromise = undefined; // Reset promise on failure to allow retry
                throw e;
            }
        })();
        return initPromise;
    }
    // #endregion

    // #region Tool function implementations
    async function get_current_date(params: {}) {
        const now = getCurrentShanghaiDate();
        return formatDate(now);
    }

    async function get_stations_code_in_city(params: { city: string }) {
        await init();
        if (!(params.city in CITY_STATIONS!)) {
            throw new Error('City not found.');
        }
        return CITY_STATIONS![params.city];
    }

    async function get_station_code_of_citys(params: { citys: string }) {
        await init();
        let result: Record<string, object> = {};
        for (const city of params.citys.split('|')) {
            if (!(city in CITY_CODES!)) {
                result[city] = { error: 'City not found.' };
            } else {
                result[city] = CITY_CODES![city];
            }
        }
        return result;
    }

    async function get_station_code_by_names(params: { station_names: string }) {
        await init();
        let result: Record<string, object> = {};
        for (let stationName of params.station_names.split('|')) {
            stationName = stationName.endsWith('站') ? stationName.slice(0, -1) : stationName;
            if (!(stationName in NAME_STATIONS!)) {
                result[stationName] = { error: 'Station not found.' };
            } else {
                result[stationName] = NAME_STATIONS![stationName];
            }
        }
        return result;
    }

    async function get_station_by_telecode(params: { station_telecode: string }) {
        await init();
        if (!STATIONS![params.station_telecode]) {
            throw new Error('Station not found.');
        }
        return STATIONS![params.station_telecode];
    }

    async function get_tickets(params: { date: string, from_station: string, to_station: string, train_filter_flags?: string, sort_flag?: string, sort_reverse?: boolean, limited_num?: number }) {
        await init();
        if (!checkDate(params.date)) throw new Error('The date cannot be earlier than today.');
        if (!STATIONS![params.from_station] || !STATIONS![params.to_station]) throw new Error('Station not found.');

        const queryParams = {
            'leftTicketDTO.train_date': params.date,
            'leftTicketDTO.from_station': params.from_station,
            'leftTicketDTO.to_station': params.to_station,
            'purpose_codes': 'ADULT',
        };
        const queryUrl = `${API_BASE}/otn/leftTicket/query`;
        const cookies = await getCookie();
        if (!cookies) throw new Error('Get cookie failed. Check your network.');

        const response = await make12306Request<any>(queryUrl, queryParams, { Cookie: formatCookies(cookies) });
        if (!response || !response.data || !response.data.result) throw new Error('Get tickets data failed.');

        const ticketsData = parseTicketsData(response.data.result);
        const ticketsInfo = parseTicketsInfo(ticketsData, response.data.map);
        const filteredTicketsInfo = filterTicketsInfo(ticketsInfo, params.train_filter_flags || '', params.sort_flag, params.sort_reverse, params.limited_num);

        return formatTicketsInfo(filteredTicketsInfo);
    }

    async function get_interline_tickets(params: { date: string, from_station: string, to_station: string, middle_station?: string, show_wz?: boolean, train_filter_flags?: string, sort_flag?: string, sort_reverse?: boolean, limited_num?: number }) {
        await init();
        if (!checkDate(params.date)) throw new Error('The date cannot be earlier than today.');
        if (!STATIONS![params.from_station] || !STATIONS![params.to_station]) throw new Error('Station not found.');

        const cookies = await getCookie();
        if (!cookies) throw new Error('Get cookie failed. Check your network.');

        const limited_num = params.limited_num || 10;
        let interlineData: InterlineData[] = [];
        const queryParams = {
            'train_date': params.date,
            'from_station_telecode': params.from_station,
            'to_station_telecode': params.to_station,
            'middle_station': params.middle_station || '',
            'result_index': '0',
            'can_query': 'Y',
            'isShowWZ': params.show_wz ? 'Y' : 'N',
            'purpose_codes': '00',
            'channel': 'E',
        };

        while (interlineData.length < limited_num) {
            const response = await make12306Request<any>(`${API_BASE}${LCQUERY_PATH}`, queryParams, { Cookie: formatCookies(cookies) });
            if (!response) throw new Error('Request interline tickets data failed.');
            if (typeof response.data === 'string') return `Sorry, no matching train tickets were found. (${response.errorMsg})`;

            interlineData.push(...response.data.middleList);
            if (response.data.can_query === 'N' || !response.data.middleList || response.data.middleList.length === 0) break;
            queryParams.result_index = response.data.result_index.toString();
        }

        const interlineTicketsInfo = parseInterlinesInfo(interlineData);
        const filtered = filterTicketsInfo(interlineTicketsInfo, params.train_filter_flags || '', params.sort_flag, params.sort_reverse, limited_num);

        return formatInterlinesInfo(filtered);
    }

    async function get_train_route_stations(params: { train_no: string, from_station_telecode: string, to_station_telecode: string, depart_date: string }) {
        await init();
        const queryParams = {
            'train_no': params.train_no,
            'from_station_telecode': params.from_station_telecode,
            'to_station_telecode': params.to_station_telecode,
            'depart_date': params.depart_date,
        };
        const queryUrl = `${API_BASE}/otn/czxx/queryByTrainNo`;
        const cookies = await getCookie();
        if (!cookies) throw new Error('Get cookie failed.');

        const response = await make12306Request<any>(queryUrl, queryParams, { Cookie: formatCookies(cookies) });
        if (!response || !response.data || !response.data.data) throw new Error('Get train route stations failed.');

        const routeStationsInfo = parseRouteStationsInfo(response.data.data);
        if (routeStationsInfo.length === 0) return 'No matching train information found.';

        return routeStationsInfo;
    }
    // #endregion

    async function wrap<T>(func: (params: any) => Promise<any>, params: any, successMessage: string, failMessage: string) {
        try {
            const result = await func(params);
            complete({ success: true, message: successMessage, data: result });
        } catch (error: any) {
            console.error(`Function ${func.name} failed! Error: ${error.message}`);
            complete({ success: false, message: `${failMessage}: ${error.message}`, error_stack: error.stack });
        }
    }

    async function main() {
        console.log("--- Starting 12306 toolkit tests ---");

        try {
            await init();

            console.log("\n[1/8] Testing get_current_date...");
            const dateResult = await get_current_date({});
            console.log("Test result:", JSON.stringify(dateResult, undefined, 2));
            const testDate = dateResult as string;

            console.log("\n[2/8] Testing get_stations_code_in_city (Beijing)...");
            const cityStations = await get_stations_code_in_city({ city: '北京' });
            console.log("Test result:", JSON.stringify(cityStations, undefined, 2));

            console.log("\n[3/8] Testing get_station_code_of_citys (Beijing|Shanghai)...");
            const cityCodesResult = await get_station_code_of_citys({ citys: '北京|上海' });
            console.log("Test result:", JSON.stringify(cityCodesResult, undefined, 2));
            const beijingCode = (cityCodesResult as any)['北京'].station_code;
            const shanghaiCode = (cityCodesResult as any)['上海'].station_code;

            console.log("\n[4/8] Testing get_station_code_by_names (Beijing South|Shanghai Hongqiao)...");
            const stationCodesResult = await get_station_code_by_names({ station_names: '北京南|上海虹桥' });
            console.log("Test result:", JSON.stringify(stationCodesResult, undefined, 2));
            const beijingnanCode = (stationCodesResult as any)['北京南'].station_code;
            const shanghaihongqiaoCode = (stationCodesResult as any)['上海虹桥'].station_code;

            console.log("\n[5/8] Testing get_station_by_telecode (VNP)...");
            const stationInfo = await get_station_by_telecode({ station_telecode: 'VNP' }); // VNP is Beijing
            console.log("Test result:", JSON.stringify(stationInfo, undefined, 2));

            console.log(`\n[6/8] Testing get_tickets (${testDate}, from: Beijing South, to: Shanghai Hongqiao)...`);
            const tickets = await get_tickets({
                date: testDate,
                from_station: beijingnanCode,
                to_station: shanghaihongqiaoCode,
                train_filter_flags: 'G'
            });
            console.log("Test result (partial):", (tickets as string).substring(0, 400) + "...");

            console.log(`\n[7/8] Testing get_interline_tickets (${testDate}, from: Beijing, to: Shanghai)...`);
            const interlineTickets = await get_interline_tickets({
                date: testDate,
                from_station: beijingCode,
                to_station: shanghaiCode,
                limited_num: 2
            });
            console.log("Test result (partial):", (interlineTickets as string).substring(0, 400) + "...");

            console.log(`\n[8/8] Testing get_train_route_stations...`);
            const ticketsResultForRoute = await get_tickets({ date: testDate, from_station: beijingnanCode, to_station: shanghaihongqiaoCode });
            const trainNoMatch = (ticketsResultForRoute as string).match(/train_no: (\w+)/);
            if (trainNoMatch && trainNoMatch[1]) {
                const trainNo = trainNoMatch[1];
                console.log(`Testing with train ${trainNo}...`);
                const routeStations = await get_train_route_stations({
                    train_no: trainNo,
                    from_station_telecode: beijingnanCode,
                    to_station_telecode: shanghaihongqiaoCode,
                    depart_date: testDate
                });
                console.log("Test result:", JSON.stringify(routeStations, undefined, 2));
            } else {
                console.log("No usable train was found in the get_tickets results to test get_train_route_stations.");
            }

        } catch (e: any) {
            console.error("Error in the test main function:", e.message, e.stack);
            complete({ success: false, message: `Test failed: ${e.message}` });
            return;
        }

        console.log("\n--- 12306 toolkit tests completed ---");
        complete({ success: true, message: "All tests completed successfully or errors were recorded." });
    }

    return {
        get_current_date: (p: any) => wrap(get_current_date, p, 'Current date retrieved successfully', 'Failed to get current date'),
        get_stations_code_in_city: (p: any) => wrap(get_stations_code_in_city, p, 'Query succeeded', 'Query failed'),
        get_station_code_of_citys: (p: any) => wrap(get_station_code_of_citys, p, 'Query succeeded', 'Query failed'),
        get_station_code_by_names: (p: any) => wrap(get_station_code_by_names, p, 'Query succeeded', 'Query failed'),
        get_station_by_telecode: (p: any) => wrap(get_station_by_telecode, p, 'Query succeeded', 'Query failed'),
        get_tickets: (p: any) => wrap(get_tickets, p, 'Ticket query succeeded', 'Ticket query failed'),
        get_interline_tickets: (p: any) => wrap(get_interline_tickets, p, 'Transfer ticket query succeeded', 'Transfer ticket query failed'),
        get_train_route_stations: (p: any) => wrap(get_train_route_stations, p, 'Stop-station query succeeded', 'Stop-station query failed'),
        main: main,
    };
})();

exports.get_current_date = ticket12306.get_current_date;
exports.get_stations_code_in_city = ticket12306.get_stations_code_in_city;
exports.get_station_code_of_citys = ticket12306.get_station_code_of_citys;
exports.get_station_code_by_names = ticket12306.get_station_code_by_names;
exports.get_station_by_telecode = ticket12306.get_station_by_telecode;
exports.get_tickets = ticket12306.get_tickets;
exports.get_interline_tickets = ticket12306.get_interline_tickets;
exports.get_train_route_stations = ticket12306.get_train_route_stations;
exports.main = ticket12306.main; 