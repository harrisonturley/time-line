package com.cpen321.cloutservices.timeline.model;

import com.google.gson.annotations.SerializedName;

public class Favorites {

    @SerializedName("favorites")
    private String[] favorites;

    public String[] getFavorites() {
        return favorites;
    }

    public String getFavoritesString() {
        return "";
    }
}
