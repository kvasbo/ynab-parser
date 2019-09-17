import papaparse from 'papaparse';

export interface ParsedData {
    headers: string[];
    data: string[][];
    likelyDateColumn?: number;
    likelyMemoColumn?: number;
    likeLyInflowColumn?: number;
    likeLyOutflowColumn?: number;
}

export function parseNumber(strgx: string): number {
    let strg = strgx || '';
    let decimal = '.';
    strg = strg.replace(/[^0-9$-.,]/g, '');
    if (strg.indexOf(',') > strg.indexOf('.')) decimal = ',';
    if ((strg.match(new RegExp('\\' + decimal, 'g')) || []).length > 1) decimal = '';
    if (decimal !== '' && strg.length - strg.indexOf(decimal) - 1 === 3 && strg.indexOf('0' + decimal) !== 0)
        decimal = '';
    strg = strg.replace(new RegExp('[^0-9-$' + decimal + ']', 'g'), '');
    strg = strg.replace(',', '.');
    return parseFloat(strg);
}

interface ColumnMetaData {
    [s: number]: {
        maxLength: number;
        minLength: number;
        allNumbers: boolean;
        someDates: boolean;
        allDates: boolean;
        dataSetLength: number;
        numbersCount: number;
        probablyDate: number;
        probablyMemo: number;
        probablyInflow: number;
        probablyOutflow: number;
    };
}

function findFieldTypes(data: string[][]): ColumnMetaData {
    const results: ColumnMetaData = [];
    for (let i = 0; i < data.length; i++) {
        results[i] = {
            maxLength: 0,
            minLength: 999,
            allNumbers: true,
            someDates: false,
            allDates: true,
            numbersCount: 0,
            dataSetLength: 0,
            // The main event!
            probablyDate: 0,
            probablyMemo: 0,
            probablyInflow: 0,
            probablyOutflow: 0,
        };

        data[i].forEach(d => {
            results[i].dataSetLength += 1; // Increment counter
            if (d.length > results[i].maxLength) results[i].maxLength = d.length; // max length
            if (d.length < results[i].minLength) results[i].minLength = d.length; // min length
            // check if number
            if (d.length > 12) {
                results[i].allNumbers = false;
            } // Too long, we don't support billions
            // Do date parsing
            if (d.length < 12 && d.length > 0) {
                const n = parseNumber(d);
                if (isNaN(n)) results[i].allNumbers = false;
                else {
                    results[i].numbersCount += 1;
                }
            }
        });
        // ANALYSIS HERE
        // Significant variance in length
        if (results[i].maxLength === results[i].minLength) {
            results[i].probablyInflow += -100;
            results[i].probablyOutflow += -100;
            results[i].probablyMemo += -100;
            results[i].probablyDate += 10;
        }
        if (results[i].maxLength - results[i].minLength > 4) {
            results[i].allDates = false;
            results[i].probablyDate += -1;
            results[i].probablyMemo += 1;
        } else {
            results[i].probablyDate += 1;
        }
        // Even more significant variance in length
        if (results[i].maxLength - results[i].minLength > 8) {
            const lengthFactor = Math.max(0, results[i].maxLength - results[i].minLength - 5);
            results[i].probablyInflow += -lengthFactor;
            results[i].probablyOutflow += -lengthFactor;
            results[i].probablyMemo += lengthFactor;
            results[i].probablyDate += -lengthFactor;
        }
        if (results[i].allNumbers) {
            results[i].probablyInflow += 2;
            results[i].probablyOutflow += 2;
            results[i].probablyMemo += -5;
        }
        if (results[i].minLength === 0) {
            results[i].probablyInflow += 2;
            results[i].probablyOutflow += 2;
            results[i].probablyMemo += -2;
            results[i].probablyDate += -2;
        }
        // More than half the lines are sums, probably outflow
        if (results[i].allNumbers && results[i].numbersCount > results[i].dataSetLength / 2) {
            results[i].probablyOutflow += 5;
            results[i].probablyMemo += -5;
        }
        // More than 66% the lines are sums, probably outflow
        if (results[i].allNumbers && results[i].numbersCount > results[i].dataSetLength / 1.5) {
            results[i].probablyOutflow += 5;
            results[i].probablyMemo += -5;
        }
        // Just a few, probably inflow!
        if (results[i].allNumbers && results[i].numbersCount < results[i].dataSetLength / 2) {
            results[i].probablyInflow += 5;
            results[i].probablyMemo += -5;
        }
    }
    return results;
}

/**
 * Try to infer data types
 * @param data
 * @param ignoreN Skip N rows from start
 */
function findFields(data: ParsedData['data'], ignoreN = 1): ColumnMetaData | void {
    // Get length
    const length = data.length;
    if (length < ignoreN + 1) return;
    const width = data[ignoreN].length;
    const vrengt: string[][] = [];
    // Invert array axes
    for (let i = ignoreN; i < length; i++) {
        for (let j = 0; j < width; j++) {
            if (!vrengt[j]) vrengt[j] = []; // Init array
            vrengt[j].push(data[i][j]);
        }
    }
    return findFieldTypes(vrengt);
}

const parse = (data: string): ParsedData => {
    // Parse dnb kredittkort
    const parsed: ParsedData = { headers: [], data: [] };
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const d = papaparse.parse(data, { dynamicTyping: false, transform: val => val.trim() });

    if (!d.data || d.data.length < 2) return parsed;

    // Get first element
    const headers = d.data.shift();

    parsed.headers = headers;

    // Clean up
    parsed.data = d.data.filter((f): boolean => {
        if (f.length !== headers.length) return false;
        return true;
    });

    const analysedData = findFields(parsed.data);
    if (!analysedData) return parsed;

    return parsed;
};

export default parse;
