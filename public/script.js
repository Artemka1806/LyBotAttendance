// Додати контейнер для радіобатонів
const radioContainer = document.createElement("div");
radioContainer.style.cssText = "position: top; z-index: 1000; top: 0px; right: 150px; z-index: 1000; background-color: #f9f9f9; padding: 10px; border-radius: 5px; box-shadow: 0px 2px 5px rgba(0,0,0,0.2);";

// Створити радіобатони
radioContainer.innerHTML = `
    <label style="margin-right: 10px;">
        <input type="radio" name="chat_id" value="-1002236534502" checked> LyBot Group
    </label>
    <label>
        <input type="radio" name="chat_id" value="-4045629101"> Відвідування
    </label>

`;

// Додати радіобатони на сторінку
document.body.prepend(radioContainer);

// Додати кнопку на сторінку
const button = document.createElement("button");
button.id = "sendToTelegram";
button.textContent = "to Telegram";
button.style.cssText = " padding: 10px 20px; background-color: #0088cc; color: white; border: none; border-radius: 5px; cursor: pointer;"
radioContainer.append(button);


// ID бота та URL для API
const BOT_TOKEN = "7464687694:AAGlqoc2mmJrQx2g_JkGGHEhfEl6SbkLFm0";
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

// Обробник натискання кнопки
button.addEventListener("click", async () => {
  try {
    // Отримати вибране CHAT_ID
    const selectedChatID = document.querySelector('input[name="chat_id"]:checked').value;

    //Отримати назву вибраного чату
    const selectedChatName = document.querySelector('input[name="chat_id"]:checked').nextSibling.textContent.trim();


    // Читання тексту з буфера обміну
    const clipboardText = await navigator.clipboard.readText();



    if (!clipboardText) {
      alert("Clipboard is empty!");
      return;
    }

    //--------------------------------------------------------------------------------------
    const lines = clipboardText.split("\n");
    let header = [];
    let names = [];
    let isSortingSection = false;

    for (const line of lines) {
      if (line.includes(":")) {
        isSortingSection = true;
      }
      if (isSortingSection) {
        names.push(line);
      } else {
        header.push(line);
      }
    }

    // Видаляємо заголовок списку перед сортуванням
    const title = names.shift();

    // Сортування за прізвищем з урахуванням української локалізації
    names.sort((a, b) => {
      const lastNameA = a.split(" ")[0];
      const lastNameB = b.split(" ")[0];
      return lastNameA.localeCompare(lastNameB, "uk");
    });

    // Відновлюємо структуру тексту
    const sortedText = [...header, title, ...names].join("\n");
    console.log(sortedText);

    //--------------------------------------------------------------------------------------

    //Показ вікна з текстом, чатом та кнопками підтвердження та відміни і після підтвердження відправка повідомлення
    if (confirm(`Надіслати в ${selectedChatName}?\n\n${sortedText}`)) {
      // Надсилання повідомлення до вибраного чату
      const response = await fetch(TELEGRAM_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_name: selectedChatName,
          chat_id: selectedChatID,
          text: sortedText
        })
      });

      if (!response.ok) {
        throw new Error(`Telegram API error: ${response.statusText}`);
      }

      alert(`Надіслано в групу ${selectedChatName} \n\n${sortedText}`);
    }


  } catch (error) {
    console.error("Error:", error);
    alert("Failed to send message.");
  }
});
