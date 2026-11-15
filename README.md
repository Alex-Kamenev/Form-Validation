# Form validation exercise

A browser-only registration-form validation demo. Open `index.html`, or serve this
directory with `python -m http.server 8000`. The form checks required values, username
length, email shape, password length, and matching passwords. It never submits or
stores credentials. Client-side checks are educational and do not replace server
validation in a real application. Errors are linked to their inputs for assistive
technology. Run `node --test` for the validation regression checks.
