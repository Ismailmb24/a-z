import {checkWord } from "the-orangee-dictionary";

//make and remove class of selected element
const makeSingleClass = (el, remove, add) => {
    el.classList.remove(remove);
    el.classList.add(add);
};
//make and remove class of selected list elements
const makeClass = (item, list, removeClass, addClass) => {
    for(let i = 0; i < list.length; i++) {
        list[i].classList.remove(removeClass); 
    }
    if(item) item.classList.add(addClass);  
}
//function that can set event of list elements
const setListEvent = (event, func, list) => {
    for(let i = 0; i < list.length; i++) {
        list[i].addEventListener(event, (e) => {
            func(e);
        }, false);
    }
}
//function that set multiple event to one element using one function
const setMultipleEvents = (el, event1, event2, func) => {
    el.addEventListener(event1, e => {
        func(e);
    }, false);
    el.addEventListener(event2, e => {
        func(e);
    }, false);
}

//first block
(function IIFE(){
    //inputer section nodes
    const textareaField = document.getElementById("textarea-field");
    const pasteWraper = document.getElementById("paste-wraper");
    const paste = document.getElementById("paste");
    const permPaste = document.getElementById("perm-paste");
    const submit = document.getElementById("submit");
    
    //disable submit botton by default    
    submit.disabled = true;
    submit.className = "disabled";

    //remove paste button from top of textarea
    function blancePaste () {
        makeSingleClass(pasteWraper, "active", "inactive");
        makeSingleClass(permPaste, "inactive", "active");
    }
    //paste text from clip board
    async function pasteText() {
        try {
            let clipedText = await navigator.clipboard.readText();
            textareaField.value = clipedText;
            textareaField.focus();
            varifySubmit();
        } catch(err) {
            console.log(err);
        }
    }
    //check wether form is ready to submit
    function varifySubmit() {
        let ready_to_submit = 
        textareaField.value.length && textareaField.value.match(/ /g);
        if(ready_to_submit) {
            submit.disabled = false;
            submit.className = "able"; 
        } else {
            submit.disabled = true;
            submit.className = "disabled";
        }
    };

    window.addEventListener("load", e => {
        textareaField.value = ""; //clear textarea field when ever page load
    }, false);

    textareaField.addEventListener("focus", e => {
        blancePaste();
    }, false);
    setMultipleEvents(textareaField, "input", "paste", varifySubmit);
    paste.addEventListener("click", e => {
        pasteText();
        blancePaste();
    }, false);
    permPaste.addEventListener("click", e => {
        pasteText();
    }, false);
    permPaste.addEventListener("dblclick", e => {
        document.getElementById("popup-text").classList.toggle("show");
        setTimeout(() => {
            document.getElementById("popup-text").classList.toggle("show");
        }, 3000);
    }, false);
    
    //first block child
    (function IIFE(){
        const form = document.getElementById("input-form");
        const updateNode = (el, val) => {
            el.innerHTML = val;
        };
        function varifyWords(text) {
            const isName = word => {
                const UpperAlpha = ["A", "B", "C", "D", "E", "F", "G", "H",
                 "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
                  "U", "V", "W", "X", "Y", "Z"];
                  for(let alp of UpperAlpha) {
                    if(word[0] === alp) {
                        return true;
                    }
                  }
            };
            const removeSpecilChar = word => {
                const specialChars =[",", ".", ";", ":", "!", "?"]; 
                const lastChar = word.length - 1; //<--- last word character
                for(let specialChar of specialChars) {
                    if(word[lastChar] === specialChar) {
                        return word.substr(0, lastChar);
                    } else if(word.includes("'")) {
                        const quoteIndex = word.indexOf("'");
                        return word.substr(0, quoteIndex);
                    }
                } 
                return word;
            };
            const typoWords = [];
            const paragraphs = text.split(".\n");
            paragraphs.forEach(paragraph => {
                const words = paragraph.split(" ");
                const Words_without_name = words.filter(word => !isName(word));//<--- filter name from the typo words list
                const typos = Words_without_name.filter( word => {
                    let word_without_specialCar = removeSpecilChar(word);
                    return !checkWord(word_without_specialCar, "en-US"); //<-- contion on either the word exist in Englis lang
                });//<--- filter any miningfull word and leave the words with typo error
                typos.forEach(typo => {
                    if((typo !== " ") && (typo !== "a") && (typo !== "")) {
                        typoWords.push(typo);
                        console.log(typo);
                    }
                });
            });
            return typoWords;  
        }
        function analyze (e) {
            e.preventDefault();

            const chrts_node = document.getElementById("characters-val");
            const chrt_with_space_node = document.getElementById("chrts-with-space-val");
            const words_node = document.getElementById("words-val");
            const paragraphs_node = document.getElementById("paragraphs-val");
            const content_prgh_node = document.getElementById("content-val");
            const typo_errors_node = document.getElementById("typo-errors-val");
            const typo_length_node = document.getElementById("typo-length");

            const analysis_node = document.getElementById("analysis-wraper");
            const analysis_offset = analysis_node.offsetTop;
            const header_height = document.getElementById("header").offsetHeight;
            window.scrollTo(0, analysis_offset - (header_height + 20));
            
            const inputedText = textareaField.value;
            let content,
            characters,
            chrts_with_space,
            filteredWords,
            wordsAmount,
            paragraphs,
            paragraphsAmount;
            const typoErrors = varifyWords(inputedText);
            const typoLength = typoErrors.length;

            content = "";
            characters = inputedText.length - inputedText.match(/ /g).length;
            chrts_with_space = inputedText.length;
            filteredWords = inputedText.split(" ").filter((word) => word !== (" " && ""));
            wordsAmount = filteredWords.length;
            paragraphs = inputedText.split(".\n");
            paragraphsAmount = paragraphs.length;
            paragraphs.forEach(parag => {
                let paragwords = parag.split(" ");
                let result = "";
                paragwords.forEach(word => {
                    result += ` <span class="words">${word}</span>`;
                });
                content += `<p class="parag">${result}</p>`;
            });
            
            let typoErrors_list_items = "";
            typoErrors.forEach(typoError => {
                const typoErrors_list_item = `<li class="typo-list-items">${typoError}</li>`;
                typoErrors_list_items += typoErrors_list_item;
            });
            const typoErrors_list = `<ul id="typo-list">${typoErrors_list_items}</ul>`;

            updateNode(chrts_node, characters);
            updateNode(chrt_with_space_node, chrts_with_space);
            updateNode(words_node, wordsAmount);
            updateNode(paragraphs_node, paragraphsAmount);
            updateNode(content_prgh_node, content);
            updateNode(typo_errors_node, typoErrors_list);
            updateNode(typo_length_node, typoLength);
        }

        form.addEventListener("submit", (e) => {
            analyze(e);
        }, false);   
    })();
})();

//second block
(function IIFE(){
    //tab section nodes
    const tab_ctrls = document.getElementsByClassName("tab-control");
    const tab_cnts = document.getElementsByClassName("tab-content");
    function activateTab(e) {
        e.preventDefault();
        let target = e.target;
        const tgt_cnt_id = target.getAttribute("data-tab-cnt");
        const tgt_cnt_node = document.getElementById(tgt_cnt_id);

        makeClass(target, tab_ctrls, "active", "active");
        makeClass(tgt_cnt_node, tab_cnts, "active", "active");
    }

    setListEvent("click", activateTab, tab_ctrls);
})();