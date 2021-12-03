window.addEventListener('load', () => {
  const form = document.querySelector('form');
  const inputFields = document.querySelectorAll('input:not([type="reset"]):not([type="submit"])');
  const textArea = document.querySelector('textarea');
  const btnSend = document.querySelector('input[type="submit"]');
  const requiredFields = document.querySelectorAll('.required');
  const submitMsg = document.querySelector('.submit-msg');

  // Global array för ev. fel i formuläret
  window.formFieldErrors = [];

  // Kontrollera att alla formulärfält fylls i
  btnSend.disabled = true;
  for (let i = 0; i < requiredFields.length; i++) {
    requiredFields[i].addEventListener('input', function () {
      btnSend.disabled = false;
      for (let j = 0; j < requiredFields.length; j++) {
        if (!requiredFields[j].value) btnSend.disabled = true;
      }
    });
  }

  // Gör kontroller när formuläret skickas
  form.addEventListener(
    'submit',
    (e) => {
      if (formFieldErrors.length > 0) {
        formFieldErrors.forEach((id) => {
          document.querySelector(`label[for="${id}"]`).children[0].classList.add('hidden');
        });
      }
      formFieldErrors = [];
      submitMsg.classList.add('hidden');

      inputFields.forEach((element) => {
        if (element.id === 'author') validate(element, isValidInput);
        if (element.id === 'email') validate(element, isValidEmail);
      });

      //validate(textArea, isValidTextArea);

      if (formFieldErrors.length > 0) {
        e.preventDefault();
        formFieldErrors.forEach((id) => {
          document.querySelector(`label[for="${id}"]`).children[0].classList.remove('hidden');
        });
      }
    },
    true
  );

  // Funktioner för validering
  function validate(element, callback) {
    if (!callback(element.value)) formFieldErrors.push(element.id);
  }

  // function isValidTextArea(input) {
  //   const regex = /^[\w\d\s]+$/i;
  //   return regex.test(input);
  // }

  function isValidInput(input) {
    const regex = /^[a-ö, -]{2,}$/i;
    return regex.test(input);
  }

  function isValidEmail(input) {
    const regex = /^[a-z0-9]+\.*[a-z0-9]*@[a-z0-9]+\.[a-z]{2,4}$/i;
    return regex.test(input);
  }
});
