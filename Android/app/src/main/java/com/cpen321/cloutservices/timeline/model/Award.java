package com.cpen321.cloutservices.timeline.model;

public class Award {
    private String url;
    private String name;
    private int cost;
    private String description;

    // constructor
    public Award(String url, String name, int cost, String description) {
        this.url = url;
        this.name = name;
        this.cost = cost;
        this.description = description;
    }

    // getter/setter methods
    public String getURL() {
        return url;
    }

    public String getName() {
        return name;
    }

    public int getCost() {
        return cost;
    }

    public String getDescription() {
        return description;
    }

    public void setURL(String url) {
        this.url = url;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCost(int cost) {
        this.cost = cost;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
