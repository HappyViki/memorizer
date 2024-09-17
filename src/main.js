import { 
    diffStringPlainText,
    phraseSimilarity
} from "./utils.js";

let text = localStorage.getItem("text") || "";
let sliceAmount = localStorage.getItem("sliceAmount") || "0";
let lines;
let linesObject = {};


initialText.value = text;
initialText.addEventListener("input", () => {
    localStorage.setItem("text", initialText.value);
})

memorizeBtn.addEventListener("click", () => {    
    let id;
    lines = initialText.value.split('\n').filter(line=>line);
    formattedText.innerHTML = lines.map(
        (line, i) => {
            id = "line" + i;
            linesObject[id] = {
                isFullShowing: false,
                fullShownCount: 0,
                full: line,
                partial: line.slice(0, sliceAmount) || "&#8203;", /* else: zero-width space */
                toggleText() {
                    const result = this.isFullShowing ? this.partial : this.full;
                    this.isFullShowing = !this.isFullShowing;
                    if (this.isFullShowing) this.fullShownCount++;

                    return result;
                }
            };

            const input = `<div class="input-group mb-3"><input type="text" class="form-control finished-line" placeholder="Write your line..." aria-label="user line" aria-describedby="basic-addon1"></div>`;

            return `<button id="${id}" class="btn btn-outline-dark btn-block line" type="button">${linesObject[id].partial}</button>` + input;
        }
    ).join('');

    document.querySelectorAll(".line").forEach(
        line => {
            line.addEventListener("click", e => {
                e.target.innerHTML = linesObject[e.target.id].toggleText();
                
            });            
        }
    )
})

evaluateBtn.addEventListener("click", () => {
    const finishedLines = [...document.querySelectorAll(".finished-line")].map(
        line => line.value
    );    

    evaluatedText.innerHTML = lines.map(
        (line, i) => {
            const diffPercent = phraseSimilarity(finishedLines[i], line);
            let obj = linesObject["line" + i];
            let evaluatedLineColor;

            if ((obj.fullShownCount === 0) && (diffPercent > 95)) {
                evaluatedLineColor = "good";
            } else if ((obj.fullShownCount <= 2) && (diffPercent > 75)) {
                evaluatedLineColor = "okay";
            } else {
                evaluatedLineColor = "bad";
            }

            return `<p class="${evaluatedLineColor}">Right: ${diffPercent}% <br>Peeks: ${obj.fullShownCount}<br>${diffStringPlainText(finishedLines[i], line)}</p>`;
        }
    ).join('');
})