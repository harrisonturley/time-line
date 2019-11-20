package com.cpen321.cloutservices.timeline.model;

import java.util.List;

public class ContributedRestaurants {
    /* Singleton class for list of restaurants */
    private static ContributedRestaurants instance = null;

    public static ContributedRestaurants getInstance() {
        if(instance == null) {
            instance = new ContributedRestaurants();
        }
        return instance;
    }

    /* private field */
    private List<Restaurant> restaurants;

    /* public methods */
    public List<Restaurant> getContributedRestaurants() {
        return restaurants;
    }

    public void addContributedRestaurants(Restaurant restaurant) {
        if (restaurants.size() > 10) {
            restaurants.remove(0);
            restaurants.add(restaurant);
        }
        restaurants.add(restaurant);
    }

}
