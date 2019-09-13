import papaparse from 'papaparse';

export interface ParsedData {
    headers: string[];
    data: string[][];
}

export function parseNumber(value: string, locale = navigator.language): number | null {
    if (!value) return null;
    const example = Intl.NumberFormat(locale).format(1.1);
    const cleanPattern = new RegExp(`[^-+0-9${example.charAt(1)}]`, 'g');
    const cleaned = value.replace(cleanPattern, '');
    const normalized = cleaned.replace(example.charAt(1), '.');

    return parseFloat(normalized);
}

/**
function parseDnbKreditt(data: string[][]): YnabLine[] {
    const out: YnabLine[] = [];
    data.forEach((l): void => {
        //TODO Detect first line
        const d: Moment.Moment = Moment(l[0], 'DD.MM.YYYY');
        const date: string = d.format('YYYY-MM-DD');
        const payee = '';
        const memo: string = l[2];
        const inflow = l[5] ? parseNumber(l[5]) : null;
        const outflow = l[6] ? parseNumber(l[6]) : null;
        const line: YnabLine = { date, payee, memo, inflow, outflow };
        out.push(line);
    });
    // console.log(out);

    return out;
}

 */

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

    return parsed;
};

export default parse;
