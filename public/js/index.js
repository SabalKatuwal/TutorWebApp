const burgerIcon = document.querySelector(".burger");
const nav = document.querySelector(".nav-links");
const navLinks = document.querySelectorAll(".nav-links li");  // gives an array of all navlinks class list items
const favBtn = document.querySelector(".fav-btn")

burgerIcon.addEventListener("click", function(){

    //Toggle Nav in Mobile View
    nav.classList.toggle("nav-active");

    // Animate Links in Nav during the toggle
    navLinks.forEach(function(linkElement, index) {

        // console.log(index);
        if(linkElement.style.animation) {
            linkElement.style.animation = '';
        } else {
            linkElement.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;  // using template literals. its not a single quote, its a back-tick  
            console.log(index/7 + 1.5);
        }

    });

    // Burger Animation (to cross symbol)
    this.classList.toggle("toggle");  // adds/removes a class named toggle to burgerIcon element object
});


// Login js
const sign_in_btn =document.querySelector('#sign-in-button');
const sign_up_btn =document.querySelector('#sign-up-button');
const container =document.querySelector('.container');

sign_up_btn.addEventListener('click',()=>{
    container.classList.add('sign-up-mode');
});

sign_in_btn.addEventListener('click',()=>{
    container.classList.remove('sign-up-mode');
});
