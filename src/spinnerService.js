const $ = window.jQuery;

function showSpinner() {
    if (!document.body.className.includes('show-spinner')) {
        document.body.className += ' show-spinner';
        setTimeout(() => {
            hideSpinner();
        }, 500);
    }
    
}

function hideSpinner() {
    $('body').removeClass('show-spinner');
}

export const spinnerService = {
    showSpinner,
    hideSpinner
};