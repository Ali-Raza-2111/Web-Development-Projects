// let str = "Ali Raza";

// if ((str[0]=='a' || str[0] == 'A')&& str.length>3) {
//     console.log("This is a good string");
// }
// else{
//     console.log("This is not a good string");
// }

// let day;
// day = 7;

// switch (day) {
//     case 1:
//         console.log("Monday");
//         break;
//     case 2:
//         console.log("Tuesday");
//         break;
//     case 3:
//         console.log("Wednesay");
//         break;
//     case 4:
//         console.log("Thursday");
//         break;
//     case 5:
//         console.log("Friday");
//         break;
//     case 6:
//         console.log("Saturday");
//         break;
//     case 7:
//         console.log("Sunday");
//         break;
//     default:
//         console.log("Invalid Day");
//         break;
// }


// Q1


// let num = 39;

// if (num%10==0) {
//     console.log("good");
// }else{
//     console.log("Bad");
// }


// Q2

// let Name = prompt("Enter user name");
// let age = prompt("Enter user age");
// alert(`Your name is ${Name} and age is ${age}`);


// q3

// let month =2;

// switch (month) {
//     case 1:
//         console.log("January,Feburary ,March");
//         break;
//     case 2:
//         console.log("April ,May ,june");
//         break;
//     case 3:
//         console.log("April,May ,June");
//         break;
    
//     case 4:
//         console.log("July,August,September");
//         break;

//     case 5:
//         console.log("October,November,December");
//         break;
//     default:
//         console.log("Invalid Number");
//         break;
// }

// Q4

// let str = "ali";

// if ((str[0]=='a'||str[0]=='A')&&str.length>=5) {
//     console.log("This is a golden string");
// }else{
//     console.log("This is not a golden string");
// }


// Q5
let n1 = 5,n2 = 10,n3 = 7 ,max;

if((n1>n2)&&(n1 > n3) ){
    max = n1;
}else if((n2>n1)&&(n2>n3)){
    max = n2;
}else{
    max = n3;
}

// console.log("Grater number is ",max);


// Q6

let num1 = "32";
let num2 = "2523";

if ((num1[num1.length -1] && num2[num2.length -1]) === "2")  {
    console.log("The have same digit");
}else{
    console.log("The don't have same digit");
}