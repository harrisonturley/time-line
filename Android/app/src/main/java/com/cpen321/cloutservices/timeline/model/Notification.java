package com.cpen321.cloutservices.timeline.model;

import com.google.gson.annotations.SerializedName;

public class Notification {

    @SerializedName("registrationToken")
    private String registrationToken;

    @SerializedName("restaurantId")
    private String restaurantId;

    public Notification(String token, String restaurantId) {
        this.registrationToken = token;
        this.restaurantId = restaurantId;
    }

    public String getToken() {
        return registrationToken;
    }

    public void setToken(String token) {
        this.registrationToken = token;
    }

    public String getRestaurantId() {
        return restaurantId;
    }
}
