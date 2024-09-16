import { 
    diffStringPlainText,
    phraseSimilarity
} from "./utils";

let text = localStorage.getItem("text") || "";
let lines;
let linesObject = {};
let sliceAmount = 10;

initialText.value = text;
initialText.addEventListener("input", () => {
    localStorage.setItem("text", initialText.value);
})

memorizeBtn.addEventListener("click", () => {    
    let id;
    lines = initialText.value.split('\n');
    formattedText.innerHTML = lines.map(
        (line, i) => {
            id = "line" + i;
            linesObject[id] = {
                isFullShowing: false,
                fullShownCount: 0,
                full: line,
                partial: line.slice(0, sliceAmount), 
                toggleText() {
                    const result = this.isFullShowing ? this.partial : this.full;
                    this.isFullShowing = !this.isFullShowing;
                    if (this.isFullShowing) this.fullShownCount++;

                    return result;
                }
            };

            const input = `<div class="input-group mb-3"><input type="text" class="form-control finished-line" placeholder="Finish your line..." aria-label="user line" aria-describedby="basic-addon1"></div>`;

            return `<button id="${id}" class="btn btn-outline-dark btn-block line" type="button">${linesObject[id].partial}</button>` + input;
        }
    ).join('');

    document.querySelectorAll(".line").forEach(
        line => {
            line.addEventListener("click", e => {
                e.target.innerText = linesObject[e.target.id].toggleText();
                
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
            let obj = linesObject["line" + i];

            let evaluatedLineColor;

            if (obj.fullShownCount === 0) {
                evaluatedLineColor = "good";
            } else if (obj.fullShownCount <= 2) {
                evaluatedLineColor = "okay";
            } else {
                evaluatedLineColor = "bad";
            }

            diffStringPlainText(line, finishedLines[i])

            return `<p class="${evaluatedLineColor}">Right: ${phraseSimilarity(line, finishedLines[i])}% <br>Peeks: ${obj.fullShownCount}<br>${diffStringPlainText(line, finishedLines[i])}</p>`;
        }
    ).join('');
})