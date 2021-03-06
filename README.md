# Project Title: Dining Duel
## Live URL: https://diningduel.herokuapp.com/
#### By: Elizabeth Lanzilla, Luke Machamer, Tommy Tang, Derick Yang, and Zach Zager

### Problem statement
Tufts students often have trouble deciding whether to eat at Carmichael or Dewick-Macphie dining hall. Dining Duel makes the choice easy, with a compiled cumulative score for each dining hall.

### Solving the problem
We make it easy to decide on the right place to go, by compiling a cumulative score for each dining hall at a specific meal.  We will use a database and server-side score-compilation algorithms to create scores between Tufts’ two dining halls.

### Features we will implement
Technologies
- Geolocation, which will factor into the calculation for a cumulative score
- Server-side database (MongoDB), to keep track of food items, the photo, the number of upvotes/downvotes, and the date on which the votes were made.
- A front-end web framework (Bootstrap), in order to make our site mobile-friendly
- Screen scraping, in order to collect menu items for the day in order to compile our score.
Features
- Vegetarian popup option on page load.
- Displays weight bar for quality of food in either dining hall
- Upvoting and downvoting for each food item, which is then saved to our database
- Displays current vote totals for each food item

### Data
#### Our prototype will be collecting the following data, stored in a MongoDB database:
We will also be collecting daily menu items from the Tufts Menu website
Database of food reviews:
- Name of food
- Upvote count
- Downvote count
- Date of data collection
- Image URL

### Algorithms or special techniques
* Pulling data from the Carmichael and Dewick menus will require screen scraping,
* Our algorithm for our cumulative score is the following, where the sums are over the food items:

```
(sum[over items]((upvotes/(upvotes + downvotes)))*item weight) / (sum[over items](item weight))
```

* We will sort the food items from the most popular to least popular on the menu pages.

###Final Presentation
![final presentation](https://lh3.googleusercontent.com/-AQ2Mtxb0sUE/VymGYfk8JdI/AAAAAAAAAMw/A7wDI0-haYwR1so46keA_kSGImlFRsU3wCCo/s770/Final_Presentation.jpg)
