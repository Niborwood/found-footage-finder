//  --- REAL TIME SLP [https://www.plus2net.com/javascript_tutorial/clock.php]
display_ct();
function display_c() {
    let refresh = 1000;
    let mytime = setTimeout('display_ct()', refresh); // eslint-disable-line
}
function display_ct() {
    let date = new Date();
    function zeroDigits(digit) {
        if (digit < 10) {
            return `0${digit}`;
        } else {
            return digit;
        }
    }
    let timeDisplay = zeroDigits(date.getHours()) + ':' + zeroDigits(date.getMinutes()) + ':' + zeroDigits(date.getSeconds());
    document.getElementById('current-time').innerHTML = timeDisplay;
    display_c();
}