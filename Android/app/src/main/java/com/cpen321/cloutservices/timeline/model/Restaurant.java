package com.cpen321.cloutservices.timeline.model;

import com.google.gson.annotations.SerializedName;

public class Restaurant {

    @SerializedName("id")
    private String id;

    @SerializedName("name")
    private String name;

    @SerializedName("image_url")
    private String imageUrl;

    @SerializedName("distance")
    private double distanceFromUser;

    @SerializedName("lineupTime")
    private int lineupTime;

    @SerializedName("location")
    private Location location;

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public double getDistance() {
        return distanceFromUser;
    }

    public int getLineupTime() {
        return lineupTime;
    }

    public Location getLocation() {
        return location;
    }
}
