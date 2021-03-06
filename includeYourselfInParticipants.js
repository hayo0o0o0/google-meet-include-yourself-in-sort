let amountOfParticipants;
const injectNameCorrectPosition = () => {
    let isParticipantsOpen = document.querySelector('[data-tab-id]');    
    if (!isParticipantsOpen) {
        // If participants list is closed, do not do anything.
        amountOfParticipants = 0;
        return;
    }
    isParticipantsOpen = isParticipantsOpen.classList.length == 1;
    
    if(!isParticipantsOpen){
        // If the participants tab has 2 classes it is hidden. 
        amountOfParticipants = 0;
        return;
    }
    const participantsList = document.querySelector('[aria-label="Participants"]');
    const participantsItems = Array.from(participantsList.children ?? []);
    if(amountOfParticipants === participantsItems.length){
        // Amount of participants didn't change.
        return;
    }
    let youDiv;
    let presentationDiv;
    //Find You segment
    participantsItems.forEach(element => {
        var spanElements = Array.from(element.getElementsByTagName("span"));
        spanElements.forEach(spElement => {
            if (spElement.innerText === "(You)") {
                youDiv = element;
            }
        })
        var divElements = Array.from(element.getElementsByTagName("div"));
        divElements.forEach(divElement => {
            if (divElement.innerText == "Your presentation") {
                presentationDiv = element
            }
        })
    });
    if (!youDiv) {
        return;
    }
    amountOfParticipants = participantsItems.length;
    const [youElement] = youDiv.getElementsByTagName('span');
    youDiv.remove();
    if (presentationDiv) {
        presentationDiv.remove();
    }
    var participantsWithoutElementsToAdd = participantsItems.filter(element => {
        return element != youDiv && element != presentationDiv;
    });

    for (var index = 0; index < participantsWithoutElementsToAdd.length; index++) {
        const [nameElement] = participantsWithoutElementsToAdd[index].getElementsByTagName('span');
        if (nameElement) {
            const participantName = nameElement.innerText;
            if (new Intl.Collator().compare(youElement.innerText.toLowerCase(), participantName.toLowerCase()) < 0) {
                const yourName = youElement.innerText;
                console.log(nameElement.innerText + " is bigger than " + yourName);
                let removedElementsToAdd = [];
                for (let i = index; i < participantsWithoutElementsToAdd.length; i++) {
                    removedElementsToAdd.push(participantsWithoutElementsToAdd[i])
                    participantsWithoutElementsToAdd[i].remove();
                }
                ParticipantsToAdd(participantsList, [youDiv, presentationDiv]);
                removedElementsToAdd.forEach(element => {
                    participantsList.append(element);
                })
                return;
            }
        }
    }
    // nothing is smaller then name, it should be last value then                
    ParticipantsToAdd(participantsList, [youDiv, presentationDiv]);

    return;
};
setInterval(injectNameCorrectPosition, 1000);

function ParticipantsToAdd(participantsList, participantsToAdd) {
    participantsToAdd.forEach(participant => {
        if(participant){
            participantsList.append(participant);
        }        
    })    
}
