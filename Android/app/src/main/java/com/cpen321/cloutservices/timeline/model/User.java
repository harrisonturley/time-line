package com.cpen321.cloutservices.timeline.model;

import com.google.gson.annotations.SerializedName;

public class User {
    private User user;

    @SerializedName("email")
    private String email;

    @SerializedName("name")
    private String name;

    @SerializedName("balance")
    private int balance;



    public User getUser() { return user; }

    public void setEmail(String email) { this.email = email; }
    public void setName(String name) { this.name = name; }
    public void setBalance(int balance) { this.balance = balance; }
    public String getEmail() { return email; }
    public String getName() { return name; }
    public int getBalance() { return balance; }
}
