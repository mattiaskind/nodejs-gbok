window.addEventListener(
  'load',
  () => {
    //const formBtn = document.querySelector('input[type="submit"');
    const form = document.querySelector('form');
    const inputFields = document.querySelectorAll('input:not([type="reset"]):not([type="submit"])');
    const textArea = document.querySelector('textarea');
    const btnSend = document.querySelector('input[type="submit"]');
    const requiredFields = document.querySelectorAll('.required');

    window.formFieldErrors = [];

    btnSend.disabled = true;
    for (let i = 0; i < requiredFields.length; i++) {
      requiredFields[i].addEventListener('input', function () {
        btnSend.disabled = false;
        for (let j = 0; j < requiredFields.length; j++) {
          if (!requiredFields[j].value) btnSend.disabled = true;
        }
      });
    }

    form.addEventListener('submit', (e) => {
      console.log('form submit');

      inputFields.forEach((element) => {
        if (element.id === 'author') validate(element, isValidInput);
        if (element.id === 'email') validate(element, isValidEmail);
      });

      validate(textArea, isValidInput);

      if (formFieldErrors.length > 0) {
        console.log('errors found');
        e.preventDefault();
      }
    });

    function validate(element, callback) {
      if (!callback(element.value)) formFieldErrors.push(element.id);
    }

    function isValidInput(input) {
      const regex = /^[a-ö, -]{2,}$/i;
      return regex.test(input);
    }

    function isValidEmail(input) {
      const regex = /^[a-z0-9]+\.*[a-z0-9]*@[a-z0-9]+\.[a-z]{2,4}$/i;
      return regex.test(input);
    }
  },
  true
);
