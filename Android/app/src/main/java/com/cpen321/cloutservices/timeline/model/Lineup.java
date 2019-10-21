package com.cpen321.cloutservices.timeline.model;

import com.google.gson.annotations.SerializedName;

public class Lineup {
    @SerializedName("id")
    private String restaurantId;

    @SerializedName("lineupTime")
    private Integer lineupTime;

    public String getRestaurantId() { return restaurantId; }
    public void setRestaurantId(String restaurant) { this.restaurantId = restaurant; }

    public Integer getLineupTime() { return lineupTime; }
    public void setLineupTime(Integer lineupTime) { this.lineupTime = lineupTime; }

    public Lineup(String restaurantId, Integer lineupTime) {
        this.restaurantId = restaurantId;
        this.lineupTime = lineupTime;
    }

}
