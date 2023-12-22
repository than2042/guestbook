const formMessage = document.getElementById("submit");
let count = 0;

console.log(count);

formMessage.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(formMessage);
  const formValue = Object.fromEntries(formData);

  const response = await fetch("http://localhost:8080/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formValue),
  });

  const json = await response.json();
  formMessage.reset(); // reset the form

  displayMessage(json);
});

const updateLikeCount = () => {
  const likeCountElements = document.querySelectorAll(".likeCount");
  likeCountElements.forEach((element) => {
    element.textContent = ` ${count} Likes`;
  });
};

const createMessageContainer = (item) => {
  const div = document.createElement("div");
  const pName = document.createElement("p");
  const pMessage = document.createElement("p");
  const pIcon = document.createElement("p");
  const pDelete = document.createElement("p");

  div.classList.add("messageContainer");
  div.dataset.messageId = item.id;

  pName.textContent = "User Name: " + item.userName;
  pMessage.textContent = "Message: " + item.message;

  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fas", "fa-times");
  pDelete.classList.add("deleteIcon");
  pDelete.append(deleteIcon);
  deleteIcon.addEventListener("click", async (e) => {
    e.stopPropagation();
    const messageContainer = e.target.closest(".messageContainer");
    const messageId = messageContainer.dataset.messageId;
    deleteMessageId(messageId);
    displayMessage();
  });

  const likeIcon = document.createElement("i");
  likeIcon.classList.add("fas", "fa-thumbs-up");
  pIcon.classList.add("likeIcon");
  pIcon.append(likeIcon);
  likeIcon.addEventListener("click", function (e) {
    e.stopPropagation();
    count++;
    updateLikeCount();
  });

  const likeCount = document.createElement("span");
  likeCount.classList.add("likeCount");
  likeCount.textContent = ` ${count}`;
  console.log(likeCount);

  div.append(pName, pMessage, pDelete, pIcon, likeCount);
  return div;
};

async function displayMessage() {
  const response = await fetch("http://localhost:8080/message");
  const messages = await response.json();

  const showMessage = document.getElementById("displayContainer");
  showMessage.innerHTML = "";

  messages.forEach((item) => {
    const messageContainer = createMessageContainer(item);
    showMessage.appendChild(messageContainer);
  });
}

async function deleteMessageId(messageId) {
  try {
    const response = await fetch(
      `http://localhost:8080/delete-message/${messageId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      displayMessage();
    } else {
      console.error(
        "Failed to delete message. Server response:",
        response.status
      );
    }
  } catch (error) {
    console.error("Error while deleting message:", error);
  }
}

displayMessage();
