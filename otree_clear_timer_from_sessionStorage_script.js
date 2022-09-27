/* ==== Remove the timer content from sessionStorage ==== */
// Script for removing the stored values from the browser's sessionStorage

document.addEventListener('DOMContentLoaded', (event) => {
    sessionStorage.removeItem('roundNumber');
    sessionStorage.removeItem('timeLeftOver');
    sessionStorage.removeItem('clockLeftOver');
});
