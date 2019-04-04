/* global LANDING, from js/init.js */

/* Form
 ******************************/
;(function() {
  var me = {};
  var form = document.querySelector('.form-container');
  var closeButton = null;

  function onClose(event) {
    event.preventDefault();

    me.close();
    closeButton.removeEventListener('click', onClose);
  }

  function escClose(event) {
    if (event.key === 'Escape' || event.keyCode === 27) {
      me.close();
      window.removeEventListener('keydown', escClose);
    }
  }

  me.open = function() {
    form.classList.remove('is-hidden');

    closeButton = document.querySelector('.form__close-button');
    closeButton.addEventListener('click', onClose);
    window.addEventListener('keydown', escClose);
  };

  me.close = function() {
    form.classList.add('is-hidden');
  };

  me.isValid = function() {
    var requiredFields = document.querySelectorAll('[data-valid="required"]');
    var emailValue = document.querySelector('[data-email]').value;
    var numberValue = document.querySelector('[data-number]').value;

    if (!me.isAllCompleted(requiredFields)) {
      console.log('Заполните, пожалуйста, все необходимые поля' );
      return false;
    } else if (!LANDING.validation.isEmail(emailValue)) { //LANDING.validation from js/validation.js
      console.log('Не верный email');
      return false;
    } else if (!LANDING.validation.isNumber(numberValue)) { //LANDING.validation from js/validation.js
      console.log('Не верный номер');
      return false;
    }

    return true;
  };

  me.isAllCompleted = function(data) {
    var result = true;

    for (var i = 0; i < data.length; i++) {

      if (!LANDING.validation.isNotEmpty(data[i].value)) { //LANDING.validation from js/validation.js
        result = false;
        break;
      }
    }

    return result;
  };

  LANDING.form = me;
}());