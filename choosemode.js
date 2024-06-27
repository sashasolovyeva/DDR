let lilstar = document.getElementById('star');
let divs = document.querySelectorAll('.mode');

let currentItem = 0;
let leftPressed = false;
let rightPressed = false;

document.addEventListener('keydown', (event) => {
    if (selectMode) {
        switch (event.key) {
            case 'ArrowUp':
                console.log(currentItem);
                if (currentItem > 0) {
                    currentItem--;
                    moveImage();
                }
                break;
            case 'ArrowDown':
                if (currentItem < divs.length - 1) {
                    currentItem++;
                    moveImage();
                }
                break;
            case 'ArrowLeft':
                leftPressed = true;
                break;
            case 'ArrowRight':
                rightPressed = true;
                break;
        }
    
        if (leftPressed && rightPressed) {
            console.log(divs[currentItem].id)
            selectMode = false;
    
            document.querySelector('.instructions').style.display = 'none';
            document.querySelector('.chooseModeWidget').style.display = 'none';
            setTimeout(function() {
                playMode = divs[currentItem].id;
            }, 1000)
        }
    }
});

function moveImage() {
    // Remove the image from the current box
    divs.forEach(div => {
        if (div.contains(lilstar)) {
            div.removeChild(lilstar);
        }
    });
    // Add the image to the new box
    divs[currentItem].prepend(lilstar);
}