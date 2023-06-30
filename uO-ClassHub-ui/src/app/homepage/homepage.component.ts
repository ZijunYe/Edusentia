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
    this.speachBubble = document.querySelector('#speech') as HTMLElement;
    this.reviewButton = document.querySelector('#review-button') as HTMLElement;
    this.seeReviewsButton = document.querySelector('#see-reviews-button') as HTMLElement;
    this.searchBar = document.querySelector('.search-bar') as HTMLElement;
    this.gobackButton = document.querySelector('.goBack') as HTMLElement;

  }

  courseCode='';
  courseData : JSON | undefined;
  courseCodes: any[] = [];
  coursesArray: any[] = [];

  //HTML elements
  speachBubble!: HTMLElement;
  reviewButton!: HTMLElement;
  seeReviewsButton!: HTMLElement;
  searchBar!: HTMLElement;
  gobackButton!: HTMLElement;

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
      const allCodes = Object.values(this.courseData).map((obj: any) => Object.values(obj)[0]);
     
     //Puts all the courses into an array
     this.coursesArray = Object.values(this.courseData);
     //Puts all the UNIQUE course codes into an array
     this.courseCodes = Array.from(new Set(allCodes));
    })
  }


  filterOptions(target: EventTarget | null) {
    if (target instanceof HTMLInputElement && target.value !== null) {
      const searchValue = target.value;
      //Compares all course codes to the input user enters
      //Puts all filtered options into a list so that the li elements can display the list
      //"let option of filteredOptions" in html
      this.filteredOptions = this.courseCodes.filter(option =>
        option.toLowerCase().includes(searchValue.toLowerCase())
      );
    } else {
      this.filteredOptions = [];
    }
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
    return this.courseCodes.indexOf(input.toUpperCase()) > -1;
  }

  //Goes back to the search bar
  goBack(){
    this.speachBubble.innerHTML = "Please select a course";
    this.reviewButton.style.visibility = "hidden";
    this.seeReviewsButton.style.visibility = "hidden";
    this.searchBar.style.visibility = "visible";
    this.gobackButton.style.visibility = "hidden";
  }


  //Makes two new buttons appear (reviewButton, seeReviewsButton) while making the search bar disappear
  clickButton(){
    //Filters the coursesArray according to selected option
    const selectedOptionValues = this.coursesArray.filter(optionArr => optionArr[0] === this.selectedOption);
    this.courseCode = this.selectedOption;

    const verificationPassed = this.verifySelectedOption();
    if(verificationPassed){
      this.speachBubble.innerHTML = "Please select one of the values";
      this.searchBar.style.visibility = "hidden";
      this.reviewButton.style.visibility = "visible";
      this.seeReviewsButton.style.visibility = "visible";
      this.gobackButton.style.visibility = "visible";
    }else{
      this.speachBubble.innerHTML = "Please enter a valid course code";
    }
  }

  //Routes to overview page
  seeReviews(){
    this.router.navigate(['/overview', this.courseCode]);
  }

  //Routes to the review page
  makeReview(){
    this.router.navigate(['/review', this.courseCode]);
  }



}
