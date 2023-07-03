import { Component } from '@angular/core';
import {ActivatedRoute, Router, Routes} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})


export class HomepageComponent {
  constructor(private router:Router, private route: ActivatedRoute,private httpClient:HttpClient ){
  }

  ngOnInit(): void {
    //Initializes the course data
    this.getAllCourseData();
    this.userName = localStorage.getItem('userName');

    this.speachBubble = document.querySelector('#speechText') as HTMLElement;
    this.reviewButton = document.querySelector('#review-button') as HTMLElement;
    this.seeReviewsButton = document.querySelector('#see-reviews-button') as HTMLElement;
    this.searchBar = document.querySelector('.search-bar') as HTMLElement;
    this.gobackButton = document.querySelector('.goBack') as HTMLElement;
    this.loginButton = document.querySelector('#loginButton_home') as HTMLInputElement;
    this.signUpButton = document.querySelector('#signUpButton_home') as HTMLInputElement;
    this.logOutButton = document.querySelector('#logOutButton_home') as HTMLInputElement;
    console.log(document.referrer);
            const lastEntryIndex = window.history.length - 1;
const lastEntry = window.history.state[lastEntryIndex];
          console.log("last entry " + lastEntry + " " + lastEntryIndex);


    if(this.userName === null){
      console.log("user not logged in")
      this.loginButton.style.visibility="visible";
      this.signUpButton.style.visibility="visible";
    }else{
      console.log("user logged in")
      console.log(this.userName);
      this.logOutButton.style.visibility="visible";
    }

    if(document.referrer!= "http://localhost:4200/"){
          const alreadySelectedClass = localStorage.getItem('selectedClass');

      if(alreadySelectedClass != null){
        this.courseCode = alreadySelectedClass;
        this.selectedClass();
      }
    }



  }

  courseCode='';
  userName: string | null = null;
  courseData : JSON | undefined;
  courseCodes: any[] = [];
  coursesArray: any[] = [];

  //HTML elements
  speachBubble!: HTMLElement;
  reviewButton!: HTMLElement;
  seeReviewsButton!: HTMLElement;
  searchBar!: HTMLElement;
  gobackButton!: HTMLElement;
  loginButton!: HTMLElement;
  signUpButton!: HTMLElement;
  logOutButton!: HTMLElement;

  //Filtered options from the input
  filteredOptions: string[] = [];
  //The option user selects from the filtered options
  selectedOption: string = '';



  getAllCourseData(){

    //Connects to the database from the /home path component
    //Get method in the /home path selects all elements from the database
    //Data holds all elements from the database
    this.httpClient.get('http://127.0.0.1:5002/home').subscribe(data => {
      
      //Converts database to JSON
      this.courseData = data as JSON;

      //Takes the first element of all arrays = the course codes
      const allCodes = Object.values(this.courseData).map((obj: any) => Object.values(obj)[1]);
     
     //Puts all the courses into an array
     this.coursesArray = Object.values(this.courseData);
     //Puts all the UNIQUE course codes into an array
     this.courseCodes = allCodes;

  
    })
  }


filterOptions(target: EventTarget | null) {
  if (!(target instanceof HTMLInputElement) || target.value === null) {
    this.filteredOptions = [];
    return;
  }

  const searchValue = target.value.toLowerCase();
  let matchingCount = 0;

  this.filteredOptions = this.courseCodes.filter(option => {
    const isMatching = option.toLowerCase().startsWith(searchValue);
    if (isMatching) {
      matchingCount++;
    }
    //STOP AFTER 4 OPTIONS TO MAKE SEARCHING FASTER
    return isMatching && matchingCount <= 4;
  });
}

  selectOption(option: string) {
    //When user clicks on the list element puts the clicked item inside the selectedOption
    this.selectedOption = option;
    this.filteredOptions = [];

    const searchInput = document.querySelector('.search-input') as HTMLInputElement;
    //Puts the selected element to the search bar 
    searchInput.value = option; 

    //This part is to make the list disappear when the user deletes their input
    searchInput.addEventListener('input', function() {
      const filteredOptions = document.querySelector('.filtered-options') as HTMLElement;
      const searchValue = this.value.trim();

      //If the searched value's length is greater than 0 display, else make the list disappear
      if (searchValue.length > 0) {
        filteredOptions.classList.add('block');
      } else {
        filteredOptions.classList.remove('none');
      }
    });
  }

  //Checks if the selected option exists in the unique course codes array
  verifySelectedOption(){
    const searchInput = document.querySelector('.search-input') as HTMLInputElement;
    const input = searchInput.value;
    console.log(input.toUpperCase())
    return this.courseCodes.indexOf(input) > -1;
  }

  //Goes back to the search bar
  goBack(){
    this.changeSpeech("Please select a course");
    this.reviewButton.style.visibility = "hidden";
    this.seeReviewsButton.style.visibility = "hidden";
    this.searchBar.style.visibility = "visible";
    this.gobackButton.style.visibility = "hidden";
    localStorage.removeItem('selectedClass');
  }


  //Makes two new buttons appear (reviewButton, seeReviewsButton) while making the search bar disappear
  clickButton(){
    //Filters the coursesArray according to selected option
    const selectedOptionValues = this.coursesArray.filter(optionArr => optionArr[1] === this.selectedOption);
    this.courseCode = this.selectedOption;
    if(this.courseCode === ""){
      this.changeSpeech("Please enter course code");
      return;
    }

    const verificationPassed = this.verifySelectedOption();
    if(verificationPassed){
      this.selectedClass();
      localStorage.setItem('selectedClass', this.courseCode);
    }else{
      this.changeSpeech("Please enter a valid course code");
    }
  }

  //Routes to overview page
  seeReviews(){
    this.router.navigate(['/overview', this.courseCode]);
    window.scrollTo(0, 0);
  }

  //Routes to the review page
  makeReview(){
    if(this.userName === null){
      console.log("Please login to make a review");
      this.changeSpeech("Please login to make a review");
      return;
    }
    this.router.navigate(['/review', this.courseCode]);
    window.scrollTo(0, 0);
  }


  //Routes to login page
  login(){
    this.router.navigate(['/login']);
    window.scrollTo(0, 0);
  }

  //Routes to signup page
  signUp(){
    this.router.navigate(['/signup']);
    window.scrollTo(0, 0);
  }

  //Routes to logout page
  logOut(){
    localStorage.removeItem('userName'); // Delete the userName from localStorage
    this.userName = null;
    this.router.navigate(['/'], { skipLocationChange: true });
    this.loginButton.style.visibility="visible";
    this.signUpButton.style.visibility="visible";
    this.logOutButton.style.visibility="hidden";
  }

  changeSpeech(text:string){
    this.speachBubble.innerHTML = text;
  }


  selectedClass(){
    this.changeSpeech("Please select one of the values");
      this.searchBar.style.visibility = "hidden";
      this.reviewButton.style.visibility = "visible";
      this.seeReviewsButton.style.visibility = "visible";
      this.gobackButton.style.visibility = "visible";

  }

}
