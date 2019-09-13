import Moment from 'moment';
import papaparse from 'papaparse';
import { YnabLine } from '../App';

const parse = (data: string): YnabLine[] => {
    // Parse dnb kredittkort
    const d = papaparse.parse(data, { dynamicTyping: false, transform: val => val.trim() });
    const parsed = parseDnbKreditt(d.data);
    console.log(d);
    console.log(parsed);
    return parsed;
};

function parseNumber(value: string, locale = navigator.language) {
    const example = Intl.NumberFormat(locale).format(1.1);
    const cleanPattern = new RegExp(`[^-+0-9${example.charAt(1)}]`, 'g');
    const cleaned = value.replace(cleanPattern, '');
    const normalized = cleaned.replace(example.charAt(1), '.');

    return parseFloat(normalized);
}

/*
function parseNumber(d: string): number | null {
  if (!d) return null;
  const regex = /[^\d.,\-eE+]/g
  const p = d.replace(regex, "");
  const n = Number(p);
  return n;
}*/

function parseDnbKreditt(data: string[][]): YnabLine[] {
    const out: YnabLine[] = [];
    data.forEach((l, i) => {
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

export default parse;
