const button_darkmode = document.getElementById("button_darkmode")
button_darkmode.addEventListener("click", button_onclick)

var darkmode = false;

let darkmode_cookie = getCookie("darkmode");

if (darkmode_cookie == "true") {
    darkmode = true
    button_onclick()
} else {
    darkmode = false
    button_onclick()
}

function getCookie(name) {
  // Erstellt einen regulären Ausdruck, um nach 'name=wert' zu suchen
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  // Wenn der Cookie gefunden wurde, den Wert zurückgeben
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function button_onclick() {
    if (darkmode == true) {
        document.body.classList.add("darkmode")
        document.cookie = "darkmode=true; path=/"
        darkmode = false
    } else {
        document.body.classList.remove("darkmode")
        document.cookie = "darkmode=false; path=/"
        darkmode = true;
        
    }
}

