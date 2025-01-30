const submitButton = document.getElementById('submit-button');
const letterDate = document.getElementById('letter-date');
const letterRecipient = document.getElementById('letter-recipient');
const letterContent = document.getElementById('letter-content');
const yourName = document.getElementById('your-name');
const letterList = document.getElementById('letter-list');

const HISTORY_STORE_KEY = "mail-history"

const Mail = {

    set addMail(mail) {
        let mails = this.getMails
        mails.push(mail)
        this.setMails = mails
    },

    delete(index) {
        let mails = this.getMails
        mails.splice(index, 1)
        this.setMails = mails

    },

    set setMails(value) {
        localStorage.setItem(HISTORY_STORE_KEY, JSON.stringify(value));
    },

    get getMails() {
        return JSON.parse(localStorage.getItem(HISTORY_STORE_KEY)) || [];
    },

    get mailsToday() {
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
        return this.getMails.filter(mail => new Date(mail.date).getTime() >= startOfToday).length;
    },
    get mailsThisWeek() {
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
        const startOfWeek = startOfToday - (today.getDay() * 24 * 60 * 60 * 1000);
        return this.getMails.filter(mail => new Date(mail.date).getTime() >= startOfWeek).length;
    },
    get mailsThisMonth() {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
        return this.getMails.filter(mail => new Date(mail.date).getTime() >= startOfMonth).length;
    },

}


function populateHistory() {
    letterList.innerHTML = ''

    Mail.getMails.forEach((letter, id) => {
        const { date, recipient, content, name } = letter
        const listItem = document.createElement('li');

        listItem.innerHTML = `
      <strong>Letter ${id}:</strong> Date: ${date}
      <button onCLick="revealMailContent(event)" class="reveal-button">Reveal Content</button>
      <button onclick='deleteMail(${id})' class="delete-button">Delete</Button>
      <div class="letter-content hidden">
      <p>Dear ${recipient},</p>
      <p>${content}</p>
      <p>Thank You<p><br>
      <p>Sincerely,<br>${name}</p>
      </div>
      `;

        letterList.appendChild(listItem);
    });
}

function popuateStatastics() {
    document.getElementById('total-count').textContent = Mail.getMails.length;
    document.getElementById('daily-count').textContent = `Today: ${Mail.mailsToday} letters`;
    document.getElementById('weekly-count').textContent = `This week: ${Mail.mailsThisWeek} letters`;
    document.getElementById('monthly-count').textContent = `This month: ${Mail.mailsThisMonth} letters`;
}


submitButton.addEventListener('click', () => {
    const date = letterDate.value;
    const recipient = letterRecipient.value.trim();
    const content = letterContent.value.trim();
    const name = yourName.value.trim();

    const letter = {
        date, recipient, content, name
    }

    console.log(letter);

    Mail.addMail = letter

    populateHistory()
    popuateStatastics()
});

function revealMailContent(event) {
    const contentDiv = event.target.parentElement.querySelector("div")
    contentDiv.classList.toggle('hidden'); // Toggle visibility
}

function deleteMail(id) {

    Mail.delete(id)
    populateHistory()
    popuateStatastics()

}

const downloadButton = document.getElementById('download-button');
downloadButton.addEventListener('click', () => {


    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const lineHeight = 10;
    const pageWidth = 180; // A4 page width minus margins
    const pageHeight = doc.internal.pageSize.height - 20;
    let currentLine = 10;

    Mail.getMails.forEach((mail, index) => {

        doc.setFontSize(22);
        doc.text("Letter " + parseInt(parseInt(index) + 1)+ " Date: " + mail.date, 10, currentLine);
        // doc.text("Date: " + mail.date, 10, currentLine);
        currentLine += lineHeight;
        
        if (pageHeight < currentLine) {
            doc.addPage()
            currentLine = 10
        }
    });

    doc.save("sample.pdf");

});

populateHistory()
popuateStatastics()








