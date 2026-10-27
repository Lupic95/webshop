const input = document.getElementById("inputSuche")
input.addEventListener("input", fetchSearchData)
const searchResultsContainer = document.getElementById("searchResults")

async function redirectSearchResult(ev) {
    window.location.href = "/suche/artikel?key=" + ev.srcElement.getAttribute("artikelnummer")
    //await fetch("http://localhost:3000/suche/artikel?key=" + ev.srcElement.getAttribute("artikelnummer"))
    //.then(response => response.json())
    //.then(data => console.log(data))
    //.catch(error => error)
    
}

async function fetchSearchData() {
    await fetch("http://localhost:3000/suche?key=" + input.value)
    .then(response => response.json())
    .then(data => renderSearchResult(data))
    .catch(error => error)
    
}

function renderSearchResult(data) {
    console.log(data)
    clearDom()
    if (data.length > 1) {
        searchResultsContainer.style.display = "block"
        for (var i = 0; i < data.length; i++) {
            const container = document.createElement("div")
            container.classList.add("searchResultContainer")
            container.setAttribute("artikelnummer", data[i].artikel_nummer)
            container.addEventListener("click", redirectSearchResult)
            const labelBezeichnung = document.createElement("a")
            labelBezeichnung.textContent = data[i].bezeichnung
            const labelArtikelnummer = document.createElement("a")
            labelArtikelnummer.textContent = data[i].artikel_nummer
            const labelHersteller = document.createElement("a")
            labelHersteller.textContent = data[i].hersteller.name
            const img = document.createElement("img")
            img.classList.add("searchResultImg")
            img.src = data[i].bild
            const preis = document.createElement("a")
            preis.textContent = data[i].netto_preis.$numberDecimal
            const labelKategorie = document.createElement("a")
            labelKategorie.textContent = data[i].kategorie.name
            
            container.append(img)
            container.append(labelBezeichnung)
            container.append(labelHersteller)
            container.append(labelKategorie)
            container.append(preis)
            searchResultsContainer.append(container)
        }
    } else {
        while (searchResultsContainer.firstChild) {
            searchResultsContainer.firstChild.remove()
        }
        searchResultsContainer.style.display = "none"
    }
   
}


function clearDom() {
    while (searchResultsContainer.firstChild) {
            searchResultsContainer.firstChild.remove()
        }
}

