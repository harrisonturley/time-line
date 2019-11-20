package com.cpen321.cloutservices.timeline.model;

import com.google.gson.annotations.SerializedName;

public class User {

    @SerializedName("email")
    private String email;

    @SerializedName("name")
    private String name;

    @SerializedName("balance")
    private double balance;

    /* setter functions */
    public void setEmail(String email) { this.email = email; }
    public void setName(String name) { this.name = name; }
    public void setBalance(double balance) { this.balance = balance; }
}
