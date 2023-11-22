import { fraction } from "mathjs";
 export default function convertTofraction(num){
    if (num == null) return '';
    if (typeof num === 'number' &&
        !num.toString().includes('.')) return num
    let realNum = Math.floor(num)
    let fractionValue = fraction(Math.round((+num % 1) * 1000) / 1000)
    let output = `${realNum == 0 ? '' : realNum} ${fractionValue.n}/${fractionValue.d}`
    return output
}