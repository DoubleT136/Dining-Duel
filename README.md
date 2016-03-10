# Project Title: Dining Duel
#### By: Elizabeth Lanzilla, Tommy Tang, Derick Yang, and Zach Zager

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

### Mockup photos

![mockup 1](http://i1318.photobucket.com/albums/t645/diningduel/mobile_food_ratings_zpspridytyw.png)
![mockup 2](http://i1318.photobucket.com/albums/t645/diningduel/mobile_front_page_zpszeku1ixb.png)
![mockup 3](http://i1318.photobucket.com/albums/t645/diningduel/mobile_vegetarian_prompt_zpsvrh24lb5.png)
![mockup 4](http://i1318.photobucket.com/albums/t645/diningduel/desktop_view_zpsgg1axfz3.png)
![mockup 5](http://i1318.photobucket.com/albums/t645/diningduel/mobile_simple_menu_zpsbvbykcp0.png)
![mockup 6](http://i1318.photobucket.com/albums/t645/diningduel/desktop_vegetarian_prompt_zps5gy5i8p8.png)
