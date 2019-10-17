package com.cpen321.cloutservices.timeline.model;

import com.google.gson.annotations.SerializedName;

public class Notification {

    @SerializedName("Token")
    private String token;

    public Notification(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
