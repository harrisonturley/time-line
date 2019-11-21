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

    @SerializedName("coordinates")
    private Coordinates coordinates;

    @SerializedName("location")
    private Location location;

    public Restaurant(String id, String name, String imageUrl, double distanceFromUser, int lineupTime, Coordinates coordinates, Location location) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.distanceFromUser = distanceFromUser;
        this.lineupTime = lineupTime;
        this.coordinates = coordinates;
        this.location = location;
    }

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

    public Coordinates getCoordinates() {
        return coordinates;
    }

    public Location getLocation() {
        return location;
    }
}
