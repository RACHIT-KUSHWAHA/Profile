const cfConfig = {
  error: {
    title: "Error!",
    message: GEBID("contactform").getAttribute("error_text") ||
      "Sorry, an error occurred while receiving your message, Try contacting me with another method.",
  },
  success: {
    title: "Message Sent Successfully.",
    message: GEBID("contactform").getAttribute("success_text") ||
      "Thank you for contacting me, I'll get back to you soon.",
  },
};

GEBID("cfbutton").addEventListener("click", async function cfSubmitMessage(e) {
  e.preventDefault()
  var cfvalue = {
    name: GEBID("cfname").value,
    email: GEBID("cfemail").value.toLowerCase(),
    tg_username: GEBID("cftgusername").value,
    subject: GEBID("cfsubject").value,
    message: GEBID("cfmessage").value,
  };

  let emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

  if (cfvalue.name === "") {
    GEBID("cfname").classList.add("error");
  } else if (!emailRegex.test(cfvalue.email)) {
    GEBID("cfemail").classList.add("error");
  } else if (cfvalue.tg_username === "") {
    GEBID("cftgusername").classList.add("error");
  } else if (cfvalue.subject === "") {
    GEBID("cfsubject").classList.add("error");
  } else if (cfvalue.message === "") {
    GEBID("cfmessage").classList.add("error");
  } else {
    GEBID("cfbutton").removeAttribute("onclick");
    GEBID("cfbutton").classList.remove("color");
    GEBID("cfbutton").classList.add("onclick");
    GEBID("cfbutton").innerHTML = "Sending...";

    try {
      var sendmessage = await (
        await fetch(
          document
          .getElementById("contactform")
          .getAttribute("form_worker_url"),
          {
            method: "POST",
            body: JSON.stringify(cfvalue),
          }
        )
      ).json();

      if (sendmessage.status) {
        document.querySelector(".f-cont").innerHTML = createHtmlFromObj(
          cfConfig.success
        );

        localStorage.setItem(
          "contact-form",
          JSON.stringify({
            sent: true,
            canSendUnix: new Date().getTime() + 43200000,
          })
        );
      } else {
        throw new Error("Error");
      }
    } catch (error) {
      console.log(error);
      document.querySelector(".f-cont").innerHTML = createHtmlFromObj(cfConfig.error);
    }
  }
})

function cfonChange(id) {
  GEBID(id).classList.remove("error");
}

function GEBID(id) {
  return document.getElementById(id);
}

function createHtmlFromObj({ title, message }) {
  return `<h3 class="title">${title}</h3><p class="pmsg">${message}</p>`;
}