// for(let i = 0;i<=20;i++){
//     console.log(i);
// }

// Q1
// for(let  i = 1;i<15;i++){
//     if(i%2!= 0){
//         console.log(i);
//     }
// }


// Q2

// for(let i = 0;i<=10;i++){
//     if(i%2== 0){
//         console.log(i);
//     }
// }


const fav = "avatar";

let guess = prompt("Enter a movie");
while((guess != fav)&&(guess != "quit")){
    guess = prompt("You entered wrong movie.Try Again");
}
if(guess == fav){
    console.log("You entered correct movie");
}else{
    console.log("You quit the game");
}