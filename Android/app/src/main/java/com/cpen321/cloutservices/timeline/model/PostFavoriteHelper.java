package com.cpen321.cloutservices.timeline.model;

import com.google.gson.annotations.SerializedName;

public class PostFavoriteHelper {
    @SerializedName("restaurant")
    private Restaurant restaurant;

    @SerializedName("registrationToken")
    private String registrationToken;

    public PostFavoriteHelper(Restaurant restaurant, String registrationToken) {
        this.restaurant = restaurant;
        this.registrationToken = registrationToken;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public String getRegistrationToken() {
        return registrationToken;
    }
}
