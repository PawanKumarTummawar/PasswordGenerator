const passwordDisplay = document.querySelector("[data-passwordDisplay]");    
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const inputSlider = document.querySelector("[data-lengthSlider]");//slider
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator =  document.querySelector("[data-indicator]");
const generateBtn =  document.querySelector(".generateButton");  
const allCheckBox = document.querySelectorAll("input[type=checkbox");   
const symbols = '~`!@#$%^&*()_+-=[{}]\|:";?/,.<>';

//initial values
let password ="";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

//set strength circle default color to Grey
setIndicator("#ccc");//indicator ka starting color to grey set krdia

//set password length
function handleSlider() {     //handle slider ka kam bus itna hai ki yeh UI pr changes darshata hai, using passwordLength ki value
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //aur kuch krna chaiye ya nhi krnna chaiye
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow --------------------> H.W.
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123)); //ASCII value bhej di and then return mai no. hi aya toh convert that no. to character
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91)); //ASCII value bhej di and then return mai no. hi aya toh convert that no. to character
}

function generateSymbol(){
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower  && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent() {   //async function promise return krta hai , we can use await with the help of async function 
    try{
        await navigator.clipboard.writeText(passwordDisplay.value); //await function k madad se apan tab tak code pause kr skte hai jab tak apna promise resolve nhi ho jata
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";  //agar koi error hua toh error ko handle krne k liye
    }

    //to make copy walla span visible
    copyMsg.classList.add("active");   //classList mai add krdie to make that copy span active

    setTimeout( () =>{                 //setTimeout k madad se time set kr rhe hai
        copyMsg.classList.remove("active");   
    }, 2000);                          //2 secs baad classList ko active se remove krdo, jisse vo hat jaega span 2 sec baad
}

function shufflePassword(array) {
    //Fisher Yated method ---> algo available for shuffling the array elements
    for(let i = array.length - 1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
        checkCount++;
    });

    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;   // passwordLength agar checked checkBoxes se kum rhe toh jitne checkBoxes checked hai uske equal krdo passwordLength ko
        handleSlider();   // jab bhi passwordLength mai changes krte hai tab hum UI mai changes display krne k liye handleSlider ko call krte hai
    }
}



allCheckBox.forEach((checkbox) => {    //sab checkboxes mai, har ek checkBox k liye eventListner add krdo
    checkbox.addEventListener('change', handleCheckBoxChange);  //agar koi changes hue to handleCheckBoxChange function ko call krdo
})

inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();
})


copyBtn.addEventListener('click', () =>{
    if(passwordDisplay.value)
    copyContent();
})


generateBtn.addEventListener('click', () => {
    //none of the checkboxes are checked
    if(checkCount == 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //let's start the journey to find new password

    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheckcaseCheck.checked){
    //     password += generatelowerCase();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }

    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }

    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }

    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    //compulsory addition 
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    //remaining addition
    for(let i=0; i<passwordLength-funcArr.length;i++){
        let randomIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randomIndex]();
    }

    //shuffle password
    password = shufflePassword(Array.from(password));  //password ko shuffle krenge na (no need to send password because it is a global variable)

    //show it in UI
    passwordDisplay.value = password;

    //calculate strength
    calcStrength();
  
});
