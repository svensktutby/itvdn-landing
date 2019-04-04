/* global LANDING, from js/init.js */

/* Main
 ******************************/
;(function() {
  // Add event listener for open form button
  var openFormButton = document.querySelector('.arrow-down');
  var form = document.querySelector('.form');
  var nav = document.querySelector('.nav');

  if (openFormButton) {
    openFormButton.addEventListener('click', function (event) {
      event.preventDefault();
      LANDING.form.open(); //LANDING.form from js/form.js
    });
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (LANDING.form.isValid()) { //LANDING.form from js/form.js
        console.log('All good');
      } else {
        console.log('Is not valid');
      }
    });
  }

  if (nav) {
    nav.addEventListener('click', function (event) {
      var target = event.target;

      if (target.tagName.toLowerCase() !== 'a') {
        return;
      }

      event.preventDefault();
      LANDING.navigation.toggleToActiveLink(target); //LANDING.navigation from js/navigation.js
    });
  }
}());