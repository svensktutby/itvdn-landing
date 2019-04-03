/* jshint esnext: true */

/* Main
 ******************************/
;(function() {
  // Add event listener for open form button
  var openFormButton = document.querySelector('.arrow-down');

  if (openFormButton) {
    openFormButton.addEventListener('click', function (event) {
      event.preventDefault();

      form.open(); // variable (form) from file form.js
    });
  }
}());