package com.cpen321.cloutservices.timeline.model;

import com.google.gson.annotations.SerializedName;

public class Notification {

    @SerializedName("registrationToken")
    String notificationToken;

    public Notification(String token) {
        this.notificationToken = token;
    }

    public String getToken() {
        return notificationToken;
    }

    public void setToken(String token) {
        this.notificationToken = token;
    }
}
